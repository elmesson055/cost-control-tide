export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      caixas: {
        Row: {
          aberto_em: string | null
          fechado_em: string | null
          id: string
          operador_id: string | null
          organizacao_id: string | null
          saldo_atual: number
          saldo_inicial: number
          status: string | null
        }
        Insert: {
          aberto_em?: string | null
          fechado_em?: string | null
          id?: string
          operador_id?: string | null
          organizacao_id?: string | null
          saldo_atual: number
          saldo_inicial: number
          status?: string | null
        }
        Update: {
          aberto_em?: string | null
          fechado_em?: string | null
          id?: string
          operador_id?: string | null
          organizacao_id?: string | null
          saldo_atual?: number
          saldo_inicial?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caixas_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          empresa_id: string | null
          id: string
          nome: string
          organizacao_id: string | null
          tipo: string | null
        }
        Insert: {
          empresa_id?: string | null
          id?: string
          nome: string
          organizacao_id?: string | null
          tipo?: string | null
        }
        Update: {
          empresa_id?: string | null
          id?: string
          nome?: string
          organizacao_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      centros_custo: {
        Row: {
          empresa_id: string | null
          gasto_real: number | null
          id: string
          nome: string
          orcamento_mensal: number | null
          organizacao_id: string | null
        }
        Insert: {
          empresa_id?: string | null
          gasto_real?: number | null
          id?: string
          nome: string
          orcamento_mensal?: number | null
          organizacao_id?: string | null
        }
        Update: {
          empresa_id?: string | null
          gasto_real?: number | null
          id?: string
          nome?: string
          orcamento_mensal?: number | null
          organizacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "centros_custo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "centros_custo_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      convites_empresa: {
        Row: {
          aceito: boolean | null
          cargo: string | null
          criado_em: string | null
          email: string
          empresa_id: string
          expira_em: string | null
          id: string
          token: string
        }
        Insert: {
          aceito?: boolean | null
          cargo?: string | null
          criado_em?: string | null
          email: string
          empresa_id: string
          expira_em?: string | null
          id?: string
          token: string
        }
        Update: {
          aceito?: boolean | null
          cargo?: string | null
          criado_em?: string | null
          email?: string
          empresa_id?: string
          expira_em?: string | null
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "convites_empresa_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cnpj: string | null
          criado_em: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cnpj?: string | null
          criado_em?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string | null
          criado_em?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      estoque: {
        Row: {
          custo_unitario: number | null
          empresa_id: string | null
          estoque_atual: number | null
          estoque_minimo: number | null
          fornecedor_id: string | null
          id: string
          nome_item: string
          organizacao_id: string | null
          unidade_medida: string | null
        }
        Insert: {
          custo_unitario?: number | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          id?: string
          nome_item: string
          organizacao_id?: string | null
          unidade_medida?: string | null
        }
        Update: {
          custo_unitario?: number | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          id?: string
          nome_item?: string
          organizacao_id?: string | null
          unidade_medida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          contato: Json | null
          empresa_id: string | null
          id: string
          nome: string
          numero_documento: string | null
          organizacao_id: string | null
          tipo_documento: string | null
        }
        Insert: {
          contato?: Json | null
          empresa_id?: string | null
          id?: string
          nome: string
          numero_documento?: string | null
          organizacao_id?: string | null
          tipo_documento?: string | null
        }
        Update: {
          contato?: Json | null
          empresa_id?: string | null
          id?: string
          nome?: string
          numero_documento?: string | null
          organizacao_id?: string | null
          tipo_documento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedores_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      metodos_pagamento: {
        Row: {
          ativo: boolean | null
          empresa_id: string | null
          id: string
          nome: string
          organizacao_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          empresa_id?: string | null
          id?: string
          nome: string
          organizacao_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          empresa_id?: string | null
          id?: string
          nome?: string
          organizacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metodos_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metodos_pagamento_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      organizacoes: {
        Row: {
          criado_em: string | null
          dados_fiscais: Json | null
          id: string
          moeda: string | null
          nome: string
        }
        Insert: {
          criado_em?: string | null
          dados_fiscais?: Json | null
          id?: string
          moeda?: string | null
          nome: string
        }
        Update: {
          criado_em?: string | null
          dados_fiscais?: Json | null
          id?: string
          moeda?: string | null
          nome?: string
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          caixa_id: string | null
          categoria_id: string | null
          centro_custo_id: string | null
          criado_em: string | null
          data_vencimento: string | null
          descricao: string | null
          empresa_id: string | null
          fornecedor_id: string | null
          id: string
          metodo_pagamento_id: string | null
          organizacao_id: string | null
          recorrente: boolean | null
          tipo: string
          valor: number
        }
        Insert: {
          caixa_id?: string | null
          categoria_id?: string | null
          centro_custo_id?: string | null
          criado_em?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          metodo_pagamento_id?: string | null
          organizacao_id?: string | null
          recorrente?: boolean | null
          tipo: string
          valor: number
        }
        Update: {
          caixa_id?: string | null
          categoria_id?: string | null
          centro_custo_id?: string | null
          criado_em?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          metodo_pagamento_id?: string | null
          organizacao_id?: string | null
          recorrente?: boolean | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_metodo_pagamento_id_fkey"
            columns: ["metodo_pagamento_id"]
            isOneToOne: false
            referencedRelation: "metodos_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          empresa_id: string | null
          full_name: string
          id: string
          last_sign_in: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa_id?: string | null
          full_name: string
          id: string
          last_sign_in?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa_id?: string | null
          full_name?: string
          id?: string
          last_sign_in?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          criado_em: string | null
          email: string
          id: string
          organizacao_id: string | null
          perfil: string | null
        }
        Insert: {
          criado_em?: string | null
          email: string
          id?: string
          organizacao_id?: string | null
          perfil?: string | null
        }
        Update: {
          criado_em?: string | null
          email?: string
          id?: string
          organizacao_id?: string | null
          perfil?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_exists: {
        Args: { user_id: string }
        Returns: boolean
      }
      create_company_secure: {
        Args: { company_name: string; company_cnpj?: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
