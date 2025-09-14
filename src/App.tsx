import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
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


import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export interface Message {
  type: "user" | "bot";
  content: string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // Add activeTab state
  const { language } = useLanguage();
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
        content: language === "en" ? "Hello! How can I help you today?" : "வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?",
      },
    ]);
  }, [language]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = (message: string) => {
    addMessage({ type: "user", content: message });
    navigate("/dashboard?chat=true");
    // TODO: Implement bot response
  };

  const handleImageUpload = () => {
    navigate("/dashboard?image=true");
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
              onImageUpload={handleImageUpload}
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
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>
);

export default Root;