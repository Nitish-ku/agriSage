import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/ui/language-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import agrisageLogo from "@/assets/kerala-agrisage-logo.jpg";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  full_name: string | null;
  phone: string | null;
  location: string | null;
  primary_crop: string | null;
}

interface FixedHeaderProps {
  user: SupabaseUser | null;
  profile: Profile | null;
}

export const FixedHeader = ({ user, profile }: FixedHeaderProps) => {
  const { language } = useLanguage();

  return (
    <header className="px-4 py-3 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center gap-3">
            <img src={agrisageLogo} alt="Kerala AgriSage" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-lg font-bold text-kerala-primary">
                {language === "en" ? "Kerala AgriSage" : "കേരള അഗ്രിസേജ്"}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-kerala-primary" />
            <span className="hidden sm:inline text-muted-foreground">
              {profile?.location || "Kerala"}
            </span>
          </div>
          
          <LanguageSelector />
          
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right text-sm">
              <div className="font-medium text-kerala-primary">
                {profile?.full_name || user?.email}
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-kerala-primary text-white">
                {profile?.full_name?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};