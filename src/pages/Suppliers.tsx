
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";
import { SupplierForm } from "@/components/forms/SupplierForm";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Supplier {
  id: string;
  nome: string;
  tipo_documento: string;
  numero_documento: string;
  contato: {
    email?: string;
    telefone?: string;
    nome?: string;
  };
  organizacao_id: string;
  empresa_id: string;
}

const Suppliers = () => {
  const { currentCompanyId } = useCompany();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Fetch suppliers
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["fornecedores", currentCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("empresa_id", currentCompanyId || "")
        .order("nome");
        
      if (error) {
        toast.error(`Erro ao carregar fornecedores: ${error.message}`);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!currentCompanyId
  });
  
  // Delete mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores", currentCompanyId] });
      toast.success("Fornecedor removido com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao remover fornecedor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Handle delete
  const handleDelete = (supplier: Supplier) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor "${supplier.nome}"?`)) {
      deleteSupplierMutation.mutate(supplier.id);
    }
  };
  
  // Handle edit
  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };
  
  // Close dialog and reset form after add/edit
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedSupplier(null);
  };

  if (!currentCompanyId) {
    return (
      <div className="p-4 border border-amber-300 bg-amber-50 rounded-md text-amber-800">
        <h3 className="text-lg font-medium">Selecione uma empresa</h3>
        <p className="mt-1">Você precisa selecionar uma empresa para gerenciar fornecedores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Adicionar Fornecedor</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo fornecedor
              </DialogDescription>
            </DialogHeader>
            <SupplierForm
              onSuccess={handleCloseDialog}
              currentCompanyId={currentCompanyId}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Nenhum fornecedor cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.nome}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {supplier.contato && supplier.contato.nome && <div>{supplier.contato.nome}</div>}
                        {supplier.contato && supplier.contato.telefone && <div className="text-sm text-muted-foreground">{supplier.contato.telefone}</div>}
                        {supplier.contato && supplier.contato.email && <div className="text-sm text-muted-foreground">{supplier.contato.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.tipo_documento && supplier.numero_documento ? (
                        <span>{supplier.tipo_documento}: {supplier.numero_documento}</span>
                      ) : (
                        <span className="text-muted-foreground">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(supplier)}
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(supplier)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
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
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
            <DialogDescription>
              Altere os dados do fornecedor
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierForm
              supplier={selectedSupplier}
              onSuccess={handleCloseDialog}
              currentCompanyId={currentCompanyId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
