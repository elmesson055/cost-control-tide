
import { createClient } from '@supabase/supabase-js';

// Use the direct values provided by the user
const supabaseUrl = "https://vzpulsezwlzcitqzbmcm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cHVsc2V6d2x6Y2l0cXpibWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzEyMTcsImV4cCI6MjA1OTAwNzIxN30.m5BeFnj030m8rFbraP4XZfCJy4KZUIzw_6Vyo9IAWC0";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Log initialization status
console.log('Supabase client initialized with URL:', supabaseUrl);
