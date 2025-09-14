import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage, Language } from "@/hooks/useLanguage";

const languageNames = {
  en: 'English',
  hi: 'हिन्दी',
  ml: 'മലയാളം',
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          {languageNames[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('hi')}>
          हिन्दी
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ml')}>
          മലയാളം
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}