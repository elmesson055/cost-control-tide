import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCompany } from "@/hooks/useCompany";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, userService } from "@/services/userService";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
}

const CustomDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "hidden"}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end">{footer}</div>}
      </div>
    </div>
  );
};

export const EditUserDialog = ({ open, onOpenChange, selectedUser }: EditUserDialogProps) => {
  const queryClient = useQueryClient();
  const { companies } = useCompany();
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setEditingUser({
        full_name: selectedUser.full_name,
        email: selectedUser.email,
        role: selectedUser.role,
        empresa_id: selectedUser.empresa_id,
      });
    } else {
      setEditingUser(null);
    }
  }, [selectedUser]);

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: User) => userService.updateUser(updatedUser),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário atualizado com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao atualizar usuário: ${errorMessage}`);
    },
  });

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser && selectedUser) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmUpdate = () => {
    if (editingUser && selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, ...editingUser } as User);
      setShowConfirmation(false);
      onOpenChange(false); // Close the dialog after confirmation
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={showConfirmation ? "Confirmar Alterações" : "Editar Usuário"}
      description={
        showConfirmation
          ? "Tem certeza que deseja salvar as alterações?"
          : `Altere os dados do usuário ${editingUser?.full_name}`
      }
      footer={
        showConfirmation ? (
          <>
            <Button variant="outline" onClick={handleCancelUpdate}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmUpdate}>Confirmar</Button>
          </>
        ) : undefined
      }
    >
      {!showConfirmation && (
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              name="full_name"
              value={editingUser?.full_name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editingUser?.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            {/* Assuming you want to keep password change separate */}
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select
              onValueChange={(value) => {
                handleInputChange({ target: { name: "role", value } } as any);
              }
              }
            >
              <SelectTrigger id="role">
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
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa</Label>
            <Select
              onValueChange={(value) => {
                handleInputChange({ target: { name: "empresa_id", value } } as any);
              }
              }
            >
              <SelectTrigger id="empresa">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies &&
                  companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending ? "Salvando..." : "Salvar Mudanças"}
          </Button>
        </form>
      )}
    </CustomDialog>
  );
};
