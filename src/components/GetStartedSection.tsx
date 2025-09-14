import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface GetStartedSectionProps {
  onQuestionClick: (question: string) => void;
}

export function GetStartedSection({ onQuestionClick }: GetStartedSectionProps) {
  const { language } = useLanguage();

  const questions = [
    language === "en" ? "What is the best fertilizer for rice?" : "നെല്ലിന് ഏറ്റവും നല്ല വളം ഏതാണ്?",
    language === "en" ? "How to treat banana leaf spot disease?" : "വാഴയുടെ ഇലപ്പുള്ളി രോഗം എങ്ങനെ ചികിത്സിക്കാം?",
    language === "en" ? "When is the best time to plant coconut?" : "തെങ്ങ് നടാൻ ഏറ്റവും അനുയോജ്യമായ സമയം എപ്പോഴാണ്?",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {language === "en" ? "Get Started" : "തുടങ്ങാം"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto"
              onClick={() => onQuestionClick(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
