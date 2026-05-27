"use client";

import { useCallback, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { mockDb } from "@/lib/services/mockDb";
import type { User } from "@/lib/types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize from mockDb
  useEffect(() => {
    if (mockDb.isAdmin()) {
      setUser({
        id: "admin-id",
        email: "admin@futligam.com",
        user_metadata: { full_name: "Administrador de la Liga" },
      });
    } else {
      // Try to check Supabase session if environment variables are set
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient();
          supabase.auth.getUser().then(({ data: { user: sbUser } }: any) => {
            if (sbUser) {
              setUser({
                id: sbUser.id,
                email: sbUser.email || "",
                user_metadata: sbUser.user_metadata,
              });
            }
          }).catch(() => {});
        }
      } catch (e) {
        console.warn("Supabase clients failed to load. Operating in local mode.");
      }
    }
    setLoading(false);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, metadata?: Record<string, any>) => {
      try {
        setLoading(true);
        // Simple bypass for demo
        if (email === "admin" || email === "admin@futligam.com") {
          throw new Error("El email de administrador demo ya está registrado.");
        }

        // Try Supabase if configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient();
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata },
          });
          if (error) throw error;
          return { success: true };
        } else {
          // Local demo success
          return { success: true, message: "Cuenta de demo creada localmente (sin persistencia en servidor)" };
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Sign up failed");
        setError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        
        // Demo login credentials
        if (email === "admin" && password === "admin") {
          mockDb.setAdmin(true);
          const adminUser: User = {
            id: "admin-id",
            email: "admin@futligam.com",
            user_metadata: { full_name: "Administrador de la Liga" },
          };
          setUser(adminUser);
          return { success: true };
        }

        // Try Supabase if configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient();
          const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email || "",
              user_metadata: data.user.user_metadata,
            });
          }
          return { success: true };
        } else {
          throw new Error("Credenciales inválidas. Usa 'admin' / 'admin' para iniciar sesión en la demo.");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Sign in failed");
        setError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      mockDb.setAdmin(false);
      setUser(null);

      // Try Supabase signout if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign out failed");
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
};

