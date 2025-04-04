
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { CompaniesTab } from "./CompaniesTab";
import { NotificationsTab } from "./NotificationsTab";
import { UsersTab } from "./UsersTab";
import { BackupTab } from "./BackupTab";

export const SettingsTabs = () => {
  return (
    <Tabs defaultValue="general" className="w-full mt-6">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Geral</TabsTrigger>
        <TabsTrigger value="companies">Empresas</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="backup">Backup e Restauração</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettingsTab />
      </TabsContent>
      
      <TabsContent value="companies">
        <CompaniesTab />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
      
      <TabsContent value="users">
        <UsersTab />
      </TabsContent>
      
      <TabsContent value="backup">
        <BackupTab />
      </TabsContent>
    </Tabs>
  );
};
