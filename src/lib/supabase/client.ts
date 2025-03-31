
import { createClient } from '@supabase/supabase-js';

// Use default values if environment variables are not set
// In a real app, these should be set in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Console log to help with debugging
console.log('Supabase client initialized with URL:', supabaseUrl);
