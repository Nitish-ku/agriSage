import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

import { ChatInterface } from "@/components/ChatInterface";
import { ImageAnalysis } from "@/components/ImageAnalysis";
import { RiskPrediction } from "@/components/RiskPrediction";
import { WeatherSection } from "@/components/WeatherSection";
import { MarketPriceSection } from "@/components/MarketPriceSection";
import { GetStartedSection } from "@/components/GetStartedSection";
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
  activeTab: string;
}

const DashboardPage = ({ messages, addMessage, activeTab }: DashboardPageProps) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isMobile = useIsMobile();



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

  return (
    <div className="p-2 sm:p-4 space-y-6">
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
        <ImageAnalysis />
      )}
      
      {activeTab === "risk" && (
        <RiskPrediction />
      )}
    </div>
  );
};

export default DashboardPage;