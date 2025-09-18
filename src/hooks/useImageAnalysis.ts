import { useState } from 'react';
import { supabase, SUPABASE_URL } from '@/integrations/supabase/client';

export const useImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const performAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult('');
    setAnalysisError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      if (!imageDataUrl) {
        setAnalysisError('Could not read the image file.');
        setIsAnalyzing(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('User not authenticated.');

        const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-plant-disease`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ imageDataUrl }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (!response.body) throw new Error('No response body.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });
          setAnalysisResult((prev) => prev + chunk);
        }
      } catch (error: any) {
        setAnalysisError(error.message || 'An unknown error occurred.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setAnalysisError('Error reading file.');
      setIsAnalyzing(false);
    };
  };

  return { isAnalyzing, analysisResult, analysisError, performAnalysis };
};
