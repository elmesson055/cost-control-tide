
import { supabase } from '@/integrations/supabase/client';
import { Company, NewCompany } from '@/types/company.types';
import { toast } from 'sonner';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      console.log('Buscando empresas do banco de dados...');
      
      // Usando uma abordagem mais direta para evitar problemas de RLS
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, cnpj, criado_em, ativo');
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        toast.error('Não foi possível carregar as empresas. Erro: ' + error.message);
        return [];
      }
      
      console.log('Empresas carregadas com sucesso:', data);
      return data || [];
    } catch (err) {
      console.error('Exceção durante a busca de empresas:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar empresas';
      toast.error(`Erro ao carregar empresas: ${errorMessage}`);
      return [];
    }
  },

  async getCompanyById(companyId: string): Promise<Company | null> {
    try {
      if (!companyId) return null;
      
      console.log('Buscando empresa atual:', companyId);
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, cnpj, criado_em, ativo')
        .eq('id', companyId)
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao buscar empresa atual:', error);
        toast.error(`Erro ao carregar dados da empresa: ${error.message}`);
        return null;
      }
      
      console.log('Empresa atual carregada com sucesso:', data);
      return data;
    } catch (err) {
      console.error('Exceção durante a busca de empresa:', err);
      return null;
    }
  },

  async createCompany(newCompany: NewCompany): Promise<Company> {
    try {
      console.log('Criando empresa:', newCompany);
      
      // Operação básica de inserção
      const { data, error } = await supabase
        .from('empresas')
        .insert({
          nome: newCompany.nome,
          cnpj: newCompany.cnpj || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar empresa:', error);
        toast.error(`Não foi possível criar a empresa: ${error.message}`);
        throw new Error(`Erro ao criar empresa: ${error.message}`);
      }
      
      console.log('Empresa criada com sucesso:', data);
      return data as Company;
    } catch (err) {
      console.error('Exceção durante a criação da empresa:', err);
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
