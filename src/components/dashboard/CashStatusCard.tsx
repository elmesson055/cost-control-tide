
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertCircle } from "lucide-react";

interface CashStatusCardProps {
  status: 'open' | 'closed';
  balance: number;
  lastOpened?: string;
  lastClosed?: string;
}

const CashStatusCard = ({ status, balance, lastOpened, lastClosed }: CashStatusCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status do Caixa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <div className="flex items-center gap-1">
              {status === 'open' ? (
                <>
                  <span className="text-finance-success font-medium">Aberto</span>
                  <Check className="h-4 w-4 text-finance-success" />
                </>
              ) : (
                <>
                  <span className="text-finance-expense font-medium">Fechado</span>
                  <X className="h-4 w-4 text-finance-expense" />
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Saldo Atual:</span>
            <span className="font-bold text-lg">{formatCurrency(balance)}</span>
          </div>
          
          {balance < 500 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-amber-700">Saldo baixo! Considere adicionar um suprimento.</span>
            </div>
          )}
          
          {status === 'open' && lastOpened && (
            <div className="text-xs text-muted-foreground">
              Aberto em: {lastOpened}
            </div>
          )}
          
          {status === 'closed' && lastClosed && (
            <div className="text-xs text-muted-foreground">
              Fechado em: {lastClosed}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CashStatusCard;
