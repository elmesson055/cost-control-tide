
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

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
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
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
      // Here we would normally have a sign-up flow
      // For demo purposes, we're just adding to the users table
      const { data, error } = await supabase
        .from("users")
        .insert([userData])
        .select();
        
      if (error) throw error;
      
      toast.success("Usuário criado com sucesso!");
      return wrapResult(data?.[0] || null);
    } catch (error) {
      toast.error(`Erro ao criar usuário: ${(error as Error).message}`);
      return wrapResult(null, error as Error);
    }
  },

  async updateUser(id: string, userData: Partial<User>): Promise<UserServiceResult> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", id)
        .select();
        
      if (error) throw error;
      
      toast.success("Usuário atualizado com sucesso!");
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
