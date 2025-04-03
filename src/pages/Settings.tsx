import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UserManagement } from "@/components/users/UserManagement";
import { CompanyManagement } from "@/components/companies/CompanyManagement";
import { toast } from "sonner";
import { useCompany } from "@/hooks/useCompany";

const Settings = () => {
  const [companyName, setCompanyName] = useState('Tide Control Café');
  const [businessType, setBusinessType] = useState('Cafeteria');
  const [email, setEmail] = useState('contato@tidecontrol.com.br');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [autoBackup, setAutoBackup] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { currentCompany } = useCompany();

  useEffect(() => {
    if (currentCompany) {
      setCompanyName(currentCompany.nome || '');
      setBusinessType(''); // Adicionar este campo na tabela empresa no futuro
    }
  }, [currentCompany]);

  const handleSaveGeneralSettings = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleSaveNotificationSettings = () => {
    toast.success("Preferências de notificação salvas com sucesso!");
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <p className="text-muted-foreground mt-1">Gerencie as configurações do sistema</p>

      <Tabs defaultValue="general" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="companies">Empresas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup e Restauração</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Negócio</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input 
                  id="company-name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-type">Tipo de Negócio</Label>
                <Input 
                  id="business-type" 
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">Tema da Interface</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="theme" 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="theme" className="cursor-pointer">Modo Escuro</Label>
                </div>
              </div>

              <Button onClick={handleSaveGeneralSettings} className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Empresas</CardTitle>
              <CardDescription>
                Gerencie as empresas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="low-stock" 
                  checked={notifyLowStock}
                  onCheckedChange={(checked) => setNotifyLowStock(checked === true)}
                />
                <label
                  htmlFor="low-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Notificar quando estoque estiver baixo
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="daily-report" 
                  checked={dailyReports}
                  onCheckedChange={(checked) => setDailyReports(checked === true)}
                />
                <label
                  htmlFor="daily-report"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enviar relatórios diários por email
                </label>
              </div>

              <Button onClick={handleSaveNotificationSettings} className="mt-4">Salvar Preferências</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Adicione ou remova usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
              <CardDescription>
                Configure backups automáticos ou faça backups manuais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-backup" 
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
                <Label htmlFor="auto-backup" className="cursor-pointer">Backups automáticos diários</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button variant="outline">
                  Fazer Backup Manual
                </Button>
                <Button variant="outline">
                  Restaurar Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
