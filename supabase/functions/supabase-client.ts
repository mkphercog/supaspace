import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VITE_SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
export const supabase = createClient(
  VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);
