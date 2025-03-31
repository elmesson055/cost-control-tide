
import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate required parameters
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client
export const supabase = createClient(
  // Use placeholder values for development to prevent immediate errors
  // This allows the app to at least load, even if Supabase operations will fail
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Log initialization status
console.log('Supabase client initialized with URL:', 
  supabaseUrl ? supabaseUrl : 'MISSING - Please set VITE_SUPABASE_URL environment variable');
