
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const BackupTab = () => {
  const [autoBackup, setAutoBackup] = useState(true);

  return (
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
  );
};
