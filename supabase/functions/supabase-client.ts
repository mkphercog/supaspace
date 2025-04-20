import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VITE_SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const VITE_SUPABASE_SERVICE_ROLE = Deno.env.get("VITE_SUPABASE_SERVICE_ROLE")!;
export const supabase = createClient(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_SERVICE_ROLE,
);
