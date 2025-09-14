import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Eye } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function MarketPriceSection() {
  const { language } = useLanguage();

  const marketPrices = [
    {
      id: 1,
      name: language === "en" ? "Ajwan" : "അജ്വൈൻ",
      category: language === "en" ? "Other" : "മറ്റുള്ളവ",
      price: "₹8700/Q",
      location: "Malpura",
      image: "🌾",
      trend: "up",
      change: "+12%"
    },
    {
      id: 2,
      name: language === "en" ? "Amla (Nelli Kai)" : "നെല്ലിക്ക",
      category: "Amla",
      price: "₹1450/Q",
      location: "Jaipur (F&V)",
      image: "🟢",
      trend: "down",
      change: "-5%"
    },
    {
      id: 3,
      name: language === "en" ? "Apple" : "ആപ്പിൾ",
      category: "Apple",
      price: "₹5600/Q",
      location: "Khurai (F&V)",
      image: "🍎",
      trend: "up",
      change: "+8%"
    },
    {
      id: 4,
      name: language === "en" ? "Coconut" : "തേങ്ങ",
      category: language === "en" ? "Coconut" : "തേങ്ങ",
      price: "₹2800/100",
      location: "Kerala Market",
      image: "🥥",
      trend: "stable",
      change: "0%"
    },
    {
      id: 5,
      name: language === "en" ? "Rice" : "അരി",
      category: language === "en" ? "Grain" : "ധാന്യം",
      price: "₹3200/Q",
      location: "Palakkad",
      image: "🌾",
      trend: "up",
      change: "+3%"
    },
    {
      id: 6,
      name: language === "en" ? "Pepper" : "കുരുമുളക്",
      category: language === "en" ? "Spice" : "മസാല",
      price: "₹45000/Q",
      location: "Idukki",
      image: "⚫",
      trend: "up",
      change: "+15%"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend === "down") return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">
          {language === "en" ? "Market Price" : "വിപണി വില"}
        </CardTitle>
        <Button variant="outline" size="sm" className="text-kerala-primary border-kerala-primary">
          {language === "en" ? "View All" : "എല്லാം കാണുക"}
          <Eye className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketPrices.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{item.image}</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(item.trend)}
                  <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                    {item.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-kerala-primary">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <div className="text-xl font-bold text-kerala-primary">{item.price}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}