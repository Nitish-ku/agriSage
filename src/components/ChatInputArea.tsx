import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Mic, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  onImageUpload: () => void;
  onVoiceInput: () => void;
  isLoading?: boolean;
}

export function ChatInputArea({ 
  onSendMessage, 
  onImageUpload, 
  onVoiceInput, 
  isLoading = false 
}: ChatInputAreaProps) {
  const [message, setMessage] = useState("");
  const { language } = useLanguage();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Camera Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onImageUpload}
            className="flex-shrink-0 bg-kerala-primary text-white border-kerala-primary hover:bg-kerala-primary/90"
          >
            <Camera className="h-5 w-5" />
          </Button>

          {/* Message Input */}
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === "en" 
                  ? "Ask me anything" 
                  : "എന്തെങ്കിലും ചോദിക്കുക"
              }
              className="w-full border-2 border-kerala-light/30 focus:border-kerala-primary"
              disabled={isLoading}
            />
          </div>

          {/* Voice Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onVoiceInput}
            className="flex-shrink-0 bg-kerala-primary text-white border-kerala-primary hover:bg-kerala-primary/90"
          >
            <Mic className="h-5 w-5" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 bg-kerala-primary hover:bg-kerala-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-3">
          {language === "en" 
            ? "Kindly verify all important information." 
            : "എല്ലാ പ്രധാന വിവരങ്ങളും പരിശോധിച്ച് ഉറപ്പാക്കുക."
          }
        </p>
      </div>
    </div>
  );
}