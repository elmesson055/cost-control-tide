
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCompany, Company } from "@/hooks/useCompany";

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
}

export const EditCompanyDialog = ({
  open,
  onOpenChange,
  selectedCompany,
  setSelectedCompany,
}: EditCompanyDialogProps) => {
  const { updateCompany } = useCompany();

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompany) {
      try {
        await updateCompany.mutateAsync({
          id: selectedCompany.id,
          data: {
            nome: selectedCompany.nome,
            cnpj: selectedCompany.cnpj,
          },
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Error updating company:", error);
        // O toast já é exibido pelo hook useCompany
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};
