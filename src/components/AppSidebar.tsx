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
import { useTranslation } from "react-i18next";
import ChatHistory from "./ChatHistory";

interface AppSidebarProps {
  onSignOut: () => void;
  onTabChange: (tab: string, chatId?: string) => void;
  activeTab: string;
}

export function AppSidebar({ onSignOut, onTabChange, activeTab }: AppSidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      id: "dashboard",
      title: t("sidebar.dashboard"), 
      icon: Home 
    },
    { 
      id: "chat",
      title: t("sidebar.newChat"), 
      icon: MessageSquarePlus 
    },
    { 
      id: "image",
      title: t("sidebar.imageAnalysis"), 
      icon: Camera 
    },
    { 
      id: "risk",
      title: t("sidebar.riskPrediction"), 
      icon: BarChart3 
    }
  ];

  const secondaryItems = [
    { 
      id: "profile",
      title: t("sidebar.myProfile"), 
      icon: User,
      action: () => navigate("/profile")
    },
    { 
      id: "history",
      title: t("sidebar.chatHistory"), 
      icon: History,
      action: () => onTabChange("history")
    },
    {
      id: "settings",
      title: t("sidebar.settings"),
      icon: Settings,
      action: () => navigate("/settings")
    }
  ];

  const isActive = (itemId: string) => activeTab === itemId;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    size="lg"
                    tooltip={item.title}
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
          <SidebarGroupLabel>{t("sidebar.recentChats")}</SidebarGroupLabel>
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
                  <SidebarMenuButton asChild size="lg" tooltip={item.title}>
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
                <SidebarMenuButton asChild size="lg" tooltip={t("sidebar.logout")}>
                  <button 
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2 p-2 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span>{t("sidebar.logout")}</span>}
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