import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MessageCircle, 
  Camera, 
  BarChart3, 
  User, 
  History, 
  Settings, 
  LogOut,
  MessageSquarePlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/useLanguage";
import ChatHistory from "./ChatHistory";

interface AppSidebarProps {
  onSignOut: () => void;
  onTabChange: (tab: string, chatId?: string) => void;
  activeTab: string;
}

export function AppSidebar({ onSignOut, onTabChange, activeTab }: AppSidebarProps) {
  const { state } = useSidebar();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const menuItems = [
    { 
      id: "dashboard",
      title: language === "en" ? "Dashboard" : "ഡാഷ്‌ബോർഡ്", 
      icon: Home 
    },
    { 
      id: "chat",
      title: language === "en" ? "New Chat" : "പുതിയ ചാറ്റ്", 
      icon: MessageSquarePlus 
    },
    { 
      id: "image",
      title: language === "en" ? "Image Analysis" : "ചിത്ര വിശകലനം", 
      icon: Camera 
    },
    { 
      id: "risk",
      title: language === "en" ? "Risk Prediction" : "അപകടസാധ്യത പ്രവചനം", 
      icon: BarChart3 
    }
  ];

  const secondaryItems = [
    { 
      id: "profile",
      title: language === "en" ? "My Profile" : "എന്റെ പ്രൊഫൈൽ", 
      icon: User,
      action: () => navigate("/profile")
    },
    { 
      id: "history",
      title: language === "en" ? "Chat History" : "ചാറ്റ് ചരിത്രം", 
      icon: History,
      action: () => onTabChange("history")
    },
    {
      id: "settings",
      title: language === "en" ? "Settings" : "ക്രമീകരണങ്ങൾ",
      icon: Settings,
      action: () => navigate("/settings")
    }
  ];

  const isActive = (itemId: string) => activeTab === itemId;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.id) ? "bg-kerala-primary text-white" : ""}
                  >
                    <button 
                      onClick={() => onTabChange(item.id)}
                      className="w-full flex items-center gap-2 p-2"
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="border-t border-border mx-4 my-2" />

        {/* Chat History */}
        <SidebarGroup>
          <SidebarGroupLabel>{language === "en" ? "Recent Chats" : "സമീപകാല ചാറ്റുകൾ"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <ChatHistory onSelectChat={(chatId) => onTabChange("chat", chatId)} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="border-t border-border mx-4 my-2" />

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={item.action}
                      className="w-full flex items-center gap-2 p-2 hover:bg-muted"
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2 p-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span>{language === "en" ? "Logout" : "ലോഗൗട്ട്"}</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}