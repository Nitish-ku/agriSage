import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface GetStartedSectionProps {
  onQuestionClick: (question: string) => void;
}

export function GetStartedSection({ onQuestionClick }: GetStartedSectionProps) {
  const { language } = useLanguage();

  const suggestedQuestions = [
    {
      id: 1,
      question: language === "en" 
        ? "When to irrigate paddy rice in high humidity?" 
        : "ഉയർന്ന ആർദ്രതയിൽ നെല്ലിന് എപ്പോൾ നീരൊഴിക്കണം?",
      category: language === "en" ? "Irrigation" : "നീർസേചനം"
    },
    {
      id: 2,
      question: language === "en" 
        ? "Best time to plant coconut saplings in Kerala?" 
        : "കേരളത്തിൽ തേങ്ങാക്കൃഷി എപ്പോൾ ആരംഭിക്കണം?",
      category: language === "en" ? "Planting" : "നടീൽ"
    },
    {
      id: 3,
      question: language === "en" 
        ? "How to identify brown spot disease in rice?" 
        : "നെല്ലിലെ ബ്രൗൺ സ്പോട്ട് രോഗം എങ്ങനെ തിരിച്ചറിയാം?",
      category: language === "en" ? "Disease" : "രോഗം"
    },
    {
      id: 4,
      question: language === "en" 
        ? "What fertilizer is best for pepper plants?" 
        : "കുരുമുളക് ചെടികൾക്ക് ഏത് വളം ഏറ്റവും നല്ലത്?",
      category: language === "en" ? "Fertilizer" : "വളം"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-kerala-primary" />
          {language === "en" ? "Get Started" : "ആരംഭിക്കുക"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedQuestions.map((item) => (
          <button
            key={item.id}
            onClick={() => onQuestionClick(item.question)}
            className="w-full bg-gradient-to-r from-kerala-light/20 to-kerala-secondary/20 hover:from-kerala-light/30 hover:to-kerala-secondary/30 rounded-lg p-4 text-left transition-colors group border border-kerala-light/20"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-kerala-primary">
                  {item.question}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.category}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-kerala-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}