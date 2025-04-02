
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CostCenter {
  id: string;
  nome: string;
  orcamento_mensal: number;
  gasto_real: number;
  organizacao_id?: string;
  percentUsed: number;
  remaining: number;
  trend?: number;
}

export const useCostCenters = () => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const loadCostCenters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('centros_custo')
        .select('*');
      
      if (error) {
        console.error("Error loading cost centers:", error);
        toast({
          title: "Erro ao carregar centros de custo",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      const mappedCostCenters = data.map(center => {
        const budget = Number(center.orcamento_mensal) || 0;
        const spent = Number(center.gasto_real) || 0;
        const remaining = budget - spent;
        const percentUsed = budget > 0 ? Math.round((spent / budget) * 100) : 0;
        
        return {
          id: center.id,
          nome: center.nome,
          orcamento_mensal: budget,
          gasto_real: spent,
          organizacao_id: center.organizacao_id,
          percentUsed,
          remaining,
          trend: Math.floor(Math.random() * 20) - 10 // Mock trend data for now
        };
      });
      
      setCostCenters(mappedCostCenters);
    } catch (error: any) {
      console.error("Error loading cost centers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os centros de custo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCostCenter = async (nome: string, orcamento_mensal: number) => {
    try {
      const { data, error } = await supabase
        .from('centros_custo')
        .insert([
          { nome, orcamento_mensal }
        ])
        .select();

      if (error) {
        console.error("Error adding cost center:", error);
        toast({
          title: "Erro ao criar centro de custo",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Centro de Custo criado",
        description: "O centro de custo foi adicionado com sucesso.",
      });
      
      await loadCostCenters();
      return true;
    } catch (error: any) {
      console.error("Error adding cost center:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o centro de custo.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadCostCenters();
  }, []);

  return {
    costCenters,
    isLoading,
    formatCurrency,
    addCostCenter,
    loadCostCenters
  };
};
