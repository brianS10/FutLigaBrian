"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { League } from "@/lib/types";

export const useLeague = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchLeagues = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("leagues")
        .select("*")
        .eq("president_id", user.id);

      if (error) throw error;
      setLeagues(data || []);
      return { success: true, data: data || [] };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch leagues");
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createLeague = useCallback(
    async (leagueData: Partial<League>) => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("leagues")
          .insert([{ ...leagueData, president_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        setLeagues([...leagues, data]);
        return { success: true, data };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create league");
        setError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [supabase, leagues]
  );

  const updateLeague = useCallback(
    async (id: string, updates: Partial<League>) => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("leagues")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        setLeagues(leagues.map((l) => (l.id === id ? data : l)));
        return { success: true, data };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to update league");
        setError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [supabase, leagues]
  );

  const deleteLeague = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const { error } = await supabase.from("leagues").delete().eq("id", id);

        if (error) throw error;
        setLeagues(leagues.filter((l) => l.id !== id));
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to delete league");
        setError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [supabase, leagues]
  );

  return {
    leagues,
    loading,
    error,
    fetchLeagues,
    createLeague,
    updateLeague,
    deleteLeague,
  };
};
