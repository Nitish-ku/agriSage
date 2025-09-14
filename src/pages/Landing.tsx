import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle, Camera, BarChart3, Shield, Users, Zap, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import keralaFarmerImage from "@/assets/kerala-farmer.jpg";
import agrisageLogo from "@/assets/kerala-agrisage-logo.jpg";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/ui/language-selector";

const Landing = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-kerala-light/20">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={agrisageLogo} alt="Kerala AgriSage" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-kerala-primary">{t('header.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <Link to="/auth">
              <Button variant="outline" size="sm">{t('header.signin')}</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-kerala-primary hover:bg-kerala-secondary">
                {t('header.getstarted')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-background rounded-lg shadow-lg">
            <div className="flex flex-col gap-4">
              <LanguageSelector />
              <Link to="/auth">
                <Button variant="outline" className="w-full">{t('header.signin')}</Button>
              </Link>
              <Link to="/auth">
                <Button className="w-full bg-kerala-primary hover:bg-kerala-secondary">
                  {t('header.getstarted')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-kerala-primary/10 text-kerala-primary border-kerala-primary/20">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {t('hero.title1')}{" "}
                <span className="text-kerala-primary">{t('hero.title2')}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('hero.description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-kerala-primary hover:bg-kerala-secondary">
                  {t('hero.startfree')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                {t('hero.watchdemo')}
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-kerala-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">{t('hero.farmers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kerala-primary">50,000+</div>
                <div className="text-sm text-muted-foreground">{t('hero.queries')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kerala-primary">95%</div>
                <div className="text-sm text-muted-foreground">{t('hero.accuracy')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={keralaFarmerImage} 
                alt={t('hero.imagealt')} 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{t('hero.imagetitle')}</h3>
                <p className="text-white/90">{t('hero.imagedesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('features.title1')} <span className="text-kerala-primary">{t('features.title2')}</span> {t('features.title3')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-kerala-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-kerala-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.chat.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.chat.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-kerala-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-kerala-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.image.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.image.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-kerala-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-kerala-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.risk.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.risk.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-kerala-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-kerala-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.expert.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.expert.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-kerala-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-kerala-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.connect.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.connect.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-kerala-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-kerala-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('features.instant.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.instant.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-kerala-primary hover:bg-kerala-secondary">
              {t('cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border/50 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={agrisageLogo} alt="Kerala AgriSage" className="w-8 h-8 rounded" />
              <div>
                <div className="font-semibold text-kerala-primary">{t('header.title')}</div>
                <div className="text-sm text-muted-foreground">{t('header.subtitle')}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;