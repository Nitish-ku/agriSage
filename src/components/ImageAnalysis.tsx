import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, AlertCircle, Video, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export const ImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isAnalyzing, analysisResult, analysisError, performAnalysis } = useImageAnalysis();

  useEffect(() => {
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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast({
          title: t("imageAnalysis.invalidFileTitle"),
          description: t("imageAnalysis.invalidFileDesc"),
          variant: "destructive"
        });
      }
    }
  }, [t, toast]);

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      performAnalysis(selectedFile);
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
              onClick={handleAnalyzeClick} 
              disabled={!selectedFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ?
                t("imageAnalysis.analyzing") :
                t("imageAnalysis.analyzeButton")}
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
          <CardContent className="prose max-w-full">
            {isAnalyzing && !analysisResult && (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t("imageAnalysis.analyzing")}</p>
              </div>
            )}
            {analysisError && (
              <div className="text-red-500">
                <p>{t("imageAnalysis.errorTitle")} {analysisError}</p>
              </div>
            )}
            {analysisResult && (
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {analysisResult}
              </ReactMarkdown>
            )}
            {!isAnalyzing && !analysisResult && !analysisError && (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {t("imageAnalysis.noResult")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};