import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Thermometer, Droplets, Zap, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Language } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

interface RiskPredictionProps {
  language: Language;
}

interface RiskResult {
  overall: "low" | "medium" | "high";
  factors: {
    temperature: "low" | "medium" | "high";
    humidity: "low" | "medium" | "high";
    pH: "low" | "medium" | "high";
  };
  recommendations: string[];
  confidence: number;
}

export const RiskPrediction = ({ language }: RiskPredictionProps) => {
  const [formData, setFormData] = useState({
    crop: "",
    temperature: "",
    humidity: "",
    pH: "",
    season: "",
    location: ""
  });
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getCurrentUser();
  }, []);

  const crops = {
    en: [
      { value: "rice", label: "Rice" },
      { value: "banana", label: "Banana" },
      { value: "coconut", label: "Coconut" },
      { value: "pepper", label: "Black Pepper" },
      { value: "cardamom", label: "Cardamom" },
      { value: "rubber", label: "Rubber" }
    ],
    ml: [
      { value: "rice", label: "നെൽ" },
      { value: "banana", label: "വാഴ" },
      { value: "coconut", label: "തെങ്ങ്" },
      { value: "pepper", label: "കുരുമുളക്" },
      { value: "cardamom", label: "ഏലം" },
      { value: "rubber", label: "റബ്ബർ" }
    ],
    hi: [
      { value: "rice", label: "चावल" },
      { value: "banana", label: "केला" },
      { value: "coconut", label: "नारियल" },
      { value: "pepper", label: "काली मिर्च" },
      { value: "cardamom", label: "इलायची" },
      { value: "rubber", label: "रबड़" }
    ]
  };

  const seasons = {
    en: [
      { value: "monsoon", label: "Monsoon" },
      { value: "post-monsoon", label: "Post-Monsoon" },
      { value: "winter", label: "Winter" },
      { value: "summer", label: "Summer" }
    ],
    ml: [
      { value: "monsoon", label: "മഴക്കാലം" },
      { value: "post-monsoon", label: "മഴക്കാലത്തിനു ശേഷം" },
      { value: "winter", label: "ശൈത്യകാലം" },
      { value: "summer", label: "വേനൽക്കാലം" }
    ],
    hi: [
      { value: "monsoon", label: "मानसून" },
      { value: "post-monsoon", label: "मानसून के बाद" },
      { value: "winter", label: "सर्दी" },
      { value: "summer", label: "गर्मी" }
    ]
  };

  const locations = {
    en: [
      { value: "palakkad", label: "Palakkad" },
      { value: "thrissur", label: "Thrissur" },
      { value: "kottayam", label: "Kottayam" },
      { value: "wayanad", label: "Wayanad" },
      { value: "kannur", label: "Kannur" }
    ],
    ml: [
      { value: "palakkad", label: "പാലക്കാട്" },
      { value: "thrissur", label: "തൃശ്ശൂർ" },
      { value: "kottayam", label: "കോട്ടയം" },
      { value: "wayanad", label: "വയനാട്" },
      { value: "kannur", label: "കണ്ണൂർ" }
    ],
    hi: [
      { value: "palakkad", label: "पालक्कड़" },
      { value: "thrissur", label: "त्रिशूर" },
      { value: "kottayam", label: "कोट्टायम" },
      { value: "wayanad", label: "वायनाड" },
      { value: "kannur", label: "कन्नूर" }
    ]
  };

  const calculateRisk = async () => {
    if (!formData.crop || !formData.temperature || !formData.humidity || !formData.pH) {
      toast({
        title: language === "en" ? "Missing Information" : language === "ml" ? "വിവരങ്ങൾ കുറവാണ്" : "लापता जानकारी",
        description: language === "en" ? "Please fill all required fields" : language === "ml" ? "ദയവായി എല്ലാ ആവശ്യമുള്ള ഫീൽഡുകളും പൂരിപ്പിക്കുക" : "कृपया सभी आवश्यक फ़ील्ड भरें",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      // Call AI risk prediction function
      const { data, error } = await supabase.functions.invoke('predict-crop-risk', {
        body: {
          crop: formData.crop,
          temperature: formData.temperature,
          humidity: formData.humidity,
          pH: formData.pH,
          season: formData.season,
          location: formData.location,
          language
        }
      });

      if (error) throw error;

      const riskResult = {
        overall: data.overallRisk as "low" | "medium" | "high",
        factors: {
          temperature: data.weatherRisk as "low" | "medium" | "high",
          humidity: data.diseaseRisk as "low" | "medium" | "high",
          pH: data.soilRisk as "low" | "medium" | "high"
        },
        recommendations: data.recommendations,
        confidence: data.confidence
      };

      // Save to database if user is authenticated
      if (user) {
        try {
          const { error: dbError } = await supabase
            .from('risk_predictions')
            .insert({
              user_id: user.id,
              crop: formData.crop,
              location: formData.location,
              season: formData.season,
              temperature: parseFloat(formData.temperature),
              humidity: parseFloat(formData.humidity),
              ph_level: parseFloat(formData.pH),
              overall_risk: riskResult.overall,
              weather_risk: riskResult.factors.temperature,
              disease_risk: riskResult.factors.humidity,
              soil_risk: riskResult.factors.pH,
              recommendations: riskResult.recommendations.join(', '),
              confidence: riskResult.confidence / 100
            });

          if (dbError) {
            console.error('Error saving risk prediction:', dbError);
          }
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      }

      setResult(riskResult);
      
      toast({
        title: language === "en" ? "Risk Assessment Complete" : language === "ml" ? "അപകടസാധ്യത വിലയിരുത്തൽ പൂർത്തിയായി" : "जोखिम मूल्यांकन पूर्ण",
        description: language === "en" ? "Risk prediction generated successfully" : language === "ml" ? "അപകടസാധ്യത പ്രവചനം വിജയകരമായി സൃഷ്ടിച്ചു" : "जोखिम भविष्यवाणी सफलतापूर्वक उत्पन्न"
      });

    } catch (error) {
      console.error('Risk calculation error:', error);
      toast({
        title: language === "en" ? "Calculation Error" : language === "ml" ? "കണക്കുകൂട്ടൽ പിശക്" : "गणना त्रुटि",
        description: language === "en" ? "Failed to calculate risk prediction" : language === "ml" ? "അപകടസാധ്യത പ്രവചനം കണക്കാക്കാൻ കഴിഞ്ഞില്ല" : "जोखिम भविष्यवाणी की गणना करने में विफल",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getRiskText = (risk: string) => {
    if (language === "en") {
      switch (risk) {
        case "high": return "High Risk";
        case "medium": return "Medium Risk";
        case "low": return "Low Risk";
        default: return "Unknown";
      }
    } else if (language === "ml") {
      switch (risk) {
        case "high": return "ഉയർന്ന അപകടം";
        case "medium": return "ഇടത്തരം അപകടം";
        case "low": return "കുറഞ്ഞ അപകടം";
        default: return "അജ്ഞാതം";
      }
    } else { // Hindi
      switch (risk) {
        case "high": return "उच्च जोखिम";
        case "medium": return "मध्यम जोखिम";
        case "low": return "कम जोखिम";
        default: return "अज्ञात";
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-kerala-primary" />
              <span>{language === "en" ? "Crop Risk Assessment" : "വിള അപകടസാധ്യത വിലയിരുത്തൽ"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="crop">{language === "en" ? "Crop Type" : "വിളയുടെ തരം"}</Label>
                <Select value={formData.crop} onValueChange={(value) => setFormData(prev => ({ ...prev, crop: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select crop" : "വിള തിരഞ്ഞെടുക്കുക"} />
                  </SelectTrigger>
                  <SelectContent>
                    {crops[language].map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">{language === "en" ? "Location" : "സ്ഥലം"}</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select location" : "സ്ഥലം തിരഞ്ഞെടുക്കുക"} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations[language].map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">{language === "en" ? "Temperature (°C)" : "താപനില (°C)"}</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="25"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="humidity">{language === "en" ? "Humidity (%)" : "ആർദ്രത (%)"}</Label>
                <Input
                  id="humidity"
                  type="number"
                  placeholder="60"
                  value={formData.humidity}
                  onChange={(e) => setFormData(prev => ({ ...prev, humidity: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pH">{language === "en" ? "Soil pH" : "മണ്ണിന്റെ pH"}</Label>
                <Input
                  id="pH"
                  type="number"
                  step="0.1"
                  placeholder="6.5"
                  value={formData.pH}
                  onChange={(e) => setFormData(prev => ({ ...prev, pH: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="season">{language === "en" ? "Season" : "കാലാവസ്ഥ"}</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select season" : "കാലാവസ്ഥ തിരഞ്ഞെടുക്കുക"} />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons[language].map((season) => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={calculateRisk} disabled={isCalculating} className="w-full">
              {isCalculating ? (
                language === "en" ? "Calculating Risk..." : "അപകടസാധ്യത കണക്കാക്കുന്നു..."
              ) : (
                language === "en" ? "Calculate Risk" : "അപകടസാധ്യത കണക്കാക്കുക"
              )}
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>
                {language === "en" 
                  ? "Risk assessment based on environmental factors and crop-specific thresholds"
                  : "പാരിസ്ഥിതിക ഘടകങ്ങളും വിള-നിർദ്ദിഷ്ട പരിധികളും അടിസ്ഥാനമാക്കിയുള്ള അപകടസാധ്യത വിലയിരുത്തൽ"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-kerala-secondary" />
              <span>{language === "en" ? "Risk Analysis" : "അപകടസാധ്യത വിശകലനം"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {language === "en" 
                    ? "Enter crop and environmental data to get risk assessment"
                    : "അപകടസാധ്യത വിലയിരുത്തലിനായി വിളയും പാരിസ്ഥിതിക വിവരങ്ങളും നൽകുക"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant={getRiskColor(result.overall)} className="text-lg px-4 py-2 mb-2">
                    {getRiskText(result.overall)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% {language === "en" ? "confidence" : "ആത്മവിശ്വാസം"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-kerala-primary" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "en" ? "Temperature" : "താപനില"}
                    </p>
                    <Badge variant={getRiskColor(result.factors.temperature)} className="text-xs">
                      {getRiskText(result.factors.temperature)}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <Droplets className="h-8 w-8 mx-auto mb-2 text-kerala-secondary" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "en" ? "Humidity" : "ആർദ്രത"}
                    </p>
                    <Badge variant={getRiskColor(result.factors.humidity)} className="text-xs">
                      {getRiskText(result.factors.humidity)}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-kerala-accent" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "en" ? "Soil pH" : "മണ്ണിന്റെ pH"}
                    </p>
                    <Badge variant={getRiskColor(result.factors.pH)} className="text-xs">
                      {getRiskText(result.factors.pH)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">
                    {language === "en" ? "Recommendations:" : "നിർദ്ദേശങ്ങൾ:"}
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm bg-muted p-3 rounded-lg flex items-start space-x-2">
                        <span className="text-kerala-primary font-bold">{index + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};