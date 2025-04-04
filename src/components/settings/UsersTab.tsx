
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserManagement } from "@/components/users/UserManagement";

export const UsersTab = () => {
  return (
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
  );
};
