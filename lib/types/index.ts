// Tipos principales de la aplicación

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface League {
  id: string;
  name: string;
  description: string | null;
  president_id: string;
  logo_url: string | null;
  country: string | null;
  city: string | null;
  season_year: number;
  status: "active" | "archived" | "draft";
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  league_id: string;
  name: string;
  manager_name: string | null;
  coach_email: string | null;
  logo_url: string | null;
  city: string | null;
  home_field: string | null;
  founded_year: number | null;
  status: "active" | "inactive" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  team_id: string;
  league_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  jersey_number: number | null;
  position: "GK" | "DEF" | "MID" | "FWD" | null;
  date_of_birth: string | null;
  document_id: string | null;
  photo_url: string | null;
  status: "active" | "inactive" | "injured" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  matchday: number | null;
  match_date: string;
  venue: string | null;
  home_goals: number;
  away_goals: number;
  status: "scheduled" | "live" | "finished" | "cancelled" | "postponed";
  referee_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchStatistics {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  created_at: string;
  updated_at: string;
}

export interface LeagueStanding {
  id: string;
  league_id: string;
  name: string;
  logo_url: string | null;
  played_matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  position: number;
}

export interface TopScorer {
  id: string;
  first_name: string;
  last_name: string;
  league_id: string;
  team_id: string;
  team_name: string;
  team_logo: string | null;
  photo_url: string | null;
  total_goals: number;
  total_assists: number;
  matches_played: number;
}

export interface UserRole {
  id: string;
  user_id: string;
  league_id: string;
  role: "president" | "administrator" | "team_manager" | "referee" | "viewer";
  created_at: string;
}

// Tipos de formularios
export interface CreateLeagueInput {
  name: string;
  description?: string;
  country?: string;
  city?: string;
  season_year?: number;
}

export interface CreateTeamInput {
  league_id: string;
  name: string;
  manager_name?: string;
  coach_email?: string;
  city?: string;
  home_field?: string;
  founded_year?: number;
}

export interface CreatePlayerInput {
  team_id: string;
  league_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  jersey_number?: number;
  position?: "GK" | "DEF" | "MID" | "FWD";
  date_of_birth?: string;
  document_id?: string;
}

export interface CreateMatchInput {
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  matchday?: number;
  venue?: string;
  referee_name?: string;
}

export interface UpdateMatchResultInput {
  match_id: string;
  home_goals: number;
  away_goals: number;
}

export interface RecordMatchStatisticInput {
  match_id: string;
  player_id: string;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  minutes_played?: number;
}
