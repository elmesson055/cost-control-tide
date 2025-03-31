
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
import { Plus, Search, ExternalLink, Phone, Mail } from "lucide-react";
import { useState } from "react";

const Suppliers = () => {
  // Mock data for suppliers
  const allSuppliers = [
    {
      id: '1',
      name: 'Café Premium Distribuidora',
      category: 'Insumos',
      contact: 'João Silva',
      phone: '(11) 98765-4321',
      email: 'joao@cafepremium.com.br',
      status: 'active',
      lastPurchase: '15/05/2024',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Laticínios Qualidade',
      category: 'Insumos',
      contact: 'Maria Oliveira',
      phone: '(11) 91234-5678',
      email: 'maria@laticinios.com.br',
      status: 'active',
      lastPurchase: '18/05/2024',
      rating: 4.5
    },
    {
      id: '3',
      name: 'Descartáveis Eco',
      category: 'Descartáveis',
      contact: 'Pedro Santos',
      phone: '(11) 92345-6789',
      email: 'pedro@ecodescartaveis.com',
      status: 'inactive',
      lastPurchase: '10/04/2024',
      rating: 3.2
    },
    {
      id: '4',
      name: 'Açúcar & Cia',
      category: 'Insumos',
      contact: 'Ana Costa',
      phone: '(11) 93456-7890',
      email: 'ana@acucarcia.com.br',
      status: 'active',
      lastPurchase: '12/05/2024',
      rating: 4.6
    },
    {
      id: '5',
      name: 'Embalagens Total',
      category: 'Embalagens',
      contact: 'Carlos Mendes',
      phone: '(11) 94567-8901',
      email: 'carlos@embalagemtotal.com',
      status: 'active',
      lastPurchase: '05/05/2024',
      rating: 4.1
    }
  ];

  const [filteredSuppliers, setFilteredSuppliers] = useState(allSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filterSuppliers = () => {
    let filtered = allSuppliers;
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.category === categoryFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }
    
    // Filter by search term
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
        <Button>
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
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                    <div>{supplier.name}</div>
                    <div className="flex gap-4 mt-1">
                      <a href={`mailto:${supplier.email}`} className="text-xs flex items-center text-muted-foreground hover:text-primary">
                        <Mail className="h-3 w-3 mr-1" />
                        {supplier.email}
                      </a>
                      <a href={`tel:${supplier.phone}`} className="text-xs flex items-center text-muted-foreground hover:text-primary">
                        <Phone className="h-3 w-3 mr-1" />
                        {supplier.phone}
                      </a>
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
                  <TableCell>{supplier.lastPurchase}</TableCell>
                  <TableCell>
                    {getRatingStars(supplier.rating)}
                    <span className="ml-1 text-xs text-muted-foreground">{supplier.rating.toFixed(1)}/5</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum fornecedor encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Suppliers;
