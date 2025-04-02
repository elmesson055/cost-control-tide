
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/hooks/useInventory";

interface InventoryListProps {
  items: InventoryItem[];
}

const InventoryList: React.FC<InventoryListProps> = ({ items }) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (atual: number, minimo: number) => {
    if (atual === 0) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Esgotado
        </Badge>
      );
    } 
    else if (atual < minimo) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Baixo
        </Badge>
      );
    } 
    else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Normal
        </Badge>
      );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Custo Unitário</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.nome_item}</TableCell>
            <TableCell>{item.unidade_medida || "-"}</TableCell>
            <TableCell>{item.fornecedor_nome || "-"}</TableCell>
            <TableCell>
              {item.estoque_atual} 
              {item.estoque_atual < item.estoque_minimo && (
                <span className="text-amber-500 ml-2 text-xs">
                  (Min: {item.estoque_minimo})
                </span>
              )}
            </TableCell>
            <TableCell>
              {getStatusBadge(item.estoque_atual, item.estoque_minimo)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(item.custo_unitario)}
            </TableCell>
          </TableRow>
        ))}

        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Nenhum item encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InventoryList;
