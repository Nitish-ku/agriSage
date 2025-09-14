import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Navigation,
  MapPin,
  Sun
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function WeatherDetails() {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(12);

  useEffect(() => {
    console.log("WeatherDetails component mounted");
  }, []);

  const weekDates = [
    { day: language === "en" ? "Fri" : "വെള്ളി", date: 12, isToday: true },
    { day: language === "en" ? "Sat" : "ശനി", date: 13, isToday: false },
    { day: language === "en" ? "Sun" : "ഞായർ", date: 14, isToday: false },
    { day: language === "en" ? "Mon" : "തിങ്കൾ", date: 15, isToday: false },
    { day: language === "en" ? "Tue" : "ചൊവ്വ", date: 16, isToday: false },
    { day: language === "en" ? "Wed" : "ബുധൻ", date: 17, isToday: false },
  ];

  const weatherData = {
    location: "Poornima Marg, Sitapura",
    temperature: "31°C",
    condition: language === "en" ? "Partly Cloudy" : "ഭാഗികമായി മേഘാവൃതം",
    rainfall: "0%",
    windSpeed: "2 km/h",
    humidity: "55%",
    windDirection: language === "en" ? "Northwest" : "വടക്കുപടിഞ്ഞാറ്"
  };

  return (
    <Card className="w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 border-0">
      <CardContent className="p-0">
        {/* Date Selection */}
        <div className="p-4 bg-white/80">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {weekDates.map((dateItem) => (
              <button
                key={dateItem.date}
                onClick={() => setSelectedDate(dateItem.date)}
                className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] transition-colors ${
                  dateItem.isToday || selectedDate === dateItem.date
                    ? "bg-kerala-primary text-white shadow-lg" 
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="text-sm font-medium">{dateItem.day}</span>
                <span className="text-xl font-bold">{dateItem.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weather Info */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-kerala-primary" />
              <span className="font-semibold">{weatherData.location}</span>
            </div>
            <Button size="sm" className="bg-kerala-primary hover:bg-kerala-primary/90 w-full sm:w-auto">
              {language === "en" ? "Get Weather Advice" : "കാലാവസ്ഥാ ഉപദേശം"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="text-5xl font-bold text-kerala-primary">
              {weatherData.temperature}
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-medium">{weatherData.condition}</span>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm">
              <CloudRain className="h-7 w-7 mx-auto mb-2 text-blue-500" />
              <div className="text-sm text-muted-foreground mb-1">
                {language === "en" ? "Rainfall" : "മഴ"}
              </div>
              <div className="text-xl font-bold">{weatherData.rainfall}</div>
            </div>

            <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm">
              <Wind className="h-7 w-7 mx-auto mb-2 text-gray-500" />
              <div className="text-sm text-muted-foreground mb-1">
                {language === "en" ? "Wind Speed" : "കാറ്റിന്റെ വേഗത"}
              </div>
              <div className="text-xl font-bold">{weatherData.windSpeed}</div>
            </div>

            <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm">
              <Droplets className="h-7 w-7 mx-auto mb-2 text-blue-400" />
              <div className="text-sm text-muted-foreground mb-1">
                {language === "en" ? "Humidity" : "ആർദ്രത"}
              </div>
              <div className="text-xl font-bold">{weatherData.humidity}</div>
            </div>

            <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm">
              <Navigation className="h-7 w-7 mx-auto mb-2 text-gray-600" />
              <div className="text-sm text-muted-foreground mb-1">
                {language === "en" ? "Wind Direction" : "കാറ്റിന്റെ ദിശ"}
              </div>
              <div className="text-lg font-bold">{weatherData.windDirection}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
