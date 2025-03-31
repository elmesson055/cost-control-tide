
import { supabase } from "../lib/supabase/client";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in: string | null;
}

export interface NewUser {
  email: string;
  full_name: string;
  role: string;
  password: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception when fetching users:', err);
      return [];
    }
  },
  
  async createUser(userData: NewUser): Promise<User | null> {
    try {
      // First register the user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) {
        console.error('Error creating user auth:', authError);
        throw authError;
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
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user record:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Exception when creating user:', err);
      throw err;
    }
  },
  
  async deleteUser(userId: string): Promise<void> {
    try {
      // Remove from users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (userError) {
        console.error('Error deleting user record:', userError);
        throw userError;
      }
      
      // For auth deletion, this typically requires admin privileges
      // and might need to be done via a Supabase function
      const { error: authError } = await supabase.rpc('delete_user', {
        user_id: userId
      });
      
      if (authError) {
        console.error('Error deleting user auth:', authError);
        throw authError;
      }
    } catch (err) {
      console.error('Exception when deleting user:', err);
      throw err;
    }
  },
  
  async updateUserRole(userId: string, role: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Exception when updating user role:', err);
      throw err;
    }
  }
};
