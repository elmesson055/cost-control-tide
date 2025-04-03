
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Company {
  id: string;
  nome: string;
  cnpj?: string;
  criado_em?: string;
  ativo?: boolean;
}

export interface NewCompany {
  nome: string;
  cnpj?: string;
}

export function useCompany() {
  const queryClient = useQueryClient();
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(
    localStorage.getItem('currentCompanyId')
  );
  
  // Buscar todas as empresas
  const { 
    data: companies = [], 
    isLoading: isLoadingCompanies,
    error: companiesError 
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome');
      
      if (error) {
        console.error('Error fetching companies:', error);
        toast.error(`Erro ao carregar empresas: ${error.message}`);
        throw error;
      }
      
      // Se não houver empresa selecionada e houver empresas disponíveis
      if (!currentCompanyId && data && data.length > 0) {
        setCurrentCompanyId(data[0].id);
        localStorage.setItem('currentCompanyId', data[0].id);
      }
      
      return data || [];
    }
  });
  
  // Buscar detalhes da empresa atual
  const { 
    data: currentCompany,
    isLoading: isLoadingCurrentCompany
  } = useQuery({
    queryKey: ['company', currentCompanyId],
    queryFn: async () => {
      if (!currentCompanyId) return null;
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', currentCompanyId)
        .single();
      
      if (error) {
        console.error('Error fetching current company:', error);
        toast.error(`Erro ao carregar dados da empresa: ${error.message}`);
        throw error;
      }
      
      return data;
    },
    enabled: !!currentCompanyId
  });
  
  // Criar nova empresa
  const createCompany = useMutation({
    mutationFn: async (newCompany: NewCompany) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert([newCompany])
        .select();
      
      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }
      
      return data?.[0];
    },
    onSuccess: (newCompany) => {
      if (newCompany) {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        toast.success('Empresa criada com sucesso!');
        // Selecionar automaticamente a nova empresa se for a primeira
        if (!currentCompanyId) {
          setCurrentCompanyId(newCompany.id);
          localStorage.setItem('currentCompanyId', newCompany.id);
          queryClient.invalidateQueries({ queryKey: ['company', newCompany.id] });
        }
      }
    },
    onError: (error) => {
      toast.error(`Erro ao criar empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Atualizar empresa
  const updateCompany = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Company> }) => {
      const { data: updatedData, error } = await supabase
        .from('empresas')
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }
      
      return updatedData?.[0];
    },
    onSuccess: (updatedCompany) => {
      if (updatedCompany) {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        queryClient.invalidateQueries({ queryKey: ['company', updatedCompany.id] });
        toast.success('Empresa atualizada com sucesso!');
      }
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Alternar entre empresas
  const switchCompany = (companyId: string) => {
    setCurrentCompanyId(companyId);
    localStorage.setItem('currentCompanyId', companyId);
    
    // Invalidar queries que dependem da empresa atual
    queryClient.invalidateQueries({ queryKey: ['company'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['categorias'] });
    queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    queryClient.invalidateQueries({ queryKey: ['centros_custo'] });
    queryClient.invalidateQueries({ queryKey: ['metodos_pagamento'] });
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    
    toast.success('Empresa alterada com sucesso!');
  };
  
  return {
    companies,
    currentCompany,
    currentCompanyId,
    isLoadingCompanies,
    isLoadingCurrentCompany,
    createCompany,
    updateCompany,
    switchCompany,
  };
}
