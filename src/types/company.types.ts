
export interface Company {
  id: string;
  nome: string;
  cnpj?: string | null;
  criado_em?: string | null;
  ativo?: boolean | null;
}

export interface NewCompany {
  nome: string;
  cnpj?: string | null;
}
