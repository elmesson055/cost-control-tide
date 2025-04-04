
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Building } from "lucide-react";
import { useCompany, NewCompany } from "@/hooks/useCompany";

export const AddCompanyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { createCompany } = useCompany();
  const [newCompany, setNewCompany] = useState<NewCompany>({
    nome: "",
    cnpj: "",
  });

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany.mutateAsync(newCompany);
      setIsOpen(false);
      resetNewCompany();
    } catch (error) {
      console.error("Error adding company:", error);
      // O toast já é exibido pelo hook useCompany
    }
  };

  const resetNewCompany = () => {
    setNewCompany({
      nome: "",
      cnpj: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
};
