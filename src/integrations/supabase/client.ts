// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vzpulsezwlzcitqzbmcm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cHVsc2V6d2x6Y2l0cXpibWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzEyMTcsImV4cCI6MjA1OTAwNzIxN30.m5BeFnj030m8rFbraP4XZfCJy4KZUIzw_6Vyo9IAWC0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);