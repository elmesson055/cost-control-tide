
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/companyService';
import { toast } from 'sonner';
import { Company, NewCompany } from '@/types/company.types';

export { Company, NewCompany };

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
    queryFn: companyService.getCompanies,
    retry: 1
  });
  
  // Buscar detalhes da empresa atual
  const { 
    data: currentCompany,
    isLoading: isLoadingCurrentCompany
  } = useQuery({
    queryKey: ['company', currentCompanyId],
    queryFn: () => companyService.getCompanyById(currentCompanyId || ''),
    enabled: !!currentCompanyId
  });
  
  // Efeito para selecionar a primeira empresa se nenhuma estiver selecionada
  useEffect(() => {
    if (!currentCompanyId && companies && companies.length > 0) {
      console.log("Auto-selecting first company:", companies[0].id);
      setCurrentCompanyId(companies[0].id);
      localStorage.setItem('currentCompanyId', companies[0].id);
      queryClient.invalidateQueries({ queryKey: ['company', companies[0].id] });
      toast.success(`Empresa "${companies[0].nome}" selecionada automaticamente`);
    }
  }, [currentCompanyId, companies, queryClient]);
  
  // Criar nova empresa
  const createCompany = useMutation({
    mutationFn: companyService.createCompany,
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
    mutationFn: companyService.updateCompany,
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
