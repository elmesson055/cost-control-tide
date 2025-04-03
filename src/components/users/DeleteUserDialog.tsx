
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
import { User, userService } from "@/services/userService";
import { useCompany } from "@/hooks/useCompany";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
}

export const DeleteUserDialog = ({ open, onOpenChange, selectedUser }: DeleteUserDialogProps) => {
  const queryClient = useQueryClient();
  const { currentCompanyId } = useCompany();

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", currentCompanyId] });
      toast.success("Usuário removido com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao remover usuário: ${errorMessage}`);
    },
  });

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o usuário {selectedUser?.full_name}? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? "Removendo..." : "Remover Usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
