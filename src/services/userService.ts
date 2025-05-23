
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in?: string;
  empresa_id?: string;
}

export interface NewUser {
  email: string;
  full_name: string;
  password: string; // Added password field
  role: string;
  empresa_id?: string;
}

interface UserServiceResult {
  data: any | null;
  error: PostgrestError | Error | null;
}

const wrapResult = (data: any | null, error: PostgrestError | Error | null = null): UserServiceResult => {
  if (error) {
    console.error("User service error:", error);
  }
  return { data, error };
};

export const userService = {
  async getUsers(companyId?: string | null): Promise<User[]> {
    try {
      console.log("Fetching users for company:", companyId);
      
      if (!companyId) {
        console.warn("No company ID provided for user fetch");
        return [];
      }
      
      let query = supabase
        .from("users")
        .select("*");
        
      // Filter by company ID if provided
      if (companyId) {
        query = query.eq("empresa_id", companyId);
      }
        
      const { data, error } = await query.order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      console.log("Users fetched successfully:", data?.length || 0);
      return data || [];
    } catch (error) {
      console.error("Exception during users fetch:", error);
      return [];
    }
  },

  async getUserById(id: string): Promise<UserServiceResult> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
        
      return wrapResult(data, error);
    } catch (error) {
      return wrapResult(null, error as Error);
    }
  },

  async createUser(userData: NewUser): Promise<UserServiceResult> {
    try {
      console.log("Creating user:", userData);
      
      if (!userData.empresa_id) {
        return wrapResult(null, new Error("ID da empresa é obrigatório para criar um usuário"));
      }

      // Generate a UUID for the new user
      const id = uuidv4();

      const { data, error } = await supabase
        .from("users")
        .insert([{ ...userData, id }]) // Include the generated ID
        .select();
        
      if (error) throw error;
      
      toast.success("Usuário criado com sucesso!");
      return wrapResult(data?.[0] || null);
    } catch (error) {
      toast.error(`Erro ao criar usuário: ${(error as Error).message}`);
      return wrapResult(null, error as Error);
    }
  },

  async updateUser({ id, ...userData }: { id: string; } & Partial<User>): Promise<UserServiceResult> {
    try {
      const { data, error } = await supabase
        .from("users")        
        .update(userData)
        .eq("id", id)
        .select();
        
      if (error) throw error;
      
      return wrapResult(data?.[0] || null);
    } catch (error) {
      toast.error(`Erro ao atualizar usuário: ${(error as Error).message}`);
      return wrapResult(null, error as Error);
    }
  },

  // Added this method to specifically update a user's role
  async updateUserRole(userId: string, role: string): Promise<UserServiceResult> {
    return this.updateUser(userId, { role });
  },

  async deleteUser(id: string): Promise<UserServiceResult> {
    try {
      // Using a specific function to delete a user since it might need to
      // clean up related data or call an auth service
      const { data, error } = await supabase
        .rpc("delete_user", { user_id: id });
        
      if (error) {
        // If the RPC function doesn't exist or failed, fall back to direct delete
        console.warn("RPC delete_user failed, falling back to direct delete:", error);
        
        const deleteResult = await supabase
          .from("users")
          .delete()
          .eq("id", id);
          
        if (deleteResult.error) throw deleteResult.error;
      }
      
      toast.success("Usuário excluído com sucesso!");
      return wrapResult(true);
    } catch (error) {
      toast.error(`Erro ao excluir usuário: ${(error as Error).message}`);
      return wrapResult(null, error as Error);
    }
  },

  async getUserRole(id: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .rpc("get_user_role", { user_id: id });
        
      if (error) throw error;
      
      return data as string;
    } catch (error) {
      console.error(`Erro ao obter permissão do usuário: ${(error as Error).message}`);
      return null;
    }
  }
};
