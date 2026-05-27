import { createServerClient, CookieOptions } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Cliente para el servidor (Server Component / Route Handlers)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Manejar errores de cookies en Server Components de sólo lectura
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // Manejar errores de cookies en Server Components de sólo lectura
          }
        },
      },
    }
  );
};
