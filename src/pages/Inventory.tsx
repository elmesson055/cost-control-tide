
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import InventoryList from "@/components/inventory/InventoryList";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryForm from "@/components/inventory/InventoryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Inventory = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const { inventoryItems, suppliers, isLoading, addInventoryItem } = useInventory();

  // Initialize filtered items with all items when data is loaded
  useState(() => {
    if (inventoryItems && inventoryItems.length > 0) {
      setFilteredItems(inventoryItems);
    }
  });

  const handleSearch = (searchTerm: string, category: string) => {
    let filtered = [...inventoryItems];
    
    // Filter by category/unit
    if (category !== 'all') {
      filtered = filtered.filter(item => item.unidade_medida === category);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.nome_item.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(filtered);
  };

  const handleAddItem = async (data: any) => {
    await addInventoryItem.mutateAsync(data);
    setIsAddDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Estoque</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <InventoryFilters onSearch={handleSearch} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Carregando...</div>
          ) : (
            <InventoryList items={filteredItems.length > 0 ? filteredItems : inventoryItems} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Item de Estoque</DialogTitle>
          </DialogHeader>
          <InventoryForm 
            onSubmit={handleAddItem} 
            onCancel={() => setIsAddDialogOpen(false)} 
            suppliers={suppliers}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
