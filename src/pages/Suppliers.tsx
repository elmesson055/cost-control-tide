
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, ExternalLink, Phone, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Definir o schema de validação do formulário
const supplierFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  contato_nome: z.string().min(1, "Nome do contato é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

// Tipo para fornecedores
interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  lastPurchase?: string;
  rating: number;
  tipo_documento?: string;
  numero_documento?: string;
}

const Suppliers = () => {
  // Mock data for suppliers (será substituído pelos dados do Supabase)
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Inicializar o formulário
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      nome: "",
      categoria: "Insumos",
      contato_nome: "",
      telefone: "",
      email: "",
      tipo_documento: "",
      numero_documento: "",
    },
  });

  // Carregar fornecedores do Supabase
  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('fornecedores').select('*');
      
      if (error) {
        toast({
          title: "Erro ao carregar fornecedores",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Mapear dados do banco para o formato usado no componente
      const mappedSuppliers = data.map(supplier => ({
        id: supplier.id,
        name: supplier.nome,
        category: supplier.tipo || "Insumos",
        contact: supplier.contato?.nome || "",
        phone: supplier.contato?.telefone || "",
        email: supplier.contato?.email || "",
        status: "active", // Definir status padrão
        lastPurchase: "", // Campo a ser preenchido quando tivermos integração com transações
        rating: 4.0, // Campo a ser calculado no futuro
        tipo_documento: supplier.tipo_documento,
        numero_documento: supplier.numero_documento
      }));
      
      setAllSuppliers(mappedSuppliers);
      setFilteredSuppliers(mappedSuppliers);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os fornecedores.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar fornecedores ao montar o componente
  useEffect(() => {
    loadSuppliers();
  }, []);

  // Enviar formulário
  const onSubmit = async (values: SupplierFormValues) => {
    setIsSubmitting(true);
    try {
      // Preparar objeto para inserção
      const newSupplier = {
        nome: values.nome,
        tipo: values.categoria,
        tipo_documento: values.tipo_documento,
        numero_documento: values.numero_documento,
        contato: {
          nome: values.contato_nome,
          telefone: values.telefone,
          email: values.email
        }
      };
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('fornecedores')
        .insert(newSupplier)
        .select();
      
      if (error) {
        toast({
          title: "Erro ao cadastrar fornecedor",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Fornecedor cadastrado",
        description: "O fornecedor foi cadastrado com sucesso.",
      });
      
      // Fechar diálogo e recarregar fornecedores
      setIsDialogOpen(false);
      form.reset();
      loadSuppliers();
      
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível cadastrar o fornecedor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = allSuppliers;
    
    // Filtrar por categoria
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.category === categoryFilter);
    }
    
    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(term) || 
        supplier.contact.toLowerCase().includes(term) ||
        supplier.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredSuppliers(filtered);
  };

  const handleSearch = () => {
    filterSuppliers();
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setTimeout(filterSuppliers, 0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setTimeout(filterSuppliers, 0);
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for(let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if(hasHalfStar) {
      stars.push('⯨');
    }
    
    const emptyStars = 5 - stars.length;
    for(let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
    
    return (
      <span className="text-amber-500">{stars.join('')}</span>
    );
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex w-full md:w-1/2 items-center space-x-2">
              <Input
                placeholder="Pesquisar por nome, contato ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryFilter}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                <option value="Insumos">Insumos</option>
                <option value="Descartáveis">Descartáveis</option>
                <option value="Embalagens">Embalagens</option>
                <option value="Equipamentos">Equipamentos</option>
              </select>
              
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead>Avaliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div>{supplier.name}</div>
                        <div className="flex gap-4 mt-1">
                          {supplier.email && (
                            <a href={`mailto:${supplier.email}`} className="text-xs flex items-center text-muted-foreground hover:text-primary">
                              <Mail className="h-3 w-3 mr-1" />
                              {supplier.email}
                            </a>
                          )}
                          {supplier.phone && (
                            <a href={`tel:${supplier.phone}`} className="text-xs flex items-center text-muted-foreground hover:text-primary">
                              <Phone className="h-3 w-3 mr-1" />
                              {supplier.phone}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>
                        {supplier.status === 'active' ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{supplier.lastPurchase || "N/A"}</TableCell>
                      <TableCell>
                        {getRatingStars(supplier.rating)}
                        <span className="ml-1 text-xs text-muted-foreground">{supplier.rating.toFixed(1)}/5</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum fornecedor encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Novo Fornecedor */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Novo Fornecedor</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Fornecedor*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Insumos">Insumos</SelectItem>
                          <SelectItem value="Descartáveis">Descartáveis</SelectItem>
                          <SelectItem value="Embalagens">Embalagens</SelectItem>
                          <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo_documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
                          <SelectItem value="CPF">CPF</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero_documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Informações de Contato</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="contato_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contato*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da pessoa para contato" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Fornecedor
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Suppliers;
