
// Funções RPC do Supabase para contornar problemas de RLS
// Este arquivo serve como documentação das funções disponíveis

/* 
Função: get_all_companies
Descrição: Obtém todas as empresas sem restrições de RLS
Retorno: Array de empresas

CREATE OR REPLACE FUNCTION public.get_all_companies()
RETURNS SETOF public.empresas
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.empresas ORDER BY nome;
$$;

Função: create_company
Descrição: Cria uma nova empresa sem restrições de RLS
Parâmetros:
  - company_name: nome da empresa
  - company_cnpj: CNPJ da empresa (opcional)
Retorno: Empresa criada

CREATE OR REPLACE FUNCTION public.create_company(
  company_name TEXT,
  company_cnpj TEXT DEFAULT NULL
)
RETURNS public.empresas
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company public.empresas;
BEGIN
  INSERT INTO public.empresas (nome, cnpj, ativo)
  VALUES (company_name, company_cnpj, true)
  RETURNING * INTO new_company;
  
  RETURN new_company;
END;
$$;
*/
