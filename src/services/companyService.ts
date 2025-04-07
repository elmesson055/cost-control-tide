
import { supabase } from '@/integrations/supabase/client';
import { Company, NewCompany } from '@/types/company.types';
import { toast } from 'sonner';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      console.log('Fetching companies from database...');
      
      // Use a more basic query approach with error tracing
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        toast.error('Não foi possível carregar as empresas. Erro: ' + error.message);
        return [];
      }
      
      console.log('Companies loaded successfully:', data);
      return data as Company[];
    } catch (err) {
      console.error('Exception during companies fetch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar empresas';
      toast.error(`Erro ao carregar empresas: ${errorMessage}`);
      return [];
    }
  },

  async getCompanyById(companyId: string): Promise<Company | null> {
    try {
      if (!companyId) return null;
      
      console.log('Fetching current company:', companyId);
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching current company:', error);
        toast.error(`Erro ao carregar dados da empresa: ${error.message}`);
        return null;
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
      
      // Basic insert operation
      const { data, error } = await supabase
        .from('empresas')
        .insert({
          nome: newCompany.nome,
          cnpj: newCompany.cnpj || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating company:', error);
        toast.error(`Não foi possivel criar a empresa: ${error.message}`);
        throw new Error(`Erro ao criar empresa: ${error.message}`);
      }
      
      console.log('Company created successfully:', data);
      return data as Company;
    } catch (err) {
      console.error('Exception during company creation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao criar empresa: ${errorMessage}`);
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
        .select()
        .single();
      
      if (error) {
        console.error('Error updating company:', error);
        toast.error(`Erro ao atualizar empresa: ${error.message}`);
        throw new Error(`Erro ao atualizar empresa: ${error.message}`);
      }
      
      console.log('Company updated successfully:', updatedData);
      return updatedData as Company;
    } catch (err) {
      console.error('Exception during company update:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar empresa: ${errorMessage}`);
      throw new Error(`Erro ao atualizar empresa: ${errorMessage}`);
    }
  }
};
