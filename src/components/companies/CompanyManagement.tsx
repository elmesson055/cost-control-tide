
import { useState } from "react";
import { useCompany, Company, NewCompany } from "@/hooks/useCompany";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building, PencilIcon, Check } from "lucide-react";
import { format } from "date-fns";

export const CompanyManagement = () => {
  const {
    companies,
    currentCompanyId,
    isLoadingCompanies,
    createCompany,
    switchCompany,
    updateCompany,
  } = useCompany();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [newCompany, setNewCompany] = useState<NewCompany>({
    nome: "",
    cnpj: "",
  });

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany.mutate(newCompany, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        resetNewCompany();
      },
    });
  };

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompany) {
      updateCompany.mutate(
        {
          id: selectedCompany.id,
          data: {
            nome: selectedCompany.nome,
            cnpj: selectedCompany.cnpj,
          },
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
          },
        }
      );
    }
  };

  const handleSwitchCompany = (companyId: string) => {
    switchCompany(companyId);
  };

  const resetNewCompany = () => {
    setNewCompany({
      nome: "",
      cnpj: "",
    });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Data inválida";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Empresas</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>Nova Empresa</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova empresa no sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    placeholder="Nome da Empresa"
                    value={newCompany.nome}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, nome: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={newCompany.cnpj || ""}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, cnpj: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createCompany.isPending}>
                  {createCompany.isPending ? "Criando..." : "Criar Empresa"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingCompanies ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Carregando empresas...</div>
        </div>
      ) : (
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
                            onClick={() => handleSwitchCompany(company.id)}
                          >
                            Selecionar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsEditDialogOpen(true);
                          }}
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
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Altere os dados da empresa selecionada
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCompany} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome da Empresa</Label>
                <Input
                  id="edit-nome"
                  value={selectedCompany?.nome || ""}
                  onChange={(e) =>
                    setSelectedCompany(
                      selectedCompany
                        ? { ...selectedCompany, nome: e.target.value }
                        : null
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cnpj">CNPJ</Label>
                <Input
                  id="edit-cnpj"
                  value={selectedCompany?.cnpj || ""}
                  onChange={(e) =>
                    setSelectedCompany(
                      selectedCompany
                        ? { ...selectedCompany, cnpj: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateCompany.isPending}>
                {updateCompany.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
