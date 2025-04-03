
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, userService } from "@/services/userService";
import { useCompany } from "@/hooks/useCompany";
import { format } from "date-fns";
import { UserPlus } from "lucide-react";
import { UserTable } from "./UserTable";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";

export const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { currentCompanyId } = useCompany();

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users", currentCompanyId],
    queryFn: userService.getUsers,
    retry: 1, // Limit retries
    meta: {
      errorMessage: "Falha ao carregar usuários"
    },
    enabled: !!currentCompanyId // Só buscar quando tivermos uma empresa selecionada
  });

  // Log errors for debugging purposes
  if (isError) {
    console.error("Error fetching users:", error);
  }

  if (!currentCompanyId) {
    return (
      <div className="p-4 border border-amber-300 bg-amber-50 rounded-md text-amber-800">
        <h3 className="text-lg font-medium">Selecione uma empresa</h3>
        <p className="mt-1">Você precisa selecionar uma empresa para gerenciar usuários.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        <h3 className="text-lg font-medium">Erro ao carregar usuários</h3>
        <p className="mt-1">Verifique se suas credenciais do Supabase estão configuradas corretamente.</p>
        <p className="text-sm mt-2">Detalhes técnicos: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        <Button className="flex items-center gap-1" onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Adicionar Usuário</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Carregando usuários...</div>
        </div>
      ) : (
        <UserTable 
          users={users} 
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditDialogOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
          }}
        />
      )}

      <AddUserDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        currentCompanyId={currentCompanyId}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedUser={selectedUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
};
