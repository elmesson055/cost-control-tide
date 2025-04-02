
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  nome_item: string;
  estoque_atual: number;
  estoque_minimo: number;
  unidade_medida: string | null;
  custo_unitario: number | null;
  fornecedor_id: string | null;
}

export interface NewInventoryItem {
  nome_item: string;
  estoque_atual?: number;
  estoque_minimo?: number;
  unidade_medida?: string;
  custo_unitario?: number;
  fornecedor_id?: string | null;
}

export function useInventory() {
  const queryClient = useQueryClient();

  // Fetch inventory items
  const { data: inventoryItems = [], isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estoque')
        .select(`
          id, 
          nome_item, 
          estoque_atual, 
          estoque_minimo, 
          unidade_medida, 
          custo_unitario, 
          fornecedor_id,
          fornecedores(nome)
        `)
        .order('nome_item');

      if (error) {
        console.error('Error fetching inventory:', error);
        toast.error('Erro ao carregar estoque');
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        fornecedor_nome: item.fornecedores?.nome || null
      }));
    }
  });

  // Fetch suppliers for dropdown
  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('id, nome')
        .order('nome');

      if (error) {
        console.error('Error fetching suppliers:', error);
        toast.error('Erro ao carregar fornecedores');
        throw error;
      }

      return data || [];
    }
  });

  // Add new inventory item
  const addInventoryItem = useMutation({
    mutationFn: async (newItem: NewInventoryItem) => {
      const { data, error } = await supabase
        .from('estoque')
        .insert([newItem])
        .select();

      if (error) {
        console.error('Error adding inventory item:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item adicionado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar item: ${error.message}`);
    }
  });

  return {
    inventoryItems,
    suppliers,
    isLoading,
    error,
    addInventoryItem
  };
}
