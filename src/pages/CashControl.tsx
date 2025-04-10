
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import CashOperations from "@/components/cash-control/CashOperations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCashHistory, formatDateTime } from "@/utils/mockData";
import { toast } from "sonner";
import { useCashControl } from '@/hooks/useCashControl';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CashControl = () => {
  const [cashState, setCashState] = useState({
    isOpen: true,
    currentBalance: 1250.75,
    openedAt: "12/06/2024 08:15:22",
    closedAt: null as string | null
  });

  // Mock initial cash history data
  const [cashHistory, setCashHistory] = useState(generateCashHistory());

  const handleOpenCash = (initialAmount: number, notes: string) => {
    setCashState({
      isOpen: true,
      currentBalance: initialAmount,
      openedAt: formatDateTime(new Date()),
      closedAt: null
    });
    
    toast.success("Caixa aberto com sucesso!");
  };

  const handleCloseCash = (notes: string) => {
    setCashState({
      ...cashState,
      isOpen: false,
      closedAt: formatDateTime(new Date())
    });
    
    toast.success("Caixa fechado com sucesso!");
  };

  const handleCashSupply = (amount: number, notes: string) => {
    setCashState({
      ...cashState,
      currentBalance: cashState.currentBalance + amount
    });
    
    toast.success(`Suprimento de ${formatCurrency(amount)} realizado com sucesso!`);
  };

  const handleCashWithdraw = (amount: number, notes: string) => {
    if (amount > cashState.currentBalance) {
      toast.error("Valor de sangria maior que o saldo atual do caixa!");
      return;
    }
    
    setCashState({
      ...cashState,
      currentBalance: cashState.currentBalance - amount
    });
    
    toast.success(`Sangria de ${formatCurrency(amount)} realizada com sucesso!`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Caixa</h1>
        <CashOperations 
          isCashOpen={cashState.isOpen}
          onOpenCash={handleOpenCash}
          onCloseCash={handleCloseCash}
          onCashSupply={handleCashSupply}
          onCashWithdraw={handleCashWithdraw}
        />
      </div>

      {/* Current Cash Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status Atual do Caixa</CardTitle>
          <CardDescription>
            Informações sobre o caixa atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">Status:</span>
              <div>
                {cashState.isOpen ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Aberto</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Fechado</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">Saldo Atual:</span>
              <span className="text-2xl font-bold">{formatCurrency(cashState.currentBalance)}</span>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">
                {cashState.isOpen ? "Aberto em:" : "Fechado em:"}
              </span>
              <span>{cashState.isOpen ? cashState.openedAt : cashState.closedAt}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Operações</CardTitle>
          <CardDescription>
            Histórico de movimentações do caixa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current">
            <TabsList className="mb-4">
              <TabsTrigger value="current">Atual</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <div className="space-y-4">
                <div className="grid grid-cols-4 py-2 font-medium border-b">
                  <div>Tipo</div>
                  <div>Hora</div>
                  <div className="text-right">Valor</div>
                  <div>Observação</div>
                </div>
                
                {cashHistory[0].operations.map((operation) => (
                  <div key={operation.id} className="grid grid-cols-4 py-2 border-b last:border-b-0">
                    <div>
                      <Badge variant={operation.type === 'entrada' ? 'default' : 'secondary'}>
                        {operation.type === 'entrada' ? 'Suprimento' : 'Sangria'}
                      </Badge>
                    </div>
                    <div className="text-sm">{operation.time}</div>
                    <div className={`text-right font-medium ${operation.type === 'entrada' ? 'text-finance-income' : 'text-finance-expense'}`}>
                      {operation.type === 'entrada' ? '+' : '-'}{formatCurrency(operation.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{operation.notes}</div>
                  </div>
                ))}
                
                {cashHistory[0].operations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma operação registrada para hoje.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-8">
                {cashHistory.slice(1).map((day) => (
                  <div key={day.date} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{day.date}</h3>
                        <p className="text-sm text-muted-foreground">
                          Abertura: {day.openingTime} • 
                          Fechamento: {day.closingTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Saldo final</p>
                        <p className="text-lg font-bold">{formatCurrency(day.finalBalance!)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {day.operations.map((operation) => (
                        <div key={operation.id} className="grid grid-cols-4 py-2 border-b last:border-b-0">
                          <div>
                            <Badge variant={operation.type === 'entrada' ? 'default' : 'secondary'}>
                              {operation.type === 'entrada' ? 'Suprimento' : 'Sangria'}
                            </Badge>
                          </div>
                          <div className="text-sm">{operation.time}</div>
                          <div className={`text-right font-medium ${operation.type === 'entrada' ? 'text-finance-income' : 'text-finance-expense'}`}>
                            {operation.type === 'entrada' ? '+' : '-'}{formatCurrency(operation.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{operation.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default CashControl;
