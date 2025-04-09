import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;
      
      // Get additional user data from your users table
      const { data, error } = await supabase
        .from("users")
        .select("id, email, full_name, role")
        .eq("id", session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user data:", error);
        return {
          id: session.user.id,
          email: session.user.email || "",
        };
      }
      
      return data as AuthUser;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },
  
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.message || "Erro ao fazer login" 
      };
    }
  },
  
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(`Erro ao fazer logout: ${error.message}`);
      return { success: false, error: error.message };
    }
  },
  
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
};