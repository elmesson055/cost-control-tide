
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyService } from "@/services/companyService";

// Use "export type" for re-exporting types when isolatedModules is enabled
export type { Company, NewCompany } from "@/types/company.types";

export const useCompany = () => {
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(() => {
    const storedId = localStorage.getItem("currentCompanyId");
    return storedId || null;
  });

  const queryClient = useQueryClient();

  // Fetch all companies with retry mechanism
  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    error: companiesError,
    refetch: refetchCompanies
  } = useQuery({
    queryKey: ["companies"],
    queryFn: companyService.getCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // Retry 3 times if it fails
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
  });

  // Fetch current company details
  const {
    data: currentCompany,
    isLoading: isLoadingCurrentCompany,
  } = useQuery({
    queryKey: ["currentCompany", currentCompanyId],
    queryFn: () => companyService.getCompanyById(currentCompanyId || ""),
    enabled: !!currentCompanyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create company mutation
  const createCompany = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      switchCompany(newCompany.id);
      toast.success(`Empresa "${newCompany.nome}" criada com sucesso!`);
    },
    onError: (error) => {
      console.error("Error in createCompany mutation:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao criar empresa: ${errorMessage}`);
    },
  });

  // Update company mutation
  const updateCompany = useMutation({
    mutationFn: companyService.updateCompany,
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({
        queryKey: ["currentCompany", updatedCompany.id],
      });
      toast.success(`Empresa "${updatedCompany.nome}" atualizada com sucesso!`);
    },
    onError: (error) => {
      console.error("Error in updateCompany mutation:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao atualizar empresa: ${errorMessage}`);
    },
  });

  // Switch company function
  const switchCompany = useCallback((companyId: string) => {
    console.log("Switching to company:", companyId);
    setCurrentCompanyId(companyId);
    localStorage.setItem("currentCompanyId", companyId);
    queryClient.invalidateQueries({ queryKey: ["currentCompany"] });
    toast.success("Empresa alterada com sucesso!");
  }, [queryClient]);

  // Initial companies fetch with delay for UI responsiveness
  useEffect(() => {
    const timer = setTimeout(() => {
      refetchCompanies();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [refetchCompanies]);

  // Simplified debug hook to log company loading progress
  useEffect(() => {
    console.log(`Companies loaded: ${companies.length}, Loading: ${isLoadingCompanies}, Error: ${companiesError ? 'Yes' : 'No'}`);
  }, [companies.length, isLoadingCompanies, companiesError]);

  return {
    companies,
    currentCompany,
    currentCompanyId,
    isLoadingCompanies,
    isLoadingCurrentCompany,
    companiesError,
    switchCompany,
    createCompany,
    updateCompany,
  };
};
