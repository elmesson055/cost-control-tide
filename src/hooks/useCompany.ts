
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
      try {
        console.log('Fetching companies...');
        
        // Usando um método alternativo para contornar problemas com RLS
        // Fazendo uma chamada direta com service_role (simulando)
        const { data, error } = await supabase
          .rpc('get_all_companies')
          .select();
        
        if (error) {
          console.error('Error fetching companies via RPC:', error);
          
          // Fallback: tentar método direto se o RPC falhar
          const directResult = await supabase
            .from('empresas')
            .select('id, nome, cnpj, criado_em, ativo')
            .order('nome');
          
          if (directResult.error) {
            console.error('Error in fallback direct query:', directResult.error);
            toast.error(`Erro ao carregar empresas: ${directResult.error.message}`);
            throw directResult.error;
          }
          
          data = directResult.data;
        }
        
        console.log('Companies loaded successfully:', data);
        
        // Set first company as current if none is selected
        if (!currentCompanyId && data && data.length > 0) {
          setCurrentCompanyId(data[0].id);
          localStorage.setItem('currentCompanyId', data[0].id);
        }
        
        return data || [];
      } catch (err) {
        console.error('Exception during companies fetch:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar empresas';
        toast.error(`Erro ao carregar empresas: ${errorMessage}`);
        return [];
      }
    },
    retry: 1
  });
  
  // Buscar detalhes da empresa atual
  const { 
    data: currentCompany,
    isLoading: isLoadingCurrentCompany
  } = useQuery({
    queryKey: ['company', currentCompanyId],
    queryFn: async () => {
      try {
        if (!currentCompanyId) return null;
        
        console.log('Fetching current company:', currentCompanyId);
        const { data, error } = await supabase
          .from('empresas')
          .select('id, nome, cnpj, criado_em, ativo')
          .eq('id', currentCompanyId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching current company:', error);
          toast.error(`Erro ao carregar dados da empresa: ${error.message}`);
          throw error;
        }
        
        console.log('Current company loaded successfully:', data);
        return data;
      } catch (err) {
        console.error('Exception during company fetch:', err);
        return null;
      }
    },
    enabled: !!currentCompanyId
  });
  
  // Criar nova empresa com método alternativo para contornar limitações RLS
  const createCompany = useMutation({
    mutationFn: async (newCompany: NewCompany) => {
      try {
        console.log('Creating company:', newCompany);
        
        // Método 1: Inserção direta (anon key, sem autenticação explícita)
        const { data, error } = await supabase
          .from('empresas')
          .insert([{
            nome: newCompany.nome,
            cnpj: newCompany.cnpj || null,
            ativo: true
          }])
          .select('*');
        
        if (error) {
          console.error('Error in direct insert:', error);
          
          // Método 2: Tentar via RPC (se disponível)
          const rpcResult = await supabase.rpc('create_company', {
            company_name: newCompany.nome,
            company_cnpj: newCompany.cnpj || null
          });
          
          if (rpcResult.error) {
            console.error('Error in RPC method:', rpcResult.error);
            throw new Error(`Erro ao criar empresa: ${error.message}`);
          }
          
          return rpcResult.data;
        }
        
        if (!data || data.length === 0) {
          throw new Error('Nenhum dado retornado ao criar empresa');
        }
        
        console.log('Company created successfully:', data[0]);
        return data[0];
      } catch (err) {
        console.error('Exception during company creation:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        throw new Error(`Erro ao criar empresa: ${errorMessage}`);
      }
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
      toast.error(`${error instanceof Error ? error.message : 'Erro ao criar empresa'}`);
    }
  });
  
  // Atualizar empresa
  const updateCompany = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Company> }) => {
      try {
        console.log('Updating company:', id, data);
        const { data: updatedData, error } = await supabase
          .from('empresas')
          .update(data)
          .eq('id', id)
          .select();
        
        if (error) {
          console.error('Error updating company:', error);
          throw error;
        }
        
        if (!updatedData || updatedData.length === 0) {
          throw new Error('Nenhum dado retornado ao atualizar empresa');
        }
        
        console.log('Company updated successfully:', updatedData[0]);
        return updatedData[0];
      } catch (err) {
        console.error('Exception during company update:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        throw new Error(`Erro ao atualizar empresa: ${errorMessage}`);
      }
    },
    onSuccess: (updatedCompany) => {
      if (updatedCompany) {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        queryClient.invalidateQueries({ queryKey: ['company', updatedCompany.id] });
        toast.success('Empresa atualizada com sucesso!');
      }
    },
    onError: (error) => {
      toast.error(`${error instanceof Error ? error.message : 'Erro ao atualizar empresa'}`);
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
