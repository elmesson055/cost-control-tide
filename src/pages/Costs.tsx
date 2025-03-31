
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";

const Costs = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mock data for cost centers
  const costCenters = [
    { 
      id: '1', 
      name: 'Operacional', 
      budget: 10000, 
      spent: 7500, 
      remaining: 2500,
      percentUsed: 75,
      trend: -5
    },
    { 
      id: '2', 
      name: 'Marketing', 
      budget: 5000, 
      spent: 3200, 
      remaining: 1800,
      percentUsed: 64,
      trend: 12
    },
    { 
      id: '3', 
      name: 'Administrativo', 
      budget: 8000, 
      spent: 7900, 
      remaining: 100,
      percentUsed: 99,
      trend: 8
    },
    { 
      id: '4', 
      name: 'Manutenção', 
      budget: 3000, 
      spent: 1500, 
      remaining: 1500,
      percentUsed: 50,
      trend: -10
    }
  ];

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Custos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Centro de Custo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {costCenters.map(center => (
          <Card key={center.id} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{center.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Orçado:</span>
                <span className="font-medium">{formatCurrency(center.budget)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Utilizado:</span>
                <span className="font-medium">{formatCurrency(center.spent)}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-muted-foreground">Restante:</span>
                <span className={`font-medium ${center.remaining < center.budget * 0.1 ? 'text-finance-expense' : ''}`}>
                  {formatCurrency(center.remaining)}
                </span>
              </div>
              
              <Progress 
                value={center.percentUsed} 
                className={`h-2 ${
                  center.percentUsed > 90 ? 'bg-red-100' : 
                  center.percentUsed > 75 ? 'bg-amber-100' : 'bg-slate-100'
                }`}
              />
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">
                  {center.percentUsed}% utilizado
                </span>
                <div className="flex items-center">
                  <span className="text-xs mr-1">
                    {center.trend > 0 ? (
                      <ArrowUp className="h-3 w-3 inline text-finance-expense" />
                    ) : (
                      <ArrowDown className="h-3 w-3 inline text-finance-success" />
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.abs(center.trend)}% vs mês anterior
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Custos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Selecione um centro de custo para visualizar os detalhes das despesas associadas.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Costs;
