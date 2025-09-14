-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  primary_crop TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farmer queries table
CREATE TABLE public.farmer_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  query_language TEXT NOT NULL DEFAULT 'ml',
  query_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice', 'image'
  image_url TEXT,
  ai_response TEXT,
  response_language TEXT DEFAULT 'ml',
  confidence_score DECIMAL(3,2),
  feedback TEXT, -- 'good', 'not_helpful', 'escalated'
  escalated_to_officer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disease analysis table
CREATE TABLE public.disease_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  detected_disease TEXT,
  confidence DECIMAL(5,2),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  treatment_recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk predictions table
CREATE TABLE public.risk_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  location TEXT NOT NULL,
  season TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  ph_level DECIMAL(3,1),
  overall_risk TEXT CHECK (overall_risk IN ('low', 'medium', 'high')),
  weather_risk TEXT CHECK (weather_risk IN ('low', 'medium', 'high')),
  disease_risk TEXT CHECK (disease_risk IN ('low', 'medium', 'high')),
  soil_risk TEXT CHECK (soil_risk IN ('low', 'medium', 'high')),
  recommendations TEXT,
  confidence DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges/achievements table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for farmer_queries
CREATE POLICY "Users can view their own queries" ON public.farmer_queries
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own queries" ON public.farmer_queries
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queries" ON public.farmer_queries
FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for disease_analysis
CREATE POLICY "Users can view their own disease analysis" ON public.disease_analysis
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disease analysis" ON public.disease_analysis
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for risk_predictions
CREATE POLICY "Users can view their own risk predictions" ON public.risk_predictions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own risk predictions" ON public.risk_predictions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own badges" ON public.user_badges
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_queries_updated_at
  BEFORE UPDATE ON public.farmer_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();