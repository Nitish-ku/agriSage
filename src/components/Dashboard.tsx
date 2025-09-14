import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  MessageSquare, 
  Camera, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Trophy,
  Target,
  BookOpen
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface DashboardProps {
}

export const Dashboard = ({ }: DashboardProps) => {
  const { t } = useTranslation();
  const [stats] = useState({
    queriesUsed: 7,
    queriesLimit: 10,
    imagesAnalyzed: 3,
    riskAssessments: 2,
    badgesEarned: 2,
    totalBadges: 6
  });

  const badges = [
    {
      id: 1,
      name: t("dashboard.badges.firstQuery.name"),
      description: t("dashboard.badges.firstQuery.description"),
      icon: "🌱",
      earned: true,
      date: "2025-01-15"
    },
    {
      id: 2,
      name: t("dashboard.badges.farmExpert.name"),
      description: t("dashboard.badges.farmExpert.description"),
      icon: "🏆",
      earned: true,
      date: "2025-01-16"
    },
    {
      id: 3,
      name: t("dashboard.badges.diseaseDetective.name"),
      description: t("dashboard.badges.diseaseDetective.description"),
      icon: "🔍",
      earned: false,
      condition: 3
    },
    {
      id: 4,
      name: t("dashboard.badges.riskMaster.name"),
      description: t("dashboard.badges.riskMaster.description"),
      icon: "📊",
      earned: false,
      condition: 5
    },
    {
      id: 5,
      name: t("dashboard.badges.keralaFarmer.name"),
      description: t("dashboard.badges.keralaFarmer.description"),
      icon: "🥥",
      earned: false,
      condition: 7
    },
    {
      id: 6,
      name: t("dashboard.badges.cropMaster.name"),
      description: t("dashboard.badges.cropMaster.description"),
      icon: "👑",
      earned: false,
      condition: 50
    }
  ];

  const recentActivities = [
    {
      type: "query",
      content: t("dashboard.activity.query"),
      time: "2 hours ago",
      icon: MessageSquare
    },
    {
      type: "image",
      content: t("dashboard.activity.image"),
      time: "4 hours ago",
      icon: Camera
    },
    {
      type: "risk",
      content: t("dashboard.activity.risk"),
      time: "1 day ago",
      icon: TrendingUp
    },
    {
      type: "badge",
      content: t("dashboard.activity.badge"),
      time: "2 days ago",
      icon: Award
    }
  ];

  const weeklyProgress = [
    { day: "Mon", queries: 8 },
    { day: "Tue", queries: 6 },
    { day: "Wed", queries: 10 },
    { day: "Thu", queries: 7 },
    { day: "Fri", queries: 9 },
    { day: "Sat", queries: 5 },
    { day: "Sun", queries: 7 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-kerala-primary" />
            <div className="text-2xl font-bold text-kerala-primary">{stats.queriesUsed}</div>
            <div className="text-xs text-muted-foreground">
              {language === "en" ? "Queries Today" : "ഇന്നത്തെ ചോദ്യങ്ങൾ"}
            </div>
            <Progress value={(stats.queriesUsed / stats.queriesLimit) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="h-8 w-8 mx-auto mb-2 text-kerala-secondary" />
            <div className="text-2xl font-bold text-kerala-primary">{stats.imagesAnalyzed}</div>
            <div className="text-xs text-muted-foreground">
              {language === "en" ? "Images Analyzed" : "വിശകലനം ചെയ്ത ചിത്രങ്ങൾ"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-kerala-accent" />
            <div className="text-2xl font-bold text-kerala-primary">{stats.riskAssessments}</div>
            <div className="text-xs text-muted-foreground">
              {language === "en" ? "Risk Assessments" : "അപകടസാധ്യത വിലയിരുത്തലുകൾ"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-kerala-primary">{stats.badgesEarned}</div>
            <div className="text-xs text-muted-foreground">
              {language === "en" ? "Badges Earned" : "നേടിയ ബാഡ്ജുകൾ"}
            </div>
            <Progress value={(stats.badgesEarned / stats.totalBadges) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>{language === "en" ? "Achievement Badges" : "നേട്ട ബാഡ്ജുകൾ"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {badges.map((badge) => (
              <div key={badge.id} className={`flex items-center space-x-4 p-3 rounded-lg border ${
                badge.earned ? "bg-green-50 border-green-200" : "bg-muted border-border"
              }`}>
                <div className="text-2xl">{badge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${badge.earned ? "text-green-800" : "text-muted-foreground"}`}>
                      {badge.name}
                    </h4>
                    {badge.earned ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className={`text-sm ${badge.earned ? "text-green-600" : "text-muted-foreground"}`}>
                    {badge.description}
                  </p>
                  {badge.earned && badge.date && (
                    <p className="text-xs text-green-500">
                      {language === "en" ? "Earned on" : "നേടിയ തീയതി"} {badge.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-kerala-primary" />
              <span>{language === "en" ? "Recent Activity" : "സമീപകാല പ്രവർത്തനങ്ങൾ"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-muted">
                <activity.icon className="h-5 w-5 mt-1 text-kerala-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-kerala-secondary" />
            <span>{language === "en" ? "Weekly Usage" : "പ്രതിവാര ഉപയോഗം"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 space-x-2">
            {weeklyProgress.map((day) => (
              <div key={day.day} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-kerala-primary rounded-t w-8"
                  style={{ height: `${(day.queries / 10) * 100}%` }}
                />
                <div className="text-xs text-muted-foreground">{day.day}</div>
                <div className="text-xs font-medium">{day.queries}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "Daily query usage over the past week"
                : "കഴിഞ്ഞ ആഴ്‌ചയിലെ ദൈനംദിന ചോദ്യ ഉപയോഗം"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-kerala-accent" />
            <span>{language === "en" ? "Learning Resources" : "പഠന സാധനങ്ങൾ"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium text-kerala-primary mb-2">
                {language === "en" ? "Crop Disease Guide" : "വിള രോഗ വഴികാട്ടി"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "Learn to identify common crop diseases in Kerala"
                  : "കേരളത്തിലെ സാധാരണ വിള രോഗങ്ങൾ തിരിച്ചറിയാൻ പഠിക്കുക"
                }
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium text-kerala-primary mb-2">
                {language === "en" ? "Seasonal Farming Tips" : "സീസണൽ കൃഷി നുറുങ്ങുകൾ"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "Best practices for each season in Kerala"
                  : "കേരളത്തിലെ ഓരോ സീസണിലേയും മികച്ച രീതികൾ"
                }
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-medium text-kerala-primary mb-2">
                {language === "en" ? "Government Schemes" : "സർക്കാർ പദ്ധതികൾ"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "Available subsidies and support programs"
                  : "ലഭ്യമായ സബ്‌സിഡികളും സഹായ പരിപാടികളും"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};