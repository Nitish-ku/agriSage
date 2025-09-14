import { Card, CardContent } from "@/components/ui/card";
import { Wind, Droplets, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function WeatherSection() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const weatherData = {
    location: i18n.t("weather.location"),
    temperature: "31°C",
    condition: i18n.t("weather.condition"),
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Sun className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{weatherData.temperature}</p>
                <p className="text-xs sm:text-sm text-gray-600">{weatherData.condition}</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-md sm:text-lg font-semibold text-gray-800">{weatherData.location}</p>
              <div className="flex items-center justify-center sm:justify-end gap-4 mt-2">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Wind className="h-4 w-4" />
                  <span>{weatherData.windSpeed}</span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
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
