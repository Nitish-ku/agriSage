import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Language } from "@/hooks/useLanguage";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  badge?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  language: Language;
}

export const ChatInterface = ({ language }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [queryCount, setQueryCount] = useState(0);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user and load previous messages
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadMessages(user.id);
        await loadQueryCount(user.id);
      }
    };
    getCurrentUser();
  }, [language]);

  const loadMessages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('farmer_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (error) throw error;

      const formattedMessages: Message[] = [];
      
      // Add welcome message
      formattedMessages.push({
        id: "welcome",
        type: "bot",
        content: language === "en" 
          ? "Hello! I'm your AgriSage assistant. Ask me about crops, pests, fertilizers, or farming techniques."
          : language === "ml"
            ? "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിസേജ് സഹായകനാണ്. വിളകൾ, കീടങ്ങൾ, വളങ്ങൾ അല്ലെങ്കിൽ കാർഷിക സാങ്കേതികതകളെക്കുറിച്ച് എന്നോട് ചോദിക്കുക."
            : "नमस्कार! मैं आपका एग्रीसेज सहायक हूं। मुझसे फसलों, कीटों, उर्वरकों या कृषि तकनीकों के बारे में पूछें।",
        timestamp: new Date()
      });

      data?.forEach(query => {
        // Add user message
        formattedMessages.push({
          id: `user-${query.id}`,
          content: query.query_text,
          type: 'user',
          timestamp: new Date(query.created_at)
        });
        
        // Add bot response if exists
        if (query.ai_response) {
          formattedMessages.push({
            id: `bot-${query.id}`,
            content: query.ai_response,
            type: 'bot',
            timestamp: new Date(query.created_at)
          });
        }
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadQueryCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('farmer_queries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      setQueryCount(count || 0);
    } catch (error) {
      console.error('Error loading query count:', error);
    }
  };

  const responses = {
    en: {
      banana: "For banana leaf spot, use Mancozeb 75% WP @ 2g/L water. Spray during evening hours to avoid leaf burn.",
      rice: "For rice blast disease, apply Tricyclazole 75% WP @ 0.6g/L. Ensure proper drainage in fields.",
      coconut: "For coconut root wilt, apply Trichoderma viride @ 50g per palm around root zone.",
      pepper: "For black pepper quick wilt, use Bordeaux mixture 1% spray and improve drainage.",
      default: "Thank you for your query! For specific advice on crops, pests, or diseases, please provide more details about your farming concern."
    },
    ml: {
      banana: "വാഴയുടെ ഇലപ്പുള്ളിക്ക് മാൻകോസെബ് 75% WP @ 2g/L വെള്ളത്തിൽ. സന്ധ്യാസമയത്ത് സ്പ്രേ ചെയ്യുക.",
      rice: "നെല്ലിന്റെ ബ്ലാസ്റ്റ് രോഗത്തിന് ട്രൈസൈക്ലാസോൾ 75% WP @ 0.6g/L പ്രയോഗിക്കുക.",
      coconut: "തെങ്ങിന്റെ വേര് വാട്ടത്തിന് ട്രൈക്കോഡെർമ വിരിഡെ @ 50g വേരിന് ചുറ്റും.",
      pepper: "കുരുമുളകിന്റെ പെട്ടെന്നുള്ള വാട്ടത്തിന് ബോർഡോ മിശ്രിതം 1% സ്പ്രേ ചെയ്യുക.",
      default: "നിങ്ങളുടെ ചോദ്യത്തിന് നന്ദി! വിളകൾ, കീടങ്ങൾ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് കൂടുതൽ വിവരങ്ങൾ നൽകുക."
    },
    hi: {
      banana: "केले के पत्ते के धब्बे के लिए, मैंकोजेब 75% WP @ 2g/L पानी का उपयोग करें। शाम के समय स्प्रे करें।",
      rice: "धान ब्लास्ट रोग के लिए, ट्राइसाइक्लाजोल 75% WP @ 0.6g/L लगाएं। खेतों में उचित निकासी सुनिश्चित करें।",
      coconut: "नारियल जड़ मुरझान के लिए, ट्राइकोडर्मा विराइड @ 50g प्रति हथेली जड़ क्षेत्र के चारों ओर लगाएं।",
      pepper: "काली मिर्च के तत्काल मुरझान के लिए, बोर्डो मिश्रण 1% स्प्रे का उपयोग करें और जल निकासी में सुधार करें।",
      default: "आपकी पूछताछ के लिए धन्यवाद! फसलों, कीटों, या बीमारियों पर विशिष्ट सलाह के लिए, कृपया अधिक विवरण प्रदान करें।"
    }
  };

  const badges = [
    { name: "Farm Expert", condition: 3, icon: "🏆" },
    { name: "Crop Master", condition: 5, icon: "🌾" },
    { name: "Kerala Farmer", condition: 10, icon: "🥥" }
  ];

  const getAIResponse = async (query: string): Promise<{ response: string; badge?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('agricultural-chat', {
        body: { query, language }
      });

      if (error) throw error;

      // Check for badge eligibility
      const newQueryCount = queryCount + 1;
      const eligibleBadge = badges.find(badge => newQueryCount === badge.condition);

      return { 
        response: data.response, 
        badge: eligibleBadge?.name 
      };
    } catch (error) {
      console.error('AI response error:', error);
      return { 
        response: responses[language].default 
      };
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !user || loading) return;

    setLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response
      const { response, badge } = await getAIResponse(currentMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        badge,
        timestamp: new Date()
      };

      // Save query to database
      const { error } = await supabase
        .from('farmer_queries')
        .insert({
          user_id: user.id,
          query_text: currentMessage,
          query_language: language,
          query_type: 'text',
          ai_response: response,
          response_language: language,
          confidence_score: Math.random() * 0.3 + 0.7, // Mock confidence between 0.7-1.0
        });

      if (error) throw error;

      setMessages(prev => [...prev, botMessage]);
      const newCount = queryCount + 1;
      setQueryCount(newCount);

      // Check for badge achievement
      if (badge) {
        await awardBadge(user.id, badge);
        toast({
          title: language === 'en' ? '🎉 Badge Earned!' : '🎉 ബാഡ്ജ് നേടി!',
          description: badge,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'en' ? 'Error' : 'പിശക്',
        description: language === 'en' ? 'Failed to send message' : 'സന്ദേശം അയയ്ക്കാൻ കഴിഞ്ഞില്ല',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setCurrentMessage("");
    }
  };

  const awardBadge = async (userId: string, badgeName: string) => {
    try {
      await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_type: 'chat_achievement',
          badge_name: badgeName,
        });
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-kerala-primary" />
              <span>
                {language === "en" 
                  ? "Agricultural Expert Chat" 
                  : language === "ml" 
                    ? "കാർഷിക വിദഗ്ദ്ധ ചാറ്റ്" 
                    : "कृषि विशेषज्ञ चैट"
                }
              </span>
            </div>
            <Badge variant="secondary">
              {language === "en" 
                ? `${queryCount}/10 queries today` 
                : language === "ml" 
                  ? `${queryCount}/10 ഇന്നത്തെ ചോദ്യങ്ങൾ` 
                  : `${queryCount}/10 आज के प्रश्न`
              }
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user" 
                      ? "bg-kerala-primary text-white" 
                      : "bg-muted"
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.type === "bot" ? (
                        <Bot className="h-4 w-4 mt-1 text-kerala-primary" />
                      ) : (
                        <User className="h-4 w-4 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.badge && (
                          <Badge className="mt-2 bg-kerala-accent text-white">
                            <Award className="h-3 w-3 mr-1" />
                            {message.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === "en" 
                ? "Ask about crops, pests, diseases..." 
                : language === "ml" 
                  ? "വിളകൾ, കീടങ്ങൾ, രോഗങ്ങളെക്കുറിച്ച് ചോദിക്കുക..." 
                  : "फसलों, कीटों, बीमारियों के बारे में पूछें..."
              }
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            {language === "en" 
              ? "Example queries: 'Pesticide for banana?', 'Rice disease treatment', 'Coconut fertilizer'"
              : language === "ml"
                ? "ഉദാഹരണ ചോദ്യങ്ങൾ: 'വാഴയ്ക്ക് മരുന്ന്?', 'നെല്ലിന്റെ രോഗചികിത്സ', 'തെങ്ങിന്റെ വളം'"
                : "उदाहरण प्रश्न: 'केले के लिए कीटनाशक?', 'धान रोग उपचार', 'नारियल उर्वरक'"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};