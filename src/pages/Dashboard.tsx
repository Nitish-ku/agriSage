import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/ui/language-selector";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

import { ChatInterface } from "@/components/ChatInterface";
import { ImageAnalysis } from "@/components/ImageAnalysis";
import { RiskPrediction } from "@/components/RiskPrediction";
import { FixedHeader } from "@/components/FixedHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { WeatherSection } from "@/components/WeatherSection";
import { MarketPriceSection } from "@/components/MarketPriceSection";
import { GetStartedSection } from "@/components/GetStartedSection";
import agrisageLogo from "@/assets/kerala-agrisage-logo.jpg";
import { Message } from "@/App";

interface Profile {
  full_name: string | null;
  phone: string | null;
  location: string | null;
  primary_crop: string | null;
}

interface DashboardPageProps {
  messages: Message[];
  addMessage: (message: Message) => void;
}

const DashboardPage = ({ messages, addMessage }: DashboardPageProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("chat")) {
      setActiveTab("chat");
    } else if (params.get("image")) {
      setActiveTab("image");
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedChatId) {
      const fetchChat = async () => {
        const { data, error } = await supabase
          .from("chat_history")
          .select("messages")
          .eq("id", selectedChatId)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Could not fetch the selected chat.",
            variant: "destructive",
          });
        } else {
          setMessages(data.messages);
        }
      };

      fetchChat();
    }
  }, [selectedChatId, toast]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          navigate("/");
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, location, primary_crop')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const handleQuestionClick = async (question: string) => {
    setActiveTab("chat");
    const newMessages = [...messages, { type: "user", content: question }];
    setMessages(newMessages);

    if (!selectedChatId) {
      const { data, error } = await supabase
        .from("chat_history")
        .insert([
          {
            user_id: user?.id,
            topic: question,
            messages: newMessages,
          },
        ])
        .select("id")
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Could not create a new chat.",
          variant: "destructive",
        });
      } else {
        setSelectedChatId(data.id);
      }
    } else {
      const { error } = await supabase
        .from("chat_history")
        .update({
          messages: newMessages,
        })
        .eq("id", selectedChatId);

      if (error) {
        toast({
          title: "Error",
          description: "Could not save your message.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src={agrisageLogo} alt="Loading" className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">ലോഡ് ചെയ്യുന്നു...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-kerala-light/20">
        {/* Sidebar */}
        <AppSidebar 
          onSignOut={handleSignOut} 
          onTabChange={(tab, chatId) => {
            setActiveTab(tab);
            if (chatId) {
              setSelectedChatId(chatId);
            }
          }}
          activeTab={activeTab}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <FixedHeader user={user} profile={profile} />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {activeTab === "dashboard" && (
                <>
                  <WeatherSection />
                  <MarketPriceSection />
                  <GetStartedSection onQuestionClick={handleQuestionClick} />
                </>
              )}
              
              {activeTab === "chat" && (
                <ChatInterface messages={messages} />
              )}
              
              {activeTab === "image" && (
                <ImageAnalysis language={language} />
              )}
              
              {activeTab === "risk" && (
                <RiskPrediction language={language} />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
