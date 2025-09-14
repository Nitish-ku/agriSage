import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Camera, 
  Thermometer, 
  Award, 
  Globe,
  Smartphone,
  User,
  BookOpen
} from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { ImageAnalysis } from "@/components/ImageAnalysis";
import { RiskPrediction } from "@/components/RiskPrediction";
import { Dashboard } from "@/components/Dashboard";
import keralaAgrisageLogo from "@/assets/kerala-agrisage-logo.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [language, setLanguage] = useState<"en" | "ml">("en");

  const text = {
    en: {
      title: "Kerala AgriSage",
      subtitle: "Smart Agricultural Advisory System",
      description: "Get instant farming advice, disease detection, and risk predictions",
      chat: "Ask Expert",
      image: "Disease Detection", 
      risk: "Risk Prediction",
      dashboard: "Dashboard"
    },
    ml: {
      title: "കേരള അഗ്രിസേജ്",
      subtitle: "സ്മാർട്ട് കാർഷിക ഉപദേശ സംവിധാനം",
      description: "തൽക്ഷണ കാർഷിക ഉപദേശം, രോഗ കണ്ടെത്തൽ, അപകടസാധ്യത പ്രവചനം",
      chat: "വിദഗ്ദനോട് ചോദിക്കുക",
      image: "രോഗ കണ്ടെത്തൽ",
      risk: "അപകടസാധ്യത പ്രവചനം", 
      dashboard: "ഡാഷ്ബോർഡ്"
    }
  };

  return (
    <>
      <title>Kerala AgriSage - Smart Agricultural Advisory System</title>
      <meta name="description" content="Kerala AgriSage: Empowering farmers with instant agricultural advisory through SMS and web platform with disease detection and risk prediction." />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={keralaAgrisageLogo} 
                alt="Kerala AgriSage Logo" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-kerala-primary">{text[language].title}</h1>
                <p className="text-xs text-muted-foreground">{text[language].subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ml" : "en")}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>{language === "en" ? "മലയാളം" : "English"}</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-kerala-primary" />
                <span className="text-sm font-medium">Farmer Portal</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-kerala-primary mb-2">{text[language].title}</h2>
            <p className="text-lg text-muted-foreground mb-6">{text[language].description}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">{text[language].chat}</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">{text[language].image}</span>
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <span className="hidden sm:inline">{text[language].risk}</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">{text[language].dashboard}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ChatInterface language={language} />
            </TabsContent>

            <TabsContent value="image">
              <ImageAnalysis language={language} />
            </TabsContent>

            <TabsContent value="risk">
              <RiskPrediction language={language} />
            </TabsContent>

            <TabsContent value="dashboard">
              <Dashboard language={language} />
            </TabsContent>
          </Tabs>

          {/* SMS Simulation */}
          <Card className="mt-8 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-kerala-secondary" />
                <span>SMS Bot Simulation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div className="mb-2">📱 SMS to 9876543210:</div>
                <div className="mb-2">Farmer: "Pesticide for banana leaf spot?"</div>
                <div className="mb-2">Kerala AgriSage: "Use Mancozeb 75% WP @ 2g/L water. Spray in evening. Badge earned: Farm Expert! 🏆"</div>
                <div className="text-yellow-400">✓ Delivered in Malayalam/English</div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-kerala-light mt-12 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-kerala-primary" />
              <span className="text-kerala-primary font-semibold">SIH25076 - Kerala AgriSage</span>
            </div>
            <p className="text-muted-foreground">
              Empowering 1M+ farmers with instant agricultural advisory
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;