
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, userService } from "@/services/userService";
import { useCompany } from "@/hooks/useCompany";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
}

export const EditUserDialog = ({ open, onOpenChange, selectedUser }: EditUserDialogProps) => {
  const queryClient = useQueryClient();
  const { currentCompanyId } = useCompany();

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentCompanyId] });
      toast.success("Função de usuário atualizada com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar função: ${errorMessage}`);
    },
  });

  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateRoleMutation.mutate({
        userId: selectedUser.id,
        role: selectedUser.role,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Função</DialogTitle>
          <DialogDescription>
            Altere a função do usuário {selectedUser?.full_name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-role">Função</Label>
            <Select
              value={selectedUser?.role || ""}
              onValueChange={(value) =>
                selectedUser && onOpenChange(prev => {
                  selectedUser.role = value;
                  return prev;
                })
              }
            >
              <SelectTrigger id="edit-role">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="cashier">Caixa</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Salvando..." : "Salvar Mudanças"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
