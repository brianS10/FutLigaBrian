import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

// Cliente para el navegador (Client Component) - Libre de importaciones del servidor como next/headers
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
};
