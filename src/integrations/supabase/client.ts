// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bbycupryykhnztrlelmn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWN1cHJ5eWtobnp0cmxlbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODI0NjgsImV4cCI6MjA2NDI1ODQ2OH0.D9XcjUbzHbCIidHFZsP0KG-LR-tf4LNULncRevJD44Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);