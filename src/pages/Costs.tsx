
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useCostCenters } from "@/hooks/useCostCenters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CostCenterForm from "@/components/costs/CostCenterForm";

const Costs = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { costCenters, isLoading, formatCurrency, addCostCenter } = useCostCenters();

  const handleAddCostCenter = async (nome: string, orcamento: number) => {
    const success = await addCostCenter(nome, orcamento);
    if (success) {
      setDialogOpen(false);
    }
    return success;
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Custos</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Centro de Custo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Centro de Custo</DialogTitle>
              <DialogDescription>
                Adicione um novo centro de custo e defina seu orçamento mensal.
              </DialogDescription>
            </DialogHeader>
            <CostCenterForm 
              onSubmit={handleAddCostCenter}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Carregando centros de custo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {costCenters.map(center => (
            <Card key={center.id} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{center.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Orçado:</span>
                  <span className="font-medium">{formatCurrency(center.orcamento_mensal)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Utilizado:</span>
                  <span className="font-medium">{formatCurrency(center.gasto_real)}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">Restante:</span>
                  <span className={`font-medium ${center.remaining < center.orcamento_mensal * 0.1 ? 'text-finance-expense' : ''}`}>
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
                  {center.trend !== undefined && (
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
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {costCenters.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhum centro de custo encontrado. Crie um novo centro de custo para começar.
            </div>
          )}
        </div>
      )}

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
