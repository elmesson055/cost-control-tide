
import { supabase } from '@/integrations/supabase/client';
import { Company, NewCompany } from '@/types/company.types';
import { toast } from 'sonner';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
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
          // @ts-ignore - Ignoramos o erro de tipagem para o RPC que existe no banco mas não está na definição de tipos
          const rpcResult = await supabase.rpc('get_all_companies');
          
          if (rpcResult.error) {
            console.error('Error in RPC fallback:', rpcResult.error);
            throw rpcResult.error;
          }
          
          // Garantimos que o resultado é um array
          if (Array.isArray(rpcResult.data)) {
            companyData = rpcResult.data as Company[];
          } else {
            console.error('RPC result is not an array:', rpcResult.data);
            throw new Error('Formato de dados inesperado do RPC');
          }
          console.log('Companies loaded via RPC fallback:', companyData);
        } catch (rpcError) {
          // Se ambos falharem, log e retornar array vazio
          console.error('All company fetch methods failed:', rpcError);
          toast.error('Não foi possível carregar as empresas. Verifique as políticas de acesso no Supabase.');
          return [];
        }
      }
      
      console.log('Companies loaded successfully:', companyData);
      return companyData;
    } catch (err) {
      console.error('Exception during companies fetch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar empresas';
      toast.error(`Erro ao carregar empresas: ${errorMessage}`);
      return [] as Company[];
    }
  },

  async getCompanyById(companyId: string): Promise<Company | null> {
    try {
      if (!companyId) return null;
      
      console.log('Fetching current company:', companyId);
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, cnpj, criado_em, ativo')
        .eq('id', companyId)
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

  async createCompany(newCompany: NewCompany): Promise<Company> {
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
          // @ts-ignore - Ignoramos o erro de tipagem para o RPC que existe no banco mas não está na definição de tipos
          const rpcResult = await supabase.rpc('create_company', {
            company_name: newCompany.nome,
            company_cnpj: newCompany.cnpj || null
          });
          
          if (rpcResult.error) {
            console.error('Error in RPC method:', rpcResult.error);
            throw rpcResult.error;
          }
          
          // Garantimos que o resultado é um objeto válido e não um booleano
          if (typeof rpcResult.data === 'object' && rpcResult.data !== null) {
            createdCompany = rpcResult.data as Company;
          } else {
            console.error('RPC result is not a valid company object:', rpcResult.data);
            throw new Error('Formato de dados inesperado do RPC');
          }
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

  async updateCompany({ id, data }: { id: string; data: Partial<Company> }): Promise<Company> {
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
  }
};
