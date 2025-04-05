import { format } from "date-fns";
import { Check, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Company } from "@/types/company.types";

interface CompanyTableProps {
  companies: Company[];
  currentCompanyId: string | null;
  onSelectCompany: (companyId: string) => void;
  onEditCompany: (company: Company) => void;
  isLoading: boolean;
}

export const CompanyTable = ({
  companies,
  currentCompanyId,
  onSelectCompany,
  onEditCompany,
  isLoading,
}: CompanyTableProps) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Carregando empresas...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Nenhuma empresa encontrada
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.nome}</TableCell>
                <TableCell>{company.cnpj || "N/A"}</TableCell>
                <TableCell>{formatDate(company.criado_em)}</TableCell>
                <TableCell>
                  {company.ativo ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Ativa
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Inativa
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {company.id === currentCompanyId ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Check className="h-3 w-3 mr-1" /> Selecionada
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectCompany(company.id)}
                      >
                        Selecionar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditCompany(company)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
