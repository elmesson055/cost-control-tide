
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
import { Plus, Search, Filter } from "lucide-react";
import { useState } from "react";

const Inventory = () => {
  // Mock data for inventory items
  const allItems = [
    {
      id: '1',
      name: 'Café em grãos (kg)',
      sku: 'CAF001',
      category: 'Insumos',
      quantity: 25,
      minQuantity: 10,
      status: 'normal',
      lastPurchase: '15/05/2024',
      cost: 28.50
    },
    {
      id: '2',
      name: 'Leite (L)',
      sku: 'LEI002',
      category: 'Insumos',
      quantity: 8,
      minQuantity: 12,
      status: 'low',
      lastPurchase: '18/05/2024',
      cost: 4.75
    },
    {
      id: '3',
      name: 'Copos descartáveis (100un)',
      sku: 'COP003',
      category: 'Descartáveis',
      quantity: 35,
      minQuantity: 20,
      status: 'normal',
      lastPurchase: '10/05/2024',
      cost: 12.30
    },
    {
      id: '4',
      name: 'Açúcar (kg)',
      sku: 'ACU004',
      category: 'Insumos',
      quantity: 15,
      minQuantity: 8,
      status: 'normal',
      lastPurchase: '12/05/2024',
      cost: 5.90
    },
    {
      id: '5',
      name: 'Guardanapos (100un)',
      sku: 'GUA005',
      category: 'Descartáveis',
      quantity: 5,
      minQuantity: 10,
      status: 'low',
      lastPurchase: '05/05/2024',
      cost: 8.50
    }
  ];

  const [filteredItems, setFilteredItems] = useState(allItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filterItems = () => {
    let filtered = allItems;
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.sku.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(filtered);
  };

  const handleSearch = () => {
    filterItems();
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setTimeout(filterItems, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'low':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Baixo
          </Badge>
        );
      case 'out':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Esgotado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Normal
          </Badge>
        );
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Estoque</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
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
                placeholder="Pesquisar por nome ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryFilter}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                <option value="Insumos">Insumos</option>
                <option value="Descartáveis">Descartáveis</option>
                <option value="Equipamentos">Equipamentos</option>
                <option value="Outros">Outros</option>
              </select>
              <Filter className="h-4 w-4 mx-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-right">Custo Unitário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} 
                    {item.quantity < item.minQuantity && (
                      <span className="text-amber-500 ml-2 text-xs">
                        (Min: {item.minQuantity})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>{item.lastPurchase}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Inventory;
