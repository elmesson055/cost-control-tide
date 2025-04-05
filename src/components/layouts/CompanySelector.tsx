
import { useState, useEffect } from 'react';
import { useCompany, Company } from '@/hooks/useCompany';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building, ChevronDown } from 'lucide-react';

export const CompanySelector = () => {
  const { companies, currentCompany, switchCompany, isLoadingCompanies } = useCompany();
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('Selecionar empresa');

  useEffect(() => {
    if (currentCompany) {
      setSelectedCompanyName(currentCompany.nome);
    } else if (companies && companies.length > 0) {
      // Fallback to first company if current is not set
      setSelectedCompanyName(companies[0].nome);
    }
  }, [currentCompany, companies]);

  if (isLoadingCompanies) {
    return (
      <Button variant="outline" className="h-9" disabled>
        <Building className="h-4 w-4 mr-2" />
        Carregando...
      </Button>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <Button variant="outline" className="h-9" disabled>
        <Building className="h-4 w-4 mr-2" />
        Sem empresas
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 truncate max-w-[200px]">
          <Building className="h-4 w-4 mr-2" />
          {selectedCompanyName}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {companies.map((company: Company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => switchCompany(company.id)}
            className={
              currentCompany?.id === company.id ? "bg-primary/10 text-primary" : ""
            }
          >
            {company.nome}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
