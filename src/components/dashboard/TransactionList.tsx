
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {transactions.map(transaction => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center",
                  transaction.type === 'income' ? "bg-green-100" : "bg-red-100"
                )}>
                  <span className={cn(
                    "text-lg font-medium",
                    transaction.type === 'income' ? "text-finance-income" : "text-finance-expense"
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline">{transaction.category}</Badge>
                <span className={cn(
                  "font-medium",
                  transaction.type === 'income' ? "text-finance-income" : "text-finance-expense"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
