// Constantes y Configuración Global
// Ubicación: lib/utils/constants.ts

// ============================================================================
// APLICACIÓN
// ============================================================================

export const APP_NAME = "FutLigam";
export const APP_DESCRIPTION =
  "Plataforma profesional para gestión de ligas de fútbol amateur";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================================================
// POSICIONES DE JUGADORES
// ============================================================================

export const PLAYER_POSITIONS = [
  { value: "GK", label: "Portero" },
  { value: "DEF", label: "Defensa" },
  { value: "MID", label: "Centrocampista" },
  { value: "FWD", label: "Delantero" },
] as const;

export const PLAYER_POSITION_LABELS: Record<string, string> = {
  GK: "Portero",
  DEF: "Defensa",
  MID: "Centrocampista",
  FWD: "Delantero",
};

// ============================================================================
// ESTADO DE JUGADORES
// ============================================================================

export const PLAYER_STATUSES = [
  { value: "active", label: "Activo", color: "green" },
  { value: "inactive", label: "Inactivo", color: "gray" },
  { value: "injured", label: "Lesionado", color: "yellow" },
  { value: "suspended", label: "Suspendido", color: "red" },
] as const;

export const PLAYER_STATUS_LABELS: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  injured: "Lesionado",
  suspended: "Suspendido",
};

// ============================================================================
// ESTADO DE PARTIDOS
// ============================================================================

export const MATCH_STATUSES = [
  { value: "scheduled", label: "Programado", color: "blue" },
  { value: "live", label: "En vivo", color: "red" },
  { value: "finished", label: "Finalizado", color: "green" },
  { value: "cancelled", label: "Cancelado", color: "gray" },
  { value: "postponed", label: "Pospuesto", color: "yellow" },
] as const;

export const MATCH_STATUS_LABELS: Record<string, string> = {
  scheduled: "Programado",
  live: "En vivo",
  finished: "Finalizado",
  cancelled: "Cancelado",
  postponed: "Pospuesto",
};

// ============================================================================
// ROLES DE USUARIO
// ============================================================================

export const USER_ROLES = [
  { value: "president", label: "Presidente", description: "Control total" },
  { value: "administrator", label: "Administrador", description: "Gestión completa" },
  { value: "team_manager", label: "Gerente de Equipo", description: "Gestión de equipo" },
  { value: "referee", label: "Árbitro", description: "Registrar partidos" },
  { value: "viewer", label: "Visor", description: "Solo lectura" },
] as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  president: "Presidente",
  administrator: "Administrador",
  team_manager: "Gerente de Equipo",
  referee: "Árbitro",
  viewer: "Visor",
};

// ============================================================================
// ESTADO DE LIGAS
// ============================================================================

export const LEAGUE_STATUSES = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activa" },
  { value: "archived", label: "Archivada" },
] as const;

export const LEAGUE_STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  active: "Activa",
  archived: "Archivada",
};

// ============================================================================
// ESTADO DE EQUIPOS
// ============================================================================

export const TEAM_STATUSES = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "archived", label: "Archivado" },
] as const;

export const TEAM_STATUS_LABELS: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  archived: "Archivado",
};

// ============================================================================
// VALIDACIONES
// ============================================================================

export const VALIDATION = {
  MIN_LEAGUE_NAME: 3,
  MAX_LEAGUE_NAME: 255,
  MIN_PASSWORD: 8,
  MAX_PASSWORD: 128,
  MIN_JERSEY: 1,
  MAX_JERSEY: 99,
  MAX_YELLOW_CARDS: 2,
  MAX_RED_CARDS: 1,
  MAX_MINUTES_PLAYED: 120,
  MIN_SEASON_YEAR: 2020,
  MAX_EMAIL_LENGTH: 255,
} as const;

// ============================================================================
// PAGINACIÓN
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  SMALL_PAGE_SIZE: 5,
  LARGE_PAGE_SIZE: 20,
  EXTRA_LARGE_PAGE_SIZE: 50,
} as const;

// ============================================================================
// COLORES
// ============================================================================

export const COLORS = {
  PRIMARY: "#22c55e", // Verde principal
  PRIMARY_DARK: "#15803d",
  PRIMARY_LIGHT: "#86efac",
  SECONDARY: "#f3f4f6",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  DANGER: "#ef4444",
  INFO: "#3b82f6",
} as const;

// ============================================================================
// RUTAS
// ============================================================================

export const ROUTES = {
  HOME: "/",
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CALLBACK: "/auth/callback",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    LEAGUES: "/dashboard/ligams",
    TEAMS: "/dashboard/equipos",
    PLAYERS: "/dashboard/jugadores",
    MATCHES: "/dashboard/partidos",
  },
  PUBLIC: {
    STANDINGS: (leagueId: string) => `/${leagueId}/standings`,
    SCORERS: (leagueId: string) => `/${leagueId}/scorers`,
    MATCHES: (leagueId: string) => `/${leagueId}/matches`,
    LEAGUE: (leagueId: string) => `/${leagueId}`,
  },
} as const;

// ============================================================================
// MENSAJES
// ============================================================================

export const MESSAGES = {
  SUCCESS: {
    CREATED: "Creado exitosamente",
    UPDATED: "Actualizado exitosamente",
    DELETED: "Eliminado exitosamente",
    SAVED: "Guardado exitosamente",
  },
  ERROR: {
    GENERIC: "Algo salió mal. Intenta de nuevo.",
    UNAUTHORIZED: "No tienes permiso para realizar esta acción.",
    NOT_FOUND: "No encontrado.",
    VALIDATION: "Por favor, verifica los datos ingresados.",
    NETWORK: "Error de conexión. Intenta de nuevo.",
  },
  CONFIRMATION: {
    DELETE_LEAGUE: "¿Estás seguro de eliminar esta liga? Esta acción no se puede deshacer.",
    DELETE_TEAM: "¿Estás seguro de eliminar este equipo?",
    DELETE_PLAYER: "¿Estás seguro de eliminar este jugador?",
    DELETE_MATCH: "¿Estás seguro de eliminar este partido?",
  },
} as const;

// ============================================================================
// TIMINGS
// ============================================================================

export const TIMINGS = {
  TOAST_DURATION: 3000, // ms
  LOADING_DELAY: 300, // ms
  ANIMATION_DURATION: 300, // ms
  DEBOUNCE: 500, // ms
} as const;

// ============================================================================
// LÍMITES
// ============================================================================

export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_DIMENSION: 2000, // px
  QUERY_TIMEOUT: 30000, // ms
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Obtener label de posición de jugador
 */
export function getPositionLabel(position: string | null): string {
  if (!position) return "Sin asignar";
  return PLAYER_POSITION_LABELS[position] || position;
}

/**
 * Obtener label de estado de jugador
 */
export function getPlayerStatusLabel(status: string): string {
  return PLAYER_STATUS_LABELS[status] || status;
}

/**
 * Obtener label de estado de partido
 */
export function getMatchStatusLabel(status: string): string {
  return MATCH_STATUS_LABELS[status] || status;
}

/**
 * Obtener label de rol de usuario
 */
export function getUserRoleLabel(role: string): string {
  return USER_ROLE_LABELS[role] || role;
}

/**
 * Obtener label de estado de liga
 */
export function getLeagueStatusLabel(status: string): string {
  return LEAGUE_STATUS_LABELS[status] || status;
}

/**
 * Obtener color para estado
 */
export function getStatusColor(
  status: string,
  type: "player" | "match" | "league" | "team" = "match"
): string {
  const statusObj =
    type === "player"
      ? PLAYER_STATUSES.find((s) => s.value === status)
      : type === "match"
        ? MATCH_STATUSES.find((s) => s.value === status)
        : type === "league"
          ? LEAGUE_STATUSES.find((s) => s.value === status)
          : TEAM_STATUSES.find((s) => s.value === status);

  return (statusObj as any)?.color || "gray";
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type PlayerPosition = (typeof PLAYER_POSITIONS)[number]["value"];
export type PlayerStatus = (typeof PLAYER_STATUSES)[number]["value"];
export type MatchStatus = (typeof MATCH_STATUSES)[number]["value"];
export type UserRole = (typeof USER_ROLES)[number]["value"];
export type LeagueStatus = (typeof LEAGUE_STATUSES)[number]["value"];
export type TeamStatus = (typeof TEAM_STATUSES)[number]["value"];
