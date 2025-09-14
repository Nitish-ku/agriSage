import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Thermometer, Droplets, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RiskPredictionProps {
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

export const RiskPrediction = ({ }: RiskPredictionProps) => {
  const { t, i18n } = useTranslation();
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

  const crops: { [key: string]: { value: string; label: string }[] } = {
    en: [
      { value: "rice", label: t("crops.rice") },
      { value: "banana", label: t("crops.banana") },
      { value: "coconut", label: t("crops.coconut") },
      { value: "pepper", label: t("crops.pepper") },
      { value: "cardamom", label: t("crops.cardamom") },
      { value: "rubber", label: t("crops.rubber") }
    ],
    ml: [
      { value: "rice", label: t("crops.rice") },
      { value: "banana", label: t("crops.banana") },
      { value: "coconut", label: t("crops.coconut") },
      { value: "pepper", label: t("crops.pepper") },
      { value: "cardamom", label: t("crops.cardamom") },
      { value: "rubber", label: t("crops.rubber") }
    ],
    hi: [
      { value: "rice", label: t("crops.rice") },
      { value: "banana", label: t("crops.banana") },
      { value: "coconut", label: t("crops.coconut") },
      { value: "pepper", label: t("crops.pepper") },
      { value: "cardamom", label: t("crops.cardamom") },
      { value: "rubber", label: t("crops.rubber") }
    ]
  };

  const seasons: { [key: string]: { value: string; label: string }[] } = {
    en: [
      { value: "monsoon", label: t("seasons.monsoon") },
      { value: "post-monsoon", label: t("seasons.postMonsoon") },
      { value: "winter", label: t("seasons.winter") },
      { value: "summer", label: t("seasons.summer") }
    ],
    ml: [
      { value: "monsoon", label: t("seasons.monsoon") },
      { value: "post-monsoon", label: t("seasons.postMonsoon") },
      { value: "winter", label: t("seasons.winter") },
      { value: "summer", label: t("seasons.summer") }
    ],
    hi: [
      { value: "monsoon", label: t("seasons.monsoon") },
      { value: "post-monsoon", label: t("seasons.postMonsoon") },
      { value: "winter", label: t("seasons.winter") },
      { value: "summer", label: t("seasons.summer") }
    ]
  };

  const locations: { [key: string]: { value: string; label: string }[] } = {
    en: [
      { value: "palakkad", label: t("locations.palakkad") },
      { value: "thrissur", label: t("locations.thrissur") },
      { value: "kottayam", label: t("locations.kottayam") },
      { value: "wayanad", label: t("locations.wayanad") },
      { value: "kannur", label: t("locations.kannur") }
    ],
    ml: [
      { value: "palakkad", label: t("locations.palakkad") },
      { value: "thrissur", label: t("locations.thrissur") },
      { value: "kottayam", label: t("locations.kottayam") },
      { value: "wayanad", label: t("locations.wayanad") },
      { value: "kannur", label: t("locations.kannur") }
    ],
    hi: [
      { value: "palakkad", label: t("locations.palakkad") },
      { value: "thrissur", label: t("locations.thrissur") },
      { value: "kottayam", label: t("locations.kottayam") },
      { value: "wayanad", label: t("locations.wayanad") },
      { value: "kannur", label: t("locations.kannur") }
    ]
  };

  const calculateRisk = async () => {
    if (!formData.crop || !formData.temperature || !formData.humidity || !formData.pH) {
      toast({
        title: t("risk.missingInfoTitle"),
        description: t("risk.missingInfoDesc"),
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
          language: i18n.language
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
        title: t("risk.assessmentCompleteTitle"),
        description: t("risk.assessmentCompleteDesc"),
      });

    } catch (error) {
      console.error('Risk calculation error:', error);
      toast({
        title: t("risk.calculationErrorTitle"),
        description: t("risk.calculationErrorDesc"),
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
    switch (risk) {
      case "high": return t("risk.highRisk");
      case "medium": return t("risk.mediumRisk");
      case "low": return t("risk.lowRisk");
      default: return t("risk.unknown");
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
              <span>{t("risk.cropRiskAssessment")}
</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="crop">{t("risk.cropType")}</Label>
                <Select value={formData.crop} onValueChange={(value) => setFormData(prev => ({ ...prev, crop: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("risk.selectCrop")} />
                  </SelectTrigger>
                  <SelectContent>
                    {crops[i18n.language].map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">{t("risk.location")}</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("risk.selectLocation")} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations[i18n.language].map((location) => (
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
                <Label htmlFor="temperature">{t("risk.temperature")}</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="25"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="humidity">{t("risk.humidity")}</Label>
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
                <Label htmlFor="pH">{t("risk.soilpH")}</Label>
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
                <Label htmlFor="season">{t("risk.season")}</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("risk.selectSeason")} />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons[i18n.language].map((season) => (
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
                t("risk.calculating")
              ) : (
                t("risk.calculateRisk")
              )}
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>
                {t("risk.assessmentDisclaimer")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-kerala-secondary" />
              <span>{t("risk.riskAnalysis")}
</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {t("risk.enterDataPrompt")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant={getRiskColor(result.overall)} className="text-lg px-4 py-2 mb-2">
                    {getRiskText(result.overall)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% {t("risk.confidence")}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-kerala-primary" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("risk.temperature")}
                    </p>
                    <Badge variant={getRiskColor(result.factors.temperature)} className="text-xs">
                      {getRiskText(result.factors.temperature)}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <Droplets className="h-8 w-8 mx-auto mb-2 text-kerala-secondary" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("risk.humidity")}
                    </p>
                    <Badge variant={getRiskColor(result.factors.humidity)} className="text-xs">
                      {getRiskText(result.factors.humidity)}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-kerala-accent" />
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("risk.soilpH")}
                    </p>
                    <Badge variant={getRiskColor(result.factors.pH)} className="text-xs">
                      {getRiskText(result.factors.pH)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">
                    {t("risk.recommendationsTitle")}
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