import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the settings page. More settings will be added soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
