
import { supabase } from "../integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  empresa_id: string | null;
  created_at: string;
  last_sign_in: string | null;
}

export interface NewUser {
  email: string;
  full_name: string;
  role: string;
  password: string;
  empresa_id?: string | null;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      console.log("Attempting to fetch users from Supabase");
      
      // Obter a empresa atual do localStorage
      const currentCompanyId = localStorage.getItem('currentCompanyId');
      
      // Garantir que estamos filtrando por empresa_id
      const query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Se tivermos uma empresa selecionada, filtramos por ela
      if (currentCompanyId) {
        query.eq('empresa_id', currentCompanyId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching users:', error);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception when fetching users:', err);
      throw err; // Propagate error to be handled by React Query
    }
  },
  
  async createUser(userData: NewUser): Promise<User | null> {
    try {
      console.log("Attempting to create user with email:", userData.email);
      
      // Obter a empresa atual do localStorage se não foi fornecido
      if (!userData.empresa_id) {
        userData.empresa_id = localStorage.getItem('currentCompanyId');
      }
      
      // First register the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) {
        console.error('Error creating user auth:', authError);
        throw new Error(`Auth error: ${authError.message}`);
      }
      
      if (!authData.user?.id) {
        console.error('No user ID returned from auth signup');
        throw new Error('Failed to create user authentication');
      }
      
      // Then add the user to our users table with additional info
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          empresa_id: userData.empresa_id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user record:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      return data;
    } catch (err) {
      console.error('Exception when creating user:', err);
      throw err; // Propagate the error
    }
  },
  
  async deleteUser(userId: string): Promise<void> {
    try {
      console.log("Attempting to delete user with ID:", userId);
      
      // Remove from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (userError) {
        console.error('Error deleting user record:', userError);
        throw new Error(`Database error: ${userError.message}`);
      }
      
      // For auth deletion, this typically requires admin privileges
      // and might need to be done via a Supabase function
      const { error: authError } = await supabase.rpc('delete_user', {
        user_id: userId
      });
      
      if (authError) {
        console.error('Error deleting user auth:', authError);
        throw new Error(`Auth deletion error: ${authError.message}`);
      }
    } catch (err) {
      console.error('Exception when deleting user:', err);
      throw err; // Propagate the error
    }
  },
  
  async updateUserRole(userId: string, role: string): Promise<User | null> {
    try {
      console.log("Attempting to update role for user ID:", userId);
      
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user role:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      return data;
    } catch (err) {
      console.error('Exception when updating user role:', err);
      throw err; // Propagate the error
    }
  }
};
