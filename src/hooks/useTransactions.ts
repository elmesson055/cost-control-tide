
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: string;
  category: string;
  categoryId: string | null;
  supplier: string;
  supplierId: string | null;
  costCenter: string;
  costCenterId: string | null;
  paymentMethod: string;
  paymentMethodId: string | null;
  dueDate: Date | null;
  recurring: boolean;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transacoes')
        .select('*, categorias(*), fornecedores(*), centros_custo(*), metodos_pagamento(*)');
      
      if (transactionsError) {
        toast({
          title: "Erro ao carregar transações",
          description: transactionsError.message,
          variant: "destructive",
        });
        return;
      }
      
      const mappedTransactions = transactionsData.map(transaction => {
        const categoria = transaction.categorias || {};
        const fornecedor = transaction.fornecedores || {};
        const centroCusto = transaction.centros_custo || {};
        const metodoPagamento = transaction.metodos_pagamento || {};
        
        return {
          id: transaction.id,
          date: new Date(transaction.criado_em || Date.now()),
          description: transaction.descricao || '',
          amount: Number(transaction.valor) || 0,
          type: transaction.tipo || '',
          category: categoria?.nome || 'Não categorizado',
          categoryId: categoria?.id || null,
          supplier: fornecedor?.nome || '',
          supplierId: fornecedor?.id || null,
          costCenter: centroCusto?.nome || '',
          costCenterId: centroCusto?.id || null,
          paymentMethod: metodoPagamento?.nome || '',
          paymentMethodId: metodoPagamento?.id || null,
          dueDate: transaction.data_vencimento ? new Date(transaction.data_vencimento) : null,
          recurring: transaction.recorrente || false
        };
      });
      
      setTransactions(mappedTransactions);
      setFilteredTransactions(mappedTransactions);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [typeFilter, transactions, searchTerm]);

  const handleSearch = () => {
    filterTransactions();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching categorias:', error);
        throw error;
      }

      return data || [];
    }
  });

  const { data: fornecedores = [] } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching fornecedores:', error);
        throw error;
      }

      return data || [];
    }
  });

  const { data: centrosCusto = [] } = useQuery({
    queryKey: ['centros_custo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centros_custo')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching centros de custo:', error);
        throw error;
      }

      return data || [];
    }
  });

  const { data: metodosPagamento = [] } = useQuery({
    queryKey: ['metodos_pagamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metodos_pagamento')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching metodos de pagamento:', error);
        throw error;
      }

      return data || [];
    }
  });

  return {
    transactions,
    filteredTransactions,
    isLoading,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    handleSearch,
    loadTransactions,
    formatCurrency,
    categorias,
    fornecedores,
    centrosCusto,
    metodosPagamento,
  };
}
