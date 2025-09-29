import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import agrisageLogo from "@/assets/kerala-agrisage-logo.jpg";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/language-selector";

const Auth = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [primaryCrop, setPrimaryCrop] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone,
            location: location,
            primary_crop: primaryCrop,
          }
        }
      });

      if (error) {
        toast({
          title: t('auth.signup.error'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.signup.success'),
        });
      }
    } catch (error) {
      toast({
        title: t('auth.error.general'),
        description: t('auth.error.something'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: t('auth.signin.error'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t('auth.signin.success'),
          description: t('auth.signin.welcome'),
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: t('auth.error.general'),
        description: t('auth.error.something'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-kerala-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t('auth.back')}
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={agrisageLogo} alt="Kerala AgriSage" className="w-12 h-12 rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-kerala-primary">{t('header.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <LanguageSelector />
          </div>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">{t('auth.signin.tab')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signup.tab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.signin.title')}</CardTitle>
                <CardDescription>
                  {t('auth.signin.desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.email.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('auth.password.placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-kerala-primary hover:bg-kerala-secondary" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.signin.button')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.signup.title')}</CardTitle>
                <CardDescription>
                  {t('auth.signup.desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('auth.fullname')}</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t('auth.fullname.placeholder')}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">{t('auth.email')}</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder={t('auth.email.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('auth.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('auth.phone.placeholder')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t('auth.location')}</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder={t('auth.location.placeholder')}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryCrop">{t('auth.primarycrop')}</Label>
                    <Input
                      id="primaryCrop"
                      type="text"
                      placeholder={t('auth.primarycrop.placeholder')}
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">{t('auth.password')}</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder={t('auth.password.placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-kerala-primary hover:bg-kerala-secondary" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.signup.button')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;