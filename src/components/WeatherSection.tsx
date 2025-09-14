import { Card, CardContent } from "@/components/ui/card";
import { Wind, Droplets, Sun } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";

export function WeatherSection() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const weatherData = {
    location: "Poornima Marg, Sitapura",
    temperature: "31°C",
    condition: language === "en" ? "Partly Cloudy" : "ഭാഗികമായി മേഘാവൃതം",
    rainfall: "0%",
    windSpeed: "2 km/h",
    humidity: "55%",
  };

  const handleWeatherClick = () => {
    navigate("/weather");
  };

  return (
    <div onClick={handleWeatherClick} className="cursor-pointer">
      <Card className="overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sun className="h-12 w-12 text-yellow-500" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{weatherData.temperature}</p>
                <p className="text-sm text-gray-600">{weatherData.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">{weatherData.location}</p>
              <div className="flex items-center justify-end gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Wind className="h-4 w-4" />
                  <span>{weatherData.windSpeed}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Droplets className="h-4 w-4" />
                  <span>{weatherData.humidity}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
