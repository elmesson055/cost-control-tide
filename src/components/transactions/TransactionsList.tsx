
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import TransactionType from "./TransactionType";

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: string;
  category: string;
  categoryId: string;
  supplier: string;
  supplierId: string;
  costCenter: string;
  costCenterId: string;
  paymentMethod: string;
  paymentMethodId: string;
  dueDate: Date | null;
  recurring: boolean;
}

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  isLoading,
  formatCurrency,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Lista de Transações</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">Carregando transações...</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <TransactionType type={transaction.type} />
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {!isLoading && transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma transação encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
