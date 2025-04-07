
import { supabase } from '@/integrations/supabase/client';
import { Company, NewCompany } from '@/types/company.types';
import { toast } from 'sonner';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      console.log('Fetching companies...');
      
      // Fetch all companies directly
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, cnpj, criado_em, ativo')
        .order('nome');
      
      if (error) {
        console.error('Error fetching companies:', error);
        toast.error('Não foi possível carregar as empresas. Verifique as políticas de acesso no Supabase.');
        return [];
      }
      
      console.log('Companies loaded successfully:', data);
      return data as Company[];
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
      
      // Using the create_company_secure RPC function with explicit TypeScript casting
      const { data, error } = await supabase.rpc(
        'create_company_secure' as any, 
        {
          company_name: newCompany.nome,
          company_cnpj: newCompany.cnpj || null
        }
      );
      
      if (error) {
        console.error('Error creating company with secure function:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Nenhum dado retornado ao criar empresa');
      }
      
      // Fetch the newly created company to get all its data
      const companyId = data;
      const { data: companyData, error: fetchError } = await supabase
        .from('empresas')
        .select('id, nome, cnpj, criado_em, ativo')
        .eq('id', companyId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching created company:', fetchError);
        throw fetchError;
      }
      
      console.log('Company created successfully:', companyData);
      return companyData as Company;
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
