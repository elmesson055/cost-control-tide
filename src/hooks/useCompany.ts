
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
        
        // Tentativa direta primeiro (pode falhar devido ao RLS)
        let companyData: Company[] = [];
        
        try {
          // Usando um método direto para buscar empresas
          const directResult = await supabase
            .from('empresas')
            .select('id, nome, cnpj, criado_em, ativo')
            .order('nome');
          
          if (directResult.error) {
            console.error('Error in direct query:', directResult.error);
            throw directResult.error;
          }
          
          companyData = directResult.data as Company[];
          console.log('Companies loaded via direct query:', companyData);
        } catch (queryError) {
          console.error('Error in primary query method:', queryError);
          
          // Tentativa com RPC como fallback (se implementado no backend)
          try {
            const rpcResult = await supabase.rpc('get_all_companies');
            
            if (rpcResult.error) {
              console.error('Error in RPC fallback:', rpcResult.error);
              throw rpcResult.error;
            }
            
            companyData = rpcResult.data as Company[];
            console.log('Companies loaded via RPC fallback:', companyData);
          } catch (rpcError) {
            // Se ambos falharem, log e retornar array vazio
            console.error('All company fetch methods failed:', rpcError);
            toast.error('Não foi possível carregar as empresas. Verifique as políticas de acesso no Supabase.');
            return [];
          }
        }
        
        console.log('Companies loaded successfully:', companyData);
        
        // Set first company as current if none is selected
        if (!currentCompanyId && companyData.length > 0) {
          setCurrentCompanyId(companyData[0].id);
          localStorage.setItem('currentCompanyId', companyData[0].id);
        }
        
        return companyData;
      } catch (err) {
        console.error('Exception during companies fetch:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar empresas';
        toast.error(`Erro ao carregar empresas: ${errorMessage}`);
        return [] as Company[];
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
        return data as Company | null;
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
        
        // Tentativa 1: Inserção direta
        let createdCompany: Company | null = null;
        
        try {
          const insertResult = await supabase
            .from('empresas')
            .insert([{
              nome: newCompany.nome,
              cnpj: newCompany.cnpj || null,
              ativo: true
            }])
            .select();
          
          if (insertResult.error) {
            console.error('Error in direct insert:', insertResult.error);
            throw insertResult.error;
          }
          
          if (!insertResult.data || insertResult.data.length === 0) {
            throw new Error('Nenhum dado retornado ao criar empresa');
          }
          
          createdCompany = insertResult.data[0] as Company;
        } catch (insertError) {
          console.error('Insert method failed:', insertError);
          
          // Tentativa 2: Criar via RPC (alternativa se implementada)
          try {
            const rpcResult = await supabase.rpc('create_company', {
              company_name: newCompany.nome,
              company_cnpj: newCompany.cnpj || null
            });
            
            if (rpcResult.error) {
              console.error('Error in RPC method:', rpcResult.error);
              throw rpcResult.error;
            }
            
            createdCompany = rpcResult.data as Company;
          } catch (rpcError) {
            console.error('All creation methods failed:', rpcError);
            throw new Error('Não foi possível criar a empresa. Verifique as permissões no banco de dados.');
          }
        }
        
        if (!createdCompany) {
          throw new Error('Falha ao criar empresa: nenhum dado retornado');
        }
        
        console.log('Company created successfully:', createdCompany);
        return createdCompany;
      } catch (err) {
        console.error('Exception during company creation:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        throw new Error(`Erro ao criar empresa: ${errorMessage}`);
      }
    },
    onSuccess: (newCompany: Company) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa criada com sucesso!');
      
      // Selecionar automaticamente a nova empresa se for a primeira
      if (!currentCompanyId) {
        setCurrentCompanyId(newCompany.id);
        localStorage.setItem('currentCompanyId', newCompany.id);
        queryClient.invalidateQueries({ queryKey: ['company', newCompany.id] });
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
        return updatedData[0] as Company;
      } catch (err) {
        console.error('Exception during company update:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        throw new Error(`Erro ao atualizar empresa: ${errorMessage}`);
      }
    },
    onSuccess: (updatedCompany: Company) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', updatedCompany.id] });
      toast.success('Empresa atualizada com sucesso!');
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
