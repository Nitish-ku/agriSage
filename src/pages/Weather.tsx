import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WeatherDetails } from "@/components/WeatherDetails";

const WeatherPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 w-full overflow-y-auto p-4">
      <Button onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <WeatherDetails />
    </main>
  );
};

export default WeatherPage;