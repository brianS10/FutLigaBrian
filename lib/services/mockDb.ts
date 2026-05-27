import type { League, Team, Player, Match, MatchStatistics, LeagueStanding, TopScorer } from "@/lib/types";

// Helper keys for localStorage
const KEYS = {
  LEAGUES: "futligam_leagues",
  TEAMS: "futligam_teams",
  PLAYERS: "futligam_players",
  MATCHES: "futligam_matches",
  STATS: "futligam_stats",
  IS_ADMIN: "futligam_is_admin",
};

// Seed Data
const seedLeagues: League[] = [
  {
    id: "l1",
    name: "Liga Amateur Metropolitana 2026",
    description: "El torneo amateur de fútbol 11 más competitivo de la ciudad.",
    president_id: "admin-id",
    logo_url: null,
    country: "México",
    city: "CDMX",
    season_year: 2026,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const seedTeams: Team[] = [
  {
    id: "t1",
    league_id: "l1",
    name: "Titanes FC",
    manager_name: "Carlos Mendoza",
    coach_email: "carlos@titanes.com",
    logo_url: null,
    city: "CDMX",
    home_field: "Estadio Aztequita",
    founded_year: 2018,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "t2",
    league_id: "l1",
    name: "Atlético San Pancho",
    manager_name: "Javier Pérez",
    coach_email: "javier@atletico.com",
    logo_url: null,
    city: "CDMX",
    home_field: "Complejo San Pancho",
    founded_year: 2015,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "t3",
    league_id: "l1",
    name: "La Furia Roja",
    manager_name: "Miguel Herrera",
    coach_email: "miguel@furia.com",
    logo_url: null,
    city: "EdoMex",
    home_field: "Campo del Valle",
    founded_year: 2020,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "t4",
    league_id: "l1",
    name: "Deportivo Unión",
    manager_name: "Luis García",
    coach_email: "luis@union.com",
    logo_url: null,
    city: "CDMX",
    home_field: "Deportivo Central",
    founded_year: 2012,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const seedPlayers: Player[] = [
  // Titanes FC
  {
    id: "p1",
    team_id: "t1",
    league_id: "l1",
    first_name: "Mateo",
    last_name: "Gómez",
    email: "mateo@titanes.com",
    phone: "555-0101",
    jersey_number: 1,
    position: "GK",
    date_of_birth: "1995-04-12",
    document_id: "ID-9504",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p2",
    team_id: "t1",
    league_id: "l1",
    first_name: "Santiago",
    last_name: "González",
    email: "santi@titanes.com",
    phone: "555-0102",
    jersey_number: 9,
    position: "FWD",
    date_of_birth: "1997-08-22",
    document_id: "ID-9708",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p3",
    team_id: "t1",
    league_id: "l1",
    first_name: "Diego",
    last_name: "Hernández",
    email: "diego@titanes.com",
    phone: "555-0103",
    jersey_number: 10,
    position: "MID",
    date_of_birth: "1996-11-05",
    document_id: "ID-9611",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p4",
    team_id: "t1",
    league_id: "l1",
    first_name: "Sebastián",
    last_name: "Rodríguez",
    email: "sebas@titanes.com",
    phone: "555-0104",
    jersey_number: 4,
    position: "DEF",
    date_of_birth: "1994-01-30",
    document_id: "ID-9401",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Atlético San Pancho
  {
    id: "p5",
    team_id: "t2",
    league_id: "l1",
    first_name: "Javier",
    last_name: "López",
    email: "javi@sanpancho.com",
    phone: "555-0201",
    jersey_number: 12,
    position: "GK",
    date_of_birth: "1993-02-15",
    document_id: "ID-9302",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p6",
    team_id: "t2",
    league_id: "l1",
    first_name: "Nicolás",
    last_name: "Martínez",
    email: "nico@sanpancho.com",
    phone: "555-0202",
    jersey_number: 11,
    position: "FWD",
    date_of_birth: "1998-05-18",
    document_id: "ID-9805",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p7",
    team_id: "t2",
    league_id: "l1",
    first_name: "Lucas",
    last_name: "Sánchez",
    email: "lucas@sanpancho.com",
    phone: "555-0203",
    jersey_number: 8,
    position: "MID",
    date_of_birth: "1996-09-09",
    document_id: "ID-9609",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p8",
    team_id: "t2",
    league_id: "l1",
    first_name: "Matías",
    last_name: "Romero",
    email: "matias@sanpancho.com",
    phone: "555-0204",
    jersey_number: 2,
    position: "DEF",
    date_of_birth: "1995-12-12",
    document_id: "ID-9512",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // La Furia Roja
  {
    id: "p9",
    team_id: "t3",
    league_id: "l1",
    first_name: "Enzo",
    last_name: "Pérez",
    email: "enzo@furiaroja.com",
    phone: "555-0301",
    jersey_number: 7,
    position: "FWD",
    date_of_birth: "1996-03-22",
    document_id: "ID-9603",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p10",
    team_id: "t3",
    league_id: "l1",
    first_name: "Joaquín",
    last_name: "Álvarez",
    email: "joaco@furiaroja.com",
    phone: "555-0302",
    jersey_number: 14,
    position: "MID",
    date_of_birth: "1999-10-10",
    document_id: "ID-9910",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Deportivo Unión
  {
    id: "p11",
    team_id: "t4",
    league_id: "l1",
    first_name: "Benjamín",
    last_name: "Flores",
    email: "benja@depunion.com",
    phone: "555-0401",
    jersey_number: 19,
    position: "FWD",
    date_of_birth: "1994-07-15",
    document_id: "ID-9407",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p12",
    team_id: "t4",
    league_id: "l1",
    first_name: "Tomás",
    last_name: "Torres",
    email: "tomas@depunion.com",
    phone: "555-0402",
    jersey_number: 22,
    position: "MID",
    date_of_birth: "1997-03-03",
    document_id: "ID-9703",
    photo_url: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const seedMatches: Match[] = [
  {
    id: "m1",
    league_id: "l1",
    home_team_id: "t1",
    away_team_id: "t2",
    matchday: 1,
    match_date: "2026-05-10T16:00:00.000Z",
    venue: "Estadio Aztequita",
    home_goals: 3,
    away_goals: 2,
    status: "finished",
    referee_name: "Arturo Brizio",
    notes: "Partidazo inaugural con muchos goles y emociones.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m2",
    league_id: "l1",
    home_team_id: "t3",
    away_team_id: "t4",
    matchday: 1,
    match_date: "2026-05-12T18:00:00.000Z",
    venue: "Campo del Valle",
    home_goals: 1,
    away_goals: 1,
    status: "finished",
    referee_name: "Marco A. Rodríguez",
    notes: "Empate aguerrido bajo la lluvia.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m3",
    league_id: "l1",
    home_team_id: "t1",
    away_team_id: "t3",
    matchday: 2,
    match_date: "2026-05-18T16:00:00.000Z",
    venue: "Estadio Aztequita",
    home_goals: 2,
    away_goals: 0,
    status: "finished",
    referee_name: "Felipe Ramos Rizo",
    notes: "Titanes FC mantiene el invicto.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m4",
    league_id: "l1",
    home_team_id: "t2",
    away_team_id: "t4",
    matchday: 2,
    match_date: "2026-05-20T20:00:00.000Z",
    venue: "Complejo San Pancho",
    home_goals: 0,
    away_goals: 3,
    status: "finished",
    referee_name: "Arturo Brizio",
    notes: "Deportivo Unión domina de visitante.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m5",
    league_id: "l1",
    home_team_id: "t4",
    away_team_id: "t1",
    matchday: 3,
    match_date: "2026-06-02T16:00:00.000Z",
    venue: "Deportivo Central",
    home_goals: 0,
    away_goals: 0,
    status: "scheduled",
    referee_name: "César Arturo Ramos",
    notes: "Duelo directo por la cima de la clasificación.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m6",
    league_id: "l1",
    home_team_id: "t2",
    away_team_id: "t3",
    matchday: 3,
    match_date: "2026-06-03T18:00:00.000Z",
    venue: "Complejo San Pancho",
    home_goals: 0,
    away_goals: 0,
    status: "scheduled",
    referee_name: "Marco A. Rodríguez",
    notes: "Ambos equipos buscan su primera victoria.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const seedStats: MatchStatistics[] = [
  // Partido 1: Titanes FC 3 - 2 Atlético San Pancho
  // Goles Titanes: Santiago González x2, Diego Hernández x1
  {
    id: "s1",
    match_id: "m1",
    player_id: "p2", // Santiago
    team_id: "t1",
    goals: 2,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "s2",
    match_id: "m1",
    player_id: "p3", // Diego
    team_id: "t1",
    goals: 1,
    assists: 2,
    yellow_cards: 1,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Goles San Pancho: Nicolás Martínez x2. Asistencias: Lucas Sánchez x1
  {
    id: "s3",
    match_id: "m1",
    player_id: "p6", // Nico
    team_id: "t2",
    goals: 2,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "s4",
    match_id: "m1",
    player_id: "p7", // Lucas
    team_id: "t2",
    goals: 0,
    assists: 1,
    yellow_cards: 1,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Partido 2: La Furia Roja 1 - 1 Deportivo Unión
  // Gol Furia Roja: Enzo Pérez
  {
    id: "s5",
    match_id: "m2",
    player_id: "p9", // Enzo
    team_id: "t3",
    goals: 1,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Gol Unión: Benjamín Flores
  {
    id: "s6",
    match_id: "m2",
    player_id: "p11", // Benja
    team_id: "t4",
    goals: 1,
    assists: 0,
    yellow_cards: 1,
    red_cards: 0,
    minutes_played: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Partido 3: Titanes FC 2 - 0 La Furia Roja
  // Goles Titanes: Santiago González x1, Sebastián Rodríguez x1. Asistencia: Diego Hernández x1
  {
    id: "s7",
    match_id: "m3",
    player_id: "p2", // Santiago
    team_id: "t1",
    goals: 1,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "s8",
    match_id: "m3",
    player_id: "p4", // Sebas
    team_id: "t1",
    goals: 1,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "s9",
    match_id: "m3",
    player_id: "p3", // Diego
    team_id: "t1",
    goals: 0,
    assists: 1,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Partido 4: Atlético San Pancho 0 - 3 Deportivo Unión
  // Goles Unión: Benjamín Flores x2, Tomás Torres x1. Asistencias: Benjamín Flores x1, Tomás Torres x1
  {
    id: "s10",
    match_id: "m4",
    player_id: "p11", // Benja
    team_id: "t4",
    goals: 2,
    assists: 1,
    yellow_cards: 0,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "s11",
    match_id: "m4",
    player_id: "p12", // Tomás
    team_id: "t4",
    goals: 1,
    assists: 1,
    yellow_cards: 1,
    red_cards: 0,
    minutes_played: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to get from local storage or fallback to seeds
const getStore = <T>(key: string, initial: T[]): T[] => {
  if (typeof window === "undefined") return initial;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw);
};

const setStore = <T>(key: string, value: T[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const mockDb = {
  // Authentication
  isAdmin: (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEYS.IS_ADMIN) === "true";
  },
  setAdmin: (status: boolean) => {
    if (typeof window === "undefined") return;
    if (status) {
      localStorage.setItem(KEYS.IS_ADMIN, "true");
      // Set simple cookie so middleware or other files can read it if needed
      document.cookie = "is_admin=true; path=/";
    } else {
      localStorage.removeItem(KEYS.IS_ADMIN);
      document.cookie = "is_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  // Leagues
  getLeagues: (): League[] => getStore(KEYS.LEAGUES, seedLeagues),
  saveLeague: (league: League): League => {
    const list = mockDb.getLeagues();
    const idx = list.findIndex((l) => l.id === league.id);
    if (idx >= 0) {
      list[idx] = { ...league, updated_at: new Date().toISOString() };
    } else {
      list.push({ ...league, id: league.id || Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    setStore(KEYS.LEAGUES, list);
    return idx >= 0 ? list[idx] : list[list.length - 1];
  },

  // Teams
  getTeams: (): Team[] => getStore(KEYS.TEAMS, seedTeams),
  saveTeam: (team: Partial<Team> & { league_id: string }): Team => {
    const list = mockDb.getTeams();
    const idx = team.id ? list.findIndex((t) => t.id === team.id) : -1;
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...team, updated_at: new Date().toISOString() } as Team;
    } else {
      const newTeam: Team = {
        id: "t_" + Math.random().toString(36).substr(2, 9),
        league_id: team.league_id,
        name: team.name || "Equipo Nuevo",
        manager_name: team.manager_name || null,
        coach_email: team.coach_email || null,
        logo_url: team.logo_url || null,
        city: team.city || null,
        home_field: team.home_field || null,
        founded_year: team.founded_year || null,
        status: team.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      list.push(newTeam);
    }
    setStore(KEYS.TEAMS, list);
    return idx >= 0 ? list[idx] : list[list.length - 1];
  },
  deleteTeam: (id: string) => {
    const list = mockDb.getTeams().filter((t) => t.id !== id);
    setStore(KEYS.TEAMS, list);
  },

  // Players
  getPlayers: (): Player[] => getStore(KEYS.PLAYERS, seedPlayers),
  savePlayer: (player: Partial<Player> & { team_id: string; league_id: string }): Player => {
    const list = mockDb.getPlayers();
    const idx = player.id ? list.findIndex((p) => p.id === player.id) : -1;
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...player, updated_at: new Date().toISOString() } as Player;
    } else {
      const newPlayer: Player = {
        id: "p_" + Math.random().toString(36).substr(2, 9),
        team_id: player.team_id,
        league_id: player.league_id,
        first_name: player.first_name || "Nombre",
        last_name: player.last_name || "Apellido",
        email: player.email || null,
        phone: player.phone || null,
        jersey_number: player.jersey_number || null,
        position: player.position || null,
        date_of_birth: player.date_of_birth || null,
        document_id: player.document_id || null,
        photo_url: player.photo_url || null,
        status: player.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      list.push(newPlayer);
    }
    setStore(KEYS.PLAYERS, list);
    return idx >= 0 ? list[idx] : list[list.length - 1];
  },
  deletePlayer: (id: string) => {
    const list = mockDb.getPlayers().filter((p) => p.id !== id);
    setStore(KEYS.PLAYERS, list);
  },

  // Matches
  getMatches: (): Match[] => getStore(KEYS.MATCHES, seedMatches),
  saveMatch: (match: Partial<Match> & { league_id: string; home_team_id: string; away_team_id: string }): Match => {
    const list = mockDb.getMatches();
    const idx = match.id ? list.findIndex((m) => m.id === match.id) : -1;
    let savedMatch: Match;
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...match, updated_at: new Date().toISOString() } as Match;
      savedMatch = list[idx];
    } else {
      const newMatch: Match = {
        id: "m_" + Math.random().toString(36).substr(2, 9),
        league_id: match.league_id,
        home_team_id: match.home_team_id,
        away_team_id: match.away_team_id,
        matchday: match.matchday || 1,
        match_date: match.match_date || new Date().toISOString(),
        venue: match.venue || null,
        home_goals: match.home_goals || 0,
        away_goals: match.away_goals || 0,
        status: match.status || "scheduled",
        referee_name: match.referee_name || null,
        notes: match.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      list.push(newMatch);
      savedMatch = newMatch;
    }
    setStore(KEYS.MATCHES, list);
    return savedMatch;
  },
  deleteMatch: (id: string) => {
    const list = mockDb.getMatches().filter((m) => m.id !== id);
    setStore(KEYS.MATCHES, list);
    // Also delete associated statistics
    const statsList = mockDb.getMatchStatistics().filter((s) => s.match_id !== id);
    setStore(KEYS.STATS, statsList);
  },

  // Match Statistics
  getMatchStatistics: (): MatchStatistics[] => getStore(KEYS.STATS, seedStats),
  saveMatchStatistics: (matchId: string, stats: Partial<MatchStatistics>[]): MatchStatistics[] => {
    let list = mockDb.getMatchStatistics();
    // Filter out old stats for this match first
    list = list.filter((s) => s.match_id !== matchId);

    // Save new statistics
    const processedStats = stats.map((stat) => {
      return {
        id: stat.id || "s_" + Math.random().toString(36).substr(2, 9),
        match_id: matchId,
        player_id: stat.player_id!,
        team_id: stat.team_id!,
        goals: stat.goals || 0,
        assists: stat.assists || 0,
        yellow_cards: stat.yellow_cards || 0,
        red_cards: stat.red_cards || 0,
        minutes_played: stat.minutes_played || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    list.push(...processedStats);
    setStore(KEYS.STATS, list);
    return processedStats;
  },

  // Recalculates and returns Standings
  getStandings: (leagueId: string): LeagueStanding[] => {
    const teams = mockDb.getTeams().filter((t) => t.league_id === leagueId && t.status === "active");
    const matches = mockDb.getMatches().filter((m) => m.league_id === leagueId && m.status === "finished");

    const standingsMap = new Map<string, Omit<LeagueStanding, "position">>();

    // Initialize all teams in standings
    teams.forEach((t) => {
      standingsMap.set(t.id, {
        id: t.id,
        league_id: leagueId,
        name: t.name,
        logo_url: t.logo_url,
        played_matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0,
      });
    });

    // Accumulate match results
    matches.forEach((m) => {
      const home = standingsMap.get(m.home_team_id);
      const away = standingsMap.get(m.away_team_id);

      if (home && away) {
        home.played_matches += 1;
        away.played_matches += 1;

        home.goals_for += m.home_goals;
        home.goals_against += m.away_goals;
        away.goals_for += m.away_goals;
        away.goals_against += m.home_goals;

        home.goal_difference = home.goals_for - home.goals_against;
        away.goal_difference = away.goals_for - away.goals_against;

        if (m.home_goals > m.away_goals) {
          home.wins += 1;
          home.points += 3;
          away.losses += 1;
        } else if (m.home_goals < m.away_goals) {
          away.wins += 1;
          away.points += 3;
          home.losses += 1;
        } else {
          home.draws += 1;
          home.points += 1;
          away.draws += 1;
          away.points += 1;
        }
      }
    });

    // Convert map to array and sort
    const standings = Array.from(standingsMap.values()).map((s) => ({
      ...s,
    }));

    // Sort by: Points (desc) -> Goal Difference (desc) -> Goals For (desc) -> Alphabetical
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
      return a.name.localeCompare(b.name);
    });

    // Add position 1-indexed
    return standings.map((s, idx) => ({
      ...s,
      position: idx + 1,
    })) as LeagueStanding[];
  },

  // Recalculates and returns Top Scorers list
  getTopScorers: (leagueId: string): TopScorer[] => {
    const players = mockDb.getPlayers().filter((p) => p.league_id === leagueId);
    const teams = mockDb.getTeams();
    const stats = mockDb.getMatchStatistics();
    const finishedMatches = mockDb.getMatches().filter(m => m.status === "finished").map(m => m.id);

    const scorersMap = new Map<string, { goals: number; assists: number; matchesCount: Set<string> }>();

    // Accumulate player statistics from finished matches only
    stats.forEach((s) => {
      if (!finishedMatches.includes(s.match_id)) return;
      if (!scorersMap.has(s.player_id)) {
        scorersMap.set(s.player_id, { goals: 0, assists: 0, matchesCount: new Set() });
      }
      const pStat = scorersMap.get(s.player_id)!;
      pStat.goals += s.goals;
      pStat.assists += s.assists;
      pStat.matchesCount.add(s.match_id);
    });

    const topScorers: TopScorer[] = [];

    players.forEach((p) => {
      const pStat = scorersMap.get(p.id) || { goals: 0, assists: 0, matchesCount: new Set() };
      const team = teams.find((t) => t.id === p.team_id);

      if (pStat.goals > 0 || pStat.assists > 0) {
        topScorers.push({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          league_id: leagueId,
          team_id: p.team_id,
          team_name: team ? team.name : "Equipo Desconocido",
          team_logo: team ? team.logo_url : null,
          photo_url: p.photo_url,
          total_goals: pStat.goals,
          total_assists: pStat.assists,
          matches_played: pStat.matchesCount.size,
        });
      }
    });

    // Sort by: Goals (desc) -> Assists (desc) -> Matches Played (asc) -> Last Name
    return topScorers.sort((a, b) => {
      if (b.total_goals !== a.total_goals) return b.total_goals - a.total_goals;
      if (b.total_assists !== a.total_assists) return b.total_assists - a.total_assists;
      if (a.matches_played !== b.matches_played) return a.matches_played - b.matches_played;
      return a.last_name.localeCompare(b.last_name);
    });
  },
};
