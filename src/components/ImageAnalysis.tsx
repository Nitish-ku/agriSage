import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, AlertCircle, CheckCircle, Video, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface ImageAnalysisProps {
}

interface AnalysisResult {
  disease: string;
  confidence: number;
  treatment: string;
  severity: "low" | "medium" | "high";
}

export const ImageAnalysis = ({ }: ImageAnalysisProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getCurrentUser();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: t("imageAnalysis.cameraErrorTitle"),
        description: t("imageAnalysis.cameraErrorDesc"),
        variant: "destructive",
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.png", { type: "image/png" });
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            stream?.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        });
      }
    }
  };

  // Mock disease database based on filename
  const diseaseDatabase: { [key: string]: any } = {
    en: {
      banana: {
        disease: "Banana Leaf Spot (Sigatoka)",
        confidence: 92,
        treatment: "Apply Mancozeb 75% WP @ 2g/L water every 15 days. Remove affected leaves.",
        severity: "medium" as const
      },
      rice: {
        disease: "Rice Blast Disease",
        confidence: 88,
        treatment: "Apply Tricyclazole 75% WP @ 0.6g/L. Ensure proper field drainage.",
        severity: "high" as const
      },
      coconut: {
        disease: "Coconut Root Wilt",
        confidence: 90,
        treatment: "Apply Trichoderma viride @ 50g per palm around root zone.",
        severity: "high" as const
      },
      pepper: {
        disease: "Black Pepper Quick Wilt",
        confidence: 85,
        treatment: "Use Bordeaux mixture 1% spray and improve drainage.",
        severity: "medium" as const
      },
      default: {
        disease: "General Crop Condition",
        confidence: 75,
        treatment: "Continue regular monitoring. No immediate treatment required.",
        severity: "low" as const
      }
    },
    ml: {
      banana: {
        disease: "വാഴയുടെ ഇലപ്പുള്ളി രോഗം (സിഗാറ്റോക)",
        confidence: 92,
        treatment: "മാൻകോസെബ് 75% WP @ 2g/L വെള്ളത്തിൽ 15 ദിവസം കൂടുമ്പോൾ സ്പ്രേ ചെയ്യുക.",
        severity: "medium" as const
      },
      rice: {
        disease: "നെല്ലിന്റെ ബ്ലാസ്റ്റ് രോഗം",
        confidence: 88,
        treatment: "ട്രൈസൈക്ലാസോൾ 75% WP @ 0.6g/L പ്രയോഗിക്കുക. നല്ല വളം സൗകര്യം ഉറപ്പാക്കുക.",
        severity: "high" as const
      },
      coconut: {
        disease: "തെങ്ങിന്റെ വേര് വാട്ട രോഗം",
        confidence: 90,
        treatment: "ട്രൈക്കോഡെർമ വിരിഡെ @ 50g വേരിന് ചുറ്റും പ്രയോഗിക്കുക.",
        severity: "high" as const
      },
      pepper: {
        disease: "കുരുമുളകിന്റെ പെട്ടെന്നുള്ള വാട്ടം",
        confidence: 85,
        treatment: "ബോർഡോ മിശ്രിതം 1% സ്പ്രേ ചെയ്യുക, വളം സൗകര്യം മെച്ചപ്പെടുത്തുക.",
        severity: "medium" as const
      },
      default: {
        disease: "ഇലപ്പുള്ളി രോഗം",
        confidence: 75,
        treatment: "സാധാരണ കുമിൾനാശിനി പ്രയോഗിക്കുക, വായു സഞ്ചാരം മെച്ചപ്പെടുത്തുക.",
        severity: "low" as const
      }
    },
    hi: {
      banana: {
        disease: "बनाना लीफ स्पॉट (सिगाटोका)",
        confidence: 92,
        treatment: "मैंकोजेब 75% WP @ 2g/L पानी में हर 15 दिन में लगाएं। प्रभावित पत्तियों को हटाएं।",
        severity: "medium" as const
      },
      rice: {
        disease: "चावल ब्लास्ट रोग",
        confidence: 88,
        treatment: "ट्राईसाइक्लाजोल 75% WP @ 0.6g/L का छिड़काव करें। खेतों में उचित जल निकासी सुनिश्चित करें।",
        severity: "high" as const
      },
      coconut: {
        disease: "नारियल रूट विल्ट",
        confidence: 90,
        treatment: "ट्राइकोडर्मा विराइड @ 50g प्रति पेड़ जड़ के क्षेत्र के चारों ओर लगाएं।",
        severity: "high" as const
      },
      pepper: {
        disease: "काली मिर्च क्विक विल्ट",
        confidence: 85,
        treatment: "बोर्डो मिश्रण 1% का छिड़काव करें और जल निकासी में सुधार करें।",
        severity: "medium" as const
      },
      default: {
        disease: "सामान्य फसल स्थिति",
        confidence: 75,
        treatment: "नियमित निगरानी जारी रखें। कोई तत्काल उपचार की आवश्यकता नहीं।",
        severity: "low" as const
      }
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setResult(null);
      } else {
        toast({
          title: t("imageAnalysis.invalidFileTitle"),
          description: t("imageAnalysis.invalidFileDesc"),
          variant: "destructive"
        });
      }
    }
  }, [t, toast]);

  const analyzeImage = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    
    try {
      // Call AI image analysis function
      const { data, error } = await supabase.functions.invoke('analyze-plant-disease', {
        body: { 
          imageUrl: previewUrl,
          language: i18n.language 
        }
      });

      if (error) throw error;

      const analysis = {
        disease: data.disease,
        confidence: data.confidence,
        treatment: data.treatment,
        severity: data.severity
      };
      
      // Save to database
      const { error: dbError } = await supabase
        .from('disease_analysis')
        .insert({
          user_id: user.id,
          image_url: previewUrl,
          detected_disease: analysis.disease,
          confidence: analysis.confidence / 100,
          severity: analysis.severity,
          treatment_recommendations: analysis.treatment,
        });

      if (dbError) throw dbError;

      setResult(analysis);
      
      toast({
        title: t("imageAnalysis.analysisCompleteTitle"),
        description: t("imageAnalysis.analysisCompleteDesc"),
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: t("imageAnalysis.errorTitle"),
        description: t("imageAnalysis.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high": return t("risk.highRisk");
      case "medium": return t("risk.mediumRisk");
      case "low": return t("risk.lowRisk");
      default: return t("risk.unknown");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-kerala-primary" />
              <span>
                {t("imageAnalysis.uploadTitle")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {!previewUrl && !stream ? (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      {t("imageAnalysis.uploadPrompt")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("imageAnalysis.uploadFormats")}
                    </p>
                  </>
                ) : stream ? (
                  <video ref={videoRef} autoPlay className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                )}
              </label>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <div className="flex gap-2">
              <Button onClick={openCamera} variant="outline" className="w-full">
                <Video className="h-5 w-5 mr-2" />
                {t("imageAnalysis.openCamera")}
              </Button>
              {stream && (
                <Button onClick={captureImage} className="w-full">
                  <Zap className="h-5 w-5 mr-2" />
                  {t("imageAnalysis.capture")}
                </Button>
              )}
            </div>

            <Button 
              onClick={analyzeImage} 
              disabled={!selectedFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                t("imageAnalysis.analyzing")
              ) : (
                t("imageAnalysis.analyzeButton")
              )}
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>
                {t("imageAnalysis.disclaimer")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-kerala-secondary" />
              <span>
                {t("imageAnalysis.resultsTitle")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {t("imageAnalysis.noResult")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant={getSeverityColor(result.severity)} className="text-sm">
                    {getSeverityText(result.severity)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {result.confidence}% {t("imageAnalysis.confidence")}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg">
                    {t("imageAnalysis.detectedDisease")}
                  </h3>
                  <p className="text-muted-foreground">{result.disease}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">
                    {t("imageAnalysis.treatmentRecommendations")}
                  </h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">{result.treatment}</p>
                  </div>
                </div>

                <div className="bg-kerala-primary/10 p-4 rounded-lg border-l-4 border-kerala-primary">
                  <p className="text-sm text-muted-foreground">
                    {t("imageAnalysis.severeCases")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};