
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const Settings = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <p className="text-muted-foreground mt-1">Gerencie as configurações do sistema</p>
      
      <SettingsTabs />
    </div>
  );
};

export default Settings;
