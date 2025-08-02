import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tdanvyvyjoypuqunylzk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkYW52eXZ5am95cHVxdW55bHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDkxNzYsImV4cCI6MjA1MzkyNTE3Nn0.lnBBOJCXJwJJLb4Oy0Qd8Ey8q0Oc8_bFBGGQXwKvqJQ';

export const supabase = createClient(supabaseUrl, supabaseKey);