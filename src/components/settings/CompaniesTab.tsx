
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyManagement } from "@/components/companies/CompanyManagement";

export const CompaniesTab = () => {
  return (
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
  );
};
