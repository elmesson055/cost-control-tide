
import { useState } from "react";
import { useCompany, Company } from "@/hooks/useCompany";
import { AddCompanyDialog } from "./AddCompanyDialog";
import { EditCompanyDialog } from "./EditCompanyDialog";
import { CompanyTable } from "./CompanyTable";

export const CompanyManagement = () => {
  const {
    companies,
    currentCompanyId,
    isLoadingCompanies,
    switchCompany,
  } = useCompany();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSwitchCompany = (companyId: string) => {
    switchCompany(companyId);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Empresas</h3>
        <AddCompanyDialog />
      </div>

      <CompanyTable
        companies={companies}
        currentCompanyId={currentCompanyId}
        onSelectCompany={handleSwitchCompany}
        onEditCompany={handleEditCompany}
        isLoading={isLoadingCompanies}
      />

      <EditCompanyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    </div>
  );
};
