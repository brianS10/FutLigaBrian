import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { League, Team, Player, Match, LeagueStanding, TopScorer } from "@/lib/types";

// ============================================================================
// SERVICIOS DE LIGAS
// ============================================================================

export async function getLeagueById(leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", leagueId)
    .single();

  if (error) throw error;
  return data as League;
}

export async function getLeagueStandings(leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("league_standings")
    .select("*")
    .eq("league_id", leagueId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data as LeagueStanding[];
}

export async function getTopScorers(leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("top_scorers")
    .select("*")
    .eq("league_id", leagueId)
    .order("total_goals", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as TopScorer[];
}

// ============================================================================
// SERVICIOS DE EQUIPOS
// ============================================================================

export async function getTeamsByLeague(leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Team[];
}

export async function getTeamById(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  if (error) throw error;
  return data as Team;
}

// ============================================================================
// SERVICIOS DE JUGADORES
// ============================================================================

export async function getPlayersByTeam(teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .eq("status", "active")
    .order("jersey_number", { ascending: true });

  if (error) throw error;
  return data as Player[];
}

export async function getPlayersByLeague(leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("league_id", leagueId)
    .eq("status", "active")
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data as Player[];
}

export async function getPlayerById(playerId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  if (error) throw error;
  return data as Player;
}

// ============================================================================
// SERVICIOS DE PARTIDOS
// ============================================================================

export async function getMatchesByLeague(
  leagueId: string,
  status?: string,
  limit?: number
) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("matches")
    .select(
      `
      *,
      home_team:teams!home_team_id(id, name, logo_url),
      away_team:teams!away_team_id(id, name, logo_url)
    `
    )
    .eq("league_id", leagueId);

  if (status) {
    query = query.eq("status", status);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query.order("match_date", { ascending: false });

  if (error) throw error;
  return data as Match[];
}

export async function getMatchById(matchId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      home_team:teams!home_team_id(id, name, logo_url),
      away_team:teams!away_team_id(id, name, logo_url)
    `
    )
    .eq("id", matchId)
    .single();

  if (error) throw error;
  return data as Match;
}

export async function getMatchStatistics(matchId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("match_statistics")
    .select(
      `
      *,
      player:players(id, first_name, last_name, photo_url, jersey_number),
      team:teams(id, name, logo_url)
    `
    )
    .eq("match_id", matchId);

  if (error) throw error;
  return data;
}

// ============================================================================
// SERVICIOS DE ESTADÍSTICAS
// ============================================================================

export async function getPlayerStats(playerId: string, leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("match_statistics")
    .select("*")
    .eq("player_id", playerId)
    .in(
      "match_id",
      (
        await supabase
          .from("matches")
          .select("id")
          .eq("league_id", leagueId)
          .eq("status", "finished")
      ).data?.map((m: any) => m.id) || []
    );

  if (error) throw error;

  // Calcular totales
  const stats = data || [];
  return {
    totalMatches: stats.length,
    totalGoals: stats.reduce((sum: number, s: any) => sum + (s.goals || 0), 0),
    totalAssists: stats.reduce((sum: number, s: any) => sum + (s.assists || 0), 0),
    totalYellowCards: stats.reduce((sum: number, s: any) => sum + (s.yellow_cards || 0), 0),
    totalRedCards: stats.reduce((sum: number, s: any) => sum + (s.red_cards || 0), 0),
  };
}
