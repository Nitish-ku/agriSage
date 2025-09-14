import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Message } from "@/App";

interface ChatInterfaceProps {
  messages: Message[];
}

export const ChatInterface = ({ messages }: ChatInterfaceProps) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-full pr-4">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
              {message.type === "bot" && <Bot className="w-6 h-6" />}
              <div
                className={`p-3 rounded-lg max-w-[80%] break-words ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}>
                {message.content}
              </div>
              {message.type === "user" && <User className="w-6 h-6" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
