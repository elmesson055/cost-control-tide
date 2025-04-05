
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
