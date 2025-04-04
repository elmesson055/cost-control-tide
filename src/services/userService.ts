
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string | null;
  last_sign_in: string | null;
  empresa_id?: string;
}

export interface NewUser {
  email: string;
  full_name: string;
  password: string;
  role: string;
  empresa_id?: string;
}

// Function to get all users for a specific company
const getUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }

  return users || [];
};

// Function to get a single user by ID
const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw new Error(error.message);
  }

  return data;
};

// Function to create a new user
const createUser = async (newUser: NewUser): Promise<User> => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Falha ao criar usuário de autenticação');
    }

    const userId = authData.user.id;

    // Then, create the user record in the users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        empresa_id: newUser.empresa_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user record:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in createUser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(errorMessage);
  }
};

// Function to update a user's role
const updateUserRole = async (userId: string, role: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    throw new Error(error.message);
  }
};

// Function to delete a user
const deleteUser = async (userId: string): Promise<void> => {
  try {
    // First, delete the user record from the users table
    const { error: recordError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (recordError) {
      console.error('Error deleting user record:', recordError);
      throw new Error(recordError.message);
    }

    // Then, delete the auth user
    // Using the correct RPC function name "delete_user"
    const { error: authError } = await supabase.rpc('delete_user', {
      user_id: userId
    });

    if (authError) {
      console.error('Error deleting auth user:', authError);
      throw new Error(authError.message);
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(errorMessage);
  }
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
};
