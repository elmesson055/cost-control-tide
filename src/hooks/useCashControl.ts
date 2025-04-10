import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CashControl {
  id: string;
  is_open: boolean;
  current_balance: number;
  opened_at: string;
  closed_at: string | null;
  notes: string | null;
}

export function useCashControl() {
  const queryClient = useQueryClient();

  // Fetch current cash state
  const { data: cashState, isLoading } = useQuery({
    queryKey: ['cashControl'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_control')
        .select('*')
        .order('opened_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching cash state:', error);
        throw error;
      }

      return data || null;
    }
  });

  // Open cash register
  const openCash = useMutation({
    mutationFn: async ({ initialAmount, notes }: { initialAmount: number; notes: string }) => {
      const { data, error } = await supabase
        .from('cash_control')
        .insert([{
          is_open: true,
          current_balance: initialAmount,
          opened_at: new Date().toISOString(),
          notes
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cashControl']);
      toast.success('Caixa aberto com sucesso!');
    }
  });

  // Close cash register
  const closeCash = useMutation({
    mutationFn: async ({ finalAmount, notes }: { finalAmount: number; notes: string }) => {
      const { data, error } = await supabase
        .from('cash_control')
        .update({
          is_open: false,
          current_balance: finalAmount,
          closed_at: new Date().toISOString(),
          notes
        })
        .eq('is_open', true)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cashControl']);
      toast.success('Caixa fechado com sucesso!');
    }
  });

  return { cashState, isLoading, openCash, closeCash };
}