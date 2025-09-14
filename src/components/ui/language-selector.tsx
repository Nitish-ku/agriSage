import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const languageNames: { [key: string]: string } = {
  en: 'English',
  hi: 'हिन्दी',
  ml: 'മലയാളം',
};

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          {languageNames[i18n.language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage('hi')}>
          हिन्दी
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage('ml')}>
          മലയാളം
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}