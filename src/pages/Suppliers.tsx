
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import SupplierForm from "@/components/forms/SupplierForm";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Supplier {
  id: string;
  nome: string;
  tipo_documento: string;
  numero_documento: string;
  empresa_id: string;
  organizacao_id: string;
  contato: {
    nome?: string;
    telefone?: string;
    email?: string;
  };
}

const Suppliers = () => {
  const queryClient = useQueryClient();
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome");
      
      if (error) {
        toast.error(`Erro ao carregar fornecedores: ${error.message}`);
        throw error;
      }
      
      // Transform the data to ensure contato is properly typed
      return data.map(supplier => ({
        ...supplier,
        contato: supplier.contato ? supplier.contato : {}
      })) as Supplier[];
    }
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
      toast.success("Fornecedor excluído com sucesso");
      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir fornecedor: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  });

  const handleAddSupplierSuccess = () => {
    setIsAddingSupplier(false);
    queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
  };

  const handleDeleteSupplier = () => {
    if (selectedSupplier) {
      deleteSupplier.mutate(selectedSupplier.id);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.numero_documento && supplier.numero_documento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-1">Fornecedores</h1>
      <p className="text-muted-foreground mb-6">Gerencie seus fornecedores</p>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Buscar fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddingSupplier(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      {isAddingSupplier ? (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Fornecedor</CardTitle>
            <CardDescription>Preencha os dados do novo fornecedor</CardDescription>
          </CardHeader>
          <CardContent>
            <SupplierForm 
              onSuccess={handleAddSupplierSuccess} 
              onCancel={() => setIsAddingSupplier(false)} 
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Carregando fornecedores...</p>
          ) : filteredSuppliers.length === 0 ? (
            <p>Nenhum fornecedor encontrado.</p>
          ) : (
            filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{supplier.nome}</CardTitle>
                    <Badge variant="outline">{supplier.tipo_documento}</Badge>
                  </div>
                  {supplier.numero_documento && (
                    <CardDescription>{supplier.numero_documento}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-4">
                  {supplier.contato && (
                    <div className="space-y-1 text-sm">
                      {supplier.contato.nome && (
                        <div>
                          <Label className="inline">Contato:</Label> {supplier.contato.nome}
                        </div>
                      )}
                      {supplier.contato.telefone && (
                        <div>
                          <Label className="inline">Telefone:</Label> {supplier.contato.telefone}
                        </div>
                      )}
                      {supplier.contato.email && (
                        <div>
                          <Label className="inline">Email:</Label> {supplier.contato.email}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast.info("Edição de fornecedor em desenvolvimento");
                      }}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fornecedor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o fornecedor "{selectedSupplier?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSupplier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Suppliers;
