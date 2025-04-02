
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryFiltersProps {
  onSearch: (term: string, category: string) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleSearch = () => {
    onSearch(searchTerm, categoryFilter);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    onSearch(searchTerm, value);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex w-full md:w-1/2 items-center space-x-2">
            <Input
              placeholder="Pesquisar item..."
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
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            >
              <option value="all">Todas as unidades</option>
              <option value="kg">kg - Quilogramas</option>
              <option value="L">L - Litros</option>
              <option value="un">un - Unidades</option>
              <option value="pacote">Pacotes</option>
              <option value="caixa">Caixas</option>
            </select>
            <Filter className="h-4 w-4 mx-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryFilters;
