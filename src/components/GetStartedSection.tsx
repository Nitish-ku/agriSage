import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GetStartedSectionProps {
  onQuestionClick: (question: string) => void;
}

export function GetStartedSection({ onQuestionClick }: GetStartedSectionProps) {
  const { t } = useTranslation();

  const questions = [
    t("getStarted.q1"),
    t("getStarted.q2"),
    t("getStarted.q3"),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {t("getStarted.title")}
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
