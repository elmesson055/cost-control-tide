
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/hooks/useCompany";

export const GeneralSettingsTab = () => {
  const [companyName, setCompanyName] = useState('Tide Control Café');
  const [businessType, setBusinessType] = useState('Cafeteria');
  const [email, setEmail] = useState('contato@tidecontrol.com.br');
  const [phone, setPhone] = useState('(11) 98765-4321');
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

  return (
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
  );
};
