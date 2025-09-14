import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MessageSquare } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  topic: string | null;
}

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
}

const ChatHistory = ({ onSelectChat }: ChatHistoryProps) => {
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("chat_history")
        .select("id, topic")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch your chat history.",
          variant: "destructive",
        });
      } else {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [toast]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">No chat history yet.</p>
      ) : (
        history.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left p-2 rounded-md hover:bg-muted flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="flex-1 truncate">{chat.topic || "Untitled Chat"}</span>
          </button>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
