
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const NotificationsTab = () => {
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);

  const handleSaveNotificationSettings = () => {
    toast.success("Preferências de notificação salvas com sucesso!");
  };

  return (
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
  );
};
