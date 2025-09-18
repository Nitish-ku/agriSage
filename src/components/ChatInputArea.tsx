import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Mic, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  onImageSelect: (file: File) => void;
  onVoiceInputToggle: () => void;
  isLoading?: boolean;
  isRecording?: boolean;
}

export function ChatInputArea({ 
  onSendMessage, 
  onImageSelect, 
  onVoiceInputToggle,
  isLoading = false,
  isRecording = false,
}: ChatInputAreaProps) {  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="bg-white border-t border-border p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Camera Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 bg-kerala-primary text-white border-kerala-primary hover:bg-kerala-primary/90 p-4"
            disabled={isLoading || isRecording}
          >
            <Camera className="h-7 w-7" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          {/* Message Input */}
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? t("chatInput.recording") : t("chatInput.placeholder")}
              className="w-full border-2 border-kerala-light/30 focus:border-kerala-primary text-lg p-4"
              disabled={isLoading || isRecording}
            />
          </div>

          {/* Voice Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onVoiceInputToggle}
            className={`flex-shrink-0 border-kerala-primary hover:bg-kerala-primary/90 p-4 ${
              isRecording ? 'bg-red-500 text-white' : 'bg-kerala-primary text-white'
            }`}
            disabled={isLoading}
          >
            <Mic className="h-7 w-7" />
          </Button>
          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 bg-kerala-primary hover:bg-kerala-primary/90 p-4"
            size="lg"
          >
            <Send className="h-7 w-7" />
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-3">
          {t("chatInput.disclaimer")}
        </p>
      </div>
    </div>
  );
}