import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import WeatherPage from "./pages/Weather";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ChatInputArea } from "./components/ChatInputArea";
import { MainLayout } from "@/components/MainLayout"; // Import MainLayout
import { SidebarProvider } from "@/components/ui/sidebar";


import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export interface Message {
  type: "user" | "bot";
  content: string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // Add activeTab state
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (tab: string, chatId?: string) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
    if (chatId) {
      navigate(`/dashboard?tab=chat&chatId=${chatId}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    setMessages([
      {
        type: "bot",
        content: i18n.t("bot.greeting"),
      },
    ]);
  }, [i18n.language]);

  const [isLoading, setIsLoading] = useState(false);
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { type: "user", content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setActiveTab("chat");
    navigate("/dashboard?tab=chat");
    setIsLoading(true);

    const botMessage: Message = { type: "bot", content: "" };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated.");

      const response = await fetch(`${SUPABASE_URL}/functions/v1/agricultural-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ query: message, language: i18n.language }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("No response body.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content += chunk;
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error calling Supabase function:", error);
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = "Sorry, I encountered an error. Please try again.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (file: File) => {
    setIsLoading(true);
    setActiveTab("chat");
    navigate("/dashboard?tab=chat");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      if (!imageDataUrl) {
        // Handle error
        setIsLoading(false);
        return;
      }

      try {
        // 1. Add image to chat messages
        const imageMessage: Message = { 
          type: "user", 
          content: `<img src="${imageDataUrl}" alt="Uploaded plant" style="max-width: 300px; border-radius: 8px;" />` 
        };
        setMessages((prevMessages) => [...prevMessages, imageMessage]);

        // 2. Add empty bot message for streaming
        const botMessage: Message = { type: "bot", content: "" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // 3. Call the analysis function and stream the response
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("User not authenticated.");

        const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-plant-disease`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ imageDataUrl }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (!response.body) throw new Error("No response body.");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });
          
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].content += chunk;
            return newMessages;
          });
        }

      } catch (error) {
        console.error("Error during image analysis:", error);
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.type === 'bot' && lastMessage.content === '') {
            lastMessage.content = "Sorry, I encountered an error analyzing the image.";
          } else {
            newMessages.push({ type: 'bot', content: "Sorry, I encountered an error analyzing the image." });
          }
          return newMessages;
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setIsLoading(false);
    };
  };

  const handleVoiceInput = () => {
    // TODO: Implement voice input
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={<SidebarProvider><MainLayout activeTab={activeTab} onTabChange={handleTabChange}><DashboardPage messages={messages} addMessage={addMessage} /></MainLayout></SidebarProvider>}
              />
              <Route path="/weather" element={<SidebarProvider><MainLayout activeTab="weather" onTabChange={handleTabChange}><WeatherPage /></MainLayout></SidebarProvider>} />
              <Route path="/profile" element={<SidebarProvider><MainLayout activeTab="profile" onTabChange={handleTabChange}><ProfilePage /></MainLayout></SidebarProvider>} />
              <Route path="/settings" element={<SidebarProvider><MainLayout activeTab="settings" onTabChange={handleTabChange}><SettingsPage /></MainLayout></SidebarProvider>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {location.pathname === "/dashboard" && (
            <ChatInputArea
              onSendMessage={handleSendMessage}
              onImageSelect={handleImageSelect}
              onVoiceInput={handleVoiceInput}
            />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;