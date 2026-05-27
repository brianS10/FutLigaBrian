"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockDb } from "@/lib/services/mockDb";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Team, Player, Match, MatchStatistics } from "@/lib/types";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import {
  LayoutDashboard, Users, Calendar, BarChart2,
  Plus, Edit, Trash2, Save, X, Search, ChevronRight,
  TrendingUp, Zap, Shield, Target
} from "lucide-react";

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  cream: "#FFFACA",
  green: "#004f39",
  greenLight: "#006b4e",
  dark: "#151613",
  dark2: "#1a1c18",
  dark3: "#1e2019",
  border: "rgba(255,250,202,0.08)",
  borderStrong: "rgba(255,250,202,0.14)",
  textMuted: "rgba(255,250,202,0.45)",
  textSoft: "rgba(255,250,202,0.7)",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl py-2.5 px-4 text-sm outline-none transition-all duration-200";
const inputStyle = {
  background: "rgba(21,22,19,0.8)",
  border: `1.5px solid ${C.border}`,
  color: C.cream,
};

function Inp(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${inputCls} ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => {
        e.currentTarget.style.border = `1.5px solid ${C.green}`;
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,79,57,0.2)`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.border = `1.5px solid ${C.border}`;
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}

function Sel(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputCls} ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
    />
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-xs font-bold mb-1.5 uppercase tracking-wide"
      style={{ color: C.textMuted }}
    >
      {children}
    </label>
  );
}

function BtnPrimary({
  children,
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 hover:opacity-90 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
        color: C.cream,
        boxShadow: "0 4px 16px rgba(0,79,57,0.35)",
      }}
    >
      {children}
    </button>
  );
}

function BtnSecondary({
  children,
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${className}`}
      style={{
        background: "rgba(255,250,202,0.06)",
        border: `1px solid ${C.border}`,
        color: C.textSoft,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.06)")}
    >
      {children}
    </button>
  );
}

function posBadge(pos: string | null) {
  const map: Record<string, { bg: string; color: string }> = {
    GK:  { bg: "rgba(59,130,246,0.2)", color: "#93c5fd" },
    DEF: { bg: "rgba(234,179,8,0.18)", color: "#fde047" },
    MID: { bg: "rgba(168,85,247,0.18)", color: "#d8b4fe" },
    FWD: { bg: "rgba(239,68,68,0.18)", color: "#fca5a5" },
  };
  const s = map[pos ?? ""] ?? { bg: "rgba(255,250,202,0.1)", color: C.cream };
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase"
      style={{ background: s.bg, color: s.color }}
    >
      {pos ?? "–"}
    </span>
  );
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    finished:  { bg: "rgba(0,79,57,0.25)",    color: "#6ee7b7", label: "Finalizado" },
    scheduled: { bg: "rgba(255,250,202,0.1)", color: "#FFFACA", label: "Programado" },
    live:      { bg: "rgba(239,68,68,0.2)",   color: "#fca5a5", label: "En Vivo" },
    cancelled: { bg: "rgba(100,100,100,0.2)", color: "#9ca3af", label: "Cancelado" },
    postponed: { bg: "rgba(234,179,8,0.18)",  color: "#fde047", label: "Pospuesto" },
  };
  const s = map[status] ?? { bg: "rgba(255,250,202,0.07)", color: C.textMuted, label: status };
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

// ─── Form overlay wrapper ─────────────────────────────────────────────────────
function FormCard({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
      style={{
        background: C.dark2,
        border: `1px solid ${C.borderStrong}`,
      }}
    >
      <div
        className="flex justify-between items-center pb-4 border-b"
        style={{ borderColor: C.border }}
      >
        <h4 className="font-extrabold text-base" style={{ color: C.cream }}>
          {title}
        </h4>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 transition-colors"
          style={{ color: C.textMuted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
type ActiveTab = "overview" | "teams" | "players" | "matches" | "stats";

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const { loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // Database lists
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<MatchStatistics[]>([]);

  // Filtering
  const [playerTeamFilter, setPlayerTeamFilter] = useState<string>("all");
  const [playerSearchQuery, setPlayerSearchQuery] = useState<string>("");

  // CRUD — TEAM
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamManager, setTeamManager] = useState("");
  const [teamEmail, setTeamEmail] = useState("");
  const [teamField, setTeamField] = useState("");
  const [teamCity, setTeamCity] = useState("");
  const [teamFounded, setTeamFounded] = useState<number>(2026);

  // CRUD — PLAYER
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerFirstName, setPlayerFirstName] = useState("");
  const [playerLastName, setPlayerLastName] = useState("");
  const [playerTeamId, setPlayerTeamId] = useState("");
  const [playerJersey, setPlayerJersey] = useState<number>(10);
  const [playerPosition, setPlayerPosition] = useState<"GK" | "DEF" | "MID" | "FWD">("MID");
  const [playerDob, setPlayerDob] = useState("2000-01-01");
  const [playerDocId, setPlayerDocId] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");

  // CRUD — MATCH
  const [matchFormOpen, setMatchFormOpen] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [matchHomeId, setMatchHomeId] = useState("");
  const [matchAwayId, setMatchAwayId] = useState("");
  const [matchDate, setMatchDate] = useState("2026-06-01T16:00");
  const [matchday, setMatchday] = useState<number>(1);
  const [matchVenue, setMatchVenue] = useState("");
  const [matchReferee, setMatchReferee] = useState("");
  const [matchNotes, setMatchNotes] = useState("");
  const [matchHomeGoals, setMatchHomeGoals] = useState<number>(0);
  const [matchAwayGoals, setMatchAwayGoals] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<"scheduled" | "live" | "finished" | "cancelled" | "postponed">("scheduled");

  // Stats
  const [selectedMatchForStats, setSelectedMatchForStats] = useState<string>("");
  const [statsMap, setStatsMap] = useState<Record<string, { goals: number; assists: number; yellow: number; red: number }>>({});

  const leagueId = "l1";

  useEffect(() => {
    if (!authLoading) {
      if (!mockDb.isAdmin()) {
        router.push("/auth/signin");
      } else {
        loadData();
      }
    }
  }, [authLoading, router]);

  const loadData = () => {
    setTeams(mockDb.getTeams());
    setPlayers(mockDb.getPlayers());
    setMatches(mockDb.getMatches());
    setStats(mockDb.getMatchStatistics());
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  // ── Teams CRUD ──────────────────────────────────────────────────────────────
  const handleOpenCreateTeam = () => {
    setEditingTeamId(null);
    setTeamName(""); setTeamManager(""); setTeamEmail("");
    setTeamField(""); setTeamCity("CDMX"); setTeamFounded(2026);
    setTeamFormOpen(true);
  };

  const handleOpenEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setTeamName(team.name);
    setTeamManager(team.manager_name || "");
    setTeamEmail(team.coach_email || "");
    setTeamField(team.home_field || "");
    setTeamCity(team.city || "");
    setTeamFounded(team.founded_year || 2026);
    setTeamFormOpen(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    mockDb.saveTeam({
      id: editingTeamId || undefined,
      league_id: leagueId,
      name: teamName.trim(),
      manager_name: teamManager.trim() || null,
      coach_email: teamEmail.trim() || null,
      home_field: teamField.trim() || null,
      city: teamCity.trim() || null,
      founded_year: teamFounded || null,
      status: "active",
    });
    setTeamFormOpen(false);
    loadData();
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm("¿Eliminar este equipo y todos sus registros asociados?")) {
      mockDb.deleteTeam(id);
      loadData();
    }
  };

  // ── Players CRUD ────────────────────────────────────────────────────────────
  const handleOpenCreatePlayer = () => {
    setEditingPlayerId(null);
    setPlayerFirstName(""); setPlayerLastName("");
    if (teams.length > 0 && !playerTeamId) setPlayerTeamId(teams[0].id);
    setPlayerJersey(10); setPlayerPosition("MID");
    setPlayerDob("2000-01-01"); setPlayerDocId("");
    setPlayerPhone(""); setPlayerEmail("");
    setPlayerFormOpen(true);
  };

  const handleOpenEditPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setPlayerFirstName(player.first_name);
    setPlayerLastName(player.last_name);
    setPlayerTeamId(player.team_id);
    setPlayerJersey(player.jersey_number || 10);
    setPlayerPosition(player.position || "MID");
    setPlayerDob(player.date_of_birth || "2000-01-01");
    setPlayerDocId(player.document_id || "");
    setPlayerPhone(player.phone || "");
    setPlayerEmail(player.email || "");
    setPlayerFormOpen(true);
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerFirstName.trim() || !playerLastName.trim() || !playerTeamId) return;
    mockDb.savePlayer({
      id: editingPlayerId || undefined,
      team_id: playerTeamId,
      league_id: leagueId,
      first_name: playerFirstName.trim(),
      last_name: playerLastName.trim(),
      jersey_number: playerJersey,
      position: playerPosition,
      date_of_birth: playerDob,
      document_id: playerDocId.trim() || null,
      phone: playerPhone.trim() || null,
      email: playerEmail.trim() || null,
      status: "active",
    });
    setPlayerFormOpen(false);
    loadData();
  };

  const handleDeletePlayer = (id: string) => {
    if (confirm("¿Eliminar a este jugador de la plantilla?")) {
      mockDb.deletePlayer(id);
      loadData();
    }
  };

  // ── Matches CRUD ────────────────────────────────────────────────────────────
  const handleOpenCreateMatch = () => {
    setEditingMatchId(null);
    if (teams.length >= 2) { setMatchHomeId(teams[0].id); setMatchAwayId(teams[1].id); }
    setMatchDate("2026-06-01T16:00"); setMatchday(1);
    setMatchVenue(""); setMatchReferee(""); setMatchNotes("");
    setMatchHomeGoals(0); setMatchAwayGoals(0); setMatchStatus("scheduled");
    setMatchFormOpen(true);
  };

  const handleOpenEditMatch = (match: Match) => {
    setEditingMatchId(match.id);
    setMatchHomeId(match.home_team_id);
    setMatchAwayId(match.away_team_id);
    setMatchDate(new Date(match.match_date).toISOString().substring(0, 16));
    setMatchday(match.matchday || 1);
    setMatchVenue(match.venue || "");
    setMatchReferee(match.referee_name || "");
    setMatchNotes(match.notes || "");
    setMatchHomeGoals(match.home_goals);
    setMatchAwayGoals(match.away_goals);
    setMatchStatus(match.status);
    setMatchFormOpen(true);
  };

  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchHomeId || !matchAwayId || matchHomeId === matchAwayId) {
      alert("Selecciona dos equipos diferentes.");
      return;
    }
    mockDb.saveMatch({
      id: editingMatchId || undefined,
      league_id: leagueId,
      home_team_id: matchHomeId,
      away_team_id: matchAwayId,
      match_date: new Date(matchDate).toISOString(),
      matchday,
      venue: matchVenue.trim() || null,
      referee_name: matchReferee.trim() || null,
      notes: matchNotes.trim() || null,
      home_goals: matchHomeGoals,
      away_goals: matchAwayGoals,
      status: matchStatus,
    });
    setMatchFormOpen(false);
    loadData();
  };

  const handleDeleteMatch = (id: string) => {
    if (confirm("¿Eliminar este partido y todas sus estadísticas?")) {
      mockDb.deleteMatch(id);
      loadData();
    }
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const handleSelectMatchForStats = (matchId: string) => {
    setSelectedMatchForStats(matchId);
    const matchStats = stats.filter((s) => s.match_id === matchId);
    const initialMap: Record<string, { goals: number; assists: number; yellow: number; red: number }> = {};
    matchStats.forEach((s) => {
      initialMap[s.player_id] = {
        goals: s.goals, assists: s.assists,
        yellow: s.yellow_cards, red: s.red_cards,
      };
    });
    setStatsMap(initialMap);
  };

  const handleStatChange = (playerId: string, _teamId: string, field: "goals" | "assists" | "yellow" | "red", val: number) => {
    const current = statsMap[playerId] || { goals: 0, assists: 0, yellow: 0, red: 0 };
    let newVal = (current[field] || 0) + val;
    if (newVal < 0) newVal = 0;
    if (field === "yellow" && newVal > 2) newVal = 2;
    if (field === "red" && newVal > 1) newVal = 1;
    setStatsMap({ ...statsMap, [playerId]: { ...current, [field]: newVal } });
  };

  const handleSaveStats = () => {
    if (!selectedMatchForStats) return;
    const finalStatsArray: Partial<MatchStatistics>[] = [];
    const match = matches.find((m) => m.id === selectedMatchForStats);
    if (!match) return;
    Object.entries(statsMap).forEach(([playerId, value]) => {
      const player = players.find((p) => p.id === playerId);
      if (player && (value.goals > 0 || value.assists > 0 || value.yellow > 0 || value.red > 0)) {
        finalStatsArray.push({
          player_id: playerId,
          team_id: player.team_id,
          goals: value.goals, assists: value.assists,
          yellow_cards: value.yellow, red_cards: value.red,
          minutes_played: 90,
        });
      }
    });
    mockDb.saveMatchStatistics(selectedMatchForStats, finalStatsArray);
    alert("✅ Estadísticas guardadas. La tabla de clasificación y goleadores se han actualizado.");
    setSelectedMatchForStats("");
    loadData();
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filteredPlayers = players.filter((p) => {
    const matchTeam = playerTeamFilter === "all" || p.team_id === playerTeamFilter;
    const matchSearch =
      p.first_name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
      p.last_name.toLowerCase().includes(playerSearchQuery.toLowerCase());
    return matchTeam && matchSearch;
  });

  const totalGoals = matches.reduce((acc, m) => acc + (m.home_goals || 0) + (m.away_goals || 0), 0);
  const finishedMatches = matches.filter((m) => m.status === "finished").length;
  const scheduledMatches = matches.filter((m) => m.status === "scheduled").length;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: C.dark }}
      >
        <div className="text-center space-y-4">
          <div
            className="h-10 w-10 animate-spin rounded-full mx-auto"
            style={{
              border: `3px solid ${C.border}`,
              borderTop: `3px solid ${C.green}`,
            }}
          />
          <p className="text-sm font-semibold" style={{ color: C.textMuted }}>
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────
  const navItems: { id: ActiveTab; icon: React.ReactNode; label: string; desc: string }[] = [
    { id: "overview", icon: <LayoutDashboard className="h-4 w-4" />, label: "Resumen", desc: "Métricas generales" },
    { id: "teams",    icon: <Shield className="h-4 w-4" />,          label: "Equipos",  desc: `${teams.length} equipos` },
    { id: "players",  icon: <Users className="h-4 w-4" />,           label: "Jugadores",desc: `${players.length} jugadores` },
    { id: "matches",  icon: <Calendar className="h-4 w-4" />,        label: "Partidos", desc: `${matches.length} partidos` },
    { id: "stats",    icon: <BarChart2 className="h-4 w-4" />,       label: "Estadísticas", desc: "Cargar planilla" },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: C.dark }}>
      <Nav />

      {/* Admin Header */}
      <div
        className="border-b px-4 py-5 sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(90deg, ${C.dark} 0%, rgba(0,79,57,0.12) 100%)`,
          borderColor: C.border,
        }}
      >
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})` }}
              >
                <LayoutDashboard className="h-4 w-4" style={{ color: C.cream }} />
              </div>
              <h1 className="text-xl font-extrabold" style={{ color: C.cream }}>
                Panel de Administración
              </h1>
            </div>
            <p className="text-xs" style={{ color: C.textMuted }}>
              Liga Amateur Metropolitana 2026 · Administrador Activo
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/liga")}
              className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200"
              style={{
                background: "rgba(255,250,202,0.07)",
                border: `1px solid ${C.border}`,
                color: C.textSoft,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.07)")}
            >
              Ver Estadísticas Públicas ↗
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 flex flex-col md:flex-row gap-6 sm:px-6 lg:px-8">

        {/* Sidebar */}
        <aside className="w-full md:w-60 shrink-0">
          <div
            className="rounded-2xl p-3 space-y-1 sticky top-24"
            style={{ background: C.dark2, border: `1px solid ${C.border}` }}
          >
            <p
              className="text-[10px] font-extrabold uppercase tracking-widest px-3 pt-1 pb-2"
              style={{ color: C.textMuted }}
            >
              Secciones
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => { setActiveTab(item.id); setSelectedMatchForStats(""); }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
                  style={{
                    background: isActive
                      ? `linear-gradient(90deg, ${C.green} 0%, ${C.greenLight} 100%)`
                      : "transparent",
                    boxShadow: isActive
                      ? `inset 3px 0 0 ${C.cream}, 0 2px 12px rgba(0,79,57,0.3)`
                      : "none",
                    color: isActive ? C.cream : C.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,250,202,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      opacity: isActive ? 1 : 0.6,
                      color: isActive ? C.cream : "currentColor",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div
                      className="text-[10px] font-semibold"
                      style={{ color: isActive ? "rgba(255,250,202,0.7)" : "rgba(255,250,202,0.3)" }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto" style={{ color: C.cream, opacity: 0.6 }} />
                  )}
                </button>
              );
            })}

            {/* Quick stats in sidebar */}
            <div
              className="mt-3 pt-3 border-t space-y-2"
              style={{ borderColor: C.border }}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-widest px-3" style={{ color: C.textMuted }}>
                Resumen rápido
              </p>
              {[
                { label: "Goles totales", val: totalGoals, icon: "⚽" },
                { label: "Partidos jugados", val: finishedMatches, icon: "✅" },
                { label: "Por jugar", val: scheduledMatches, icon: "📅" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,250,202,0.04)" }}
                >
                  <span className="text-xs" style={{ color: C.textMuted }}>
                    {s.icon} {s.label}
                  </span>
                  <span className="text-xs font-extrabold" style={{ color: C.cream }}>
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">

          {/* ═══ TAB: OVERVIEW ═══════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6 slide-in">

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Equipos", val: teams.length, icon: <Shield className="h-5 w-5" />,
                    accent: C.green, desc: "Inscritos en la liga",
                  },
                  {
                    label: "Jugadores", val: players.length, icon: <Users className="h-5 w-5" />,
                    accent: "#6b4fbb", desc: "En plantillas activas",
                  },
                  {
                    label: "Partidos", val: matches.length, icon: <Calendar className="h-5 w-5" />,
                    accent: "#b45309", desc: "Programados en total",
                  },
                  {
                    label: "Goles", val: totalGoals, icon: <Target className="h-5 w-5" />,
                    accent: "#b91c1c", desc: "Marcados en la liga",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl p-5 card-hover"
                    style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                  >
                    <div
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3"
                      style={{ background: `${card.accent}25`, color: card.accent }}
                    >
                      {card.icon}
                    </div>
                    <div className="text-3xl font-black mb-0.5 count-up" style={{ color: C.cream }}>
                      {card.val}
                    </div>
                    <div className="text-xs font-bold" style={{ color: C.cream }}>
                      {card.label}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>
                      {card.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info banner */}
              <div
                className="rounded-2xl p-5 flex gap-4"
                style={{
                  background: "rgba(0,79,57,0.12)",
                  border: `1px solid rgba(0,79,57,0.3)`,
                }}
              >
                <div
                  className="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center mt-0.5"
                  style={{ background: "rgba(0,79,57,0.3)" }}
                >
                  <Zap className="h-4 w-4" style={{ color: C.cream }} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm mb-1" style={{ color: C.cream }}>
                    Modo Demo Activo — Datos en tu Navegador
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
                    Todos los cambios se guardan instantáneamente en <strong style={{ color: C.cream }}>localStorage</strong>.
                    Puedes agregar equipos, inscribir jugadores, programar partidos y cargar estadísticas.
                    Al guardar estadísticas en la pestaña <strong style={{ color: C.cream }}>Estadísticas</strong>,
                    la tabla de clasificación y goleadores pública se actualiza al instante.
                  </p>
                </div>
              </div>

              {/* Recent activity */}
              <div className="grid gap-5 md:grid-cols-2">
                <div
                  className="rounded-2xl p-5"
                  style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4" style={{ color: C.green }} />
                    <h4 className="text-sm font-extrabold" style={{ color: C.cream }}>Últimos Resultados</h4>
                  </div>
                  <div className="space-y-2">
                    {matches.filter((m) => m.status === "finished").slice(0, 4).map((match) => (
                      <div
                        key={match.id}
                        className="flex justify-between items-center rounded-xl px-3 py-2.5 text-xs"
                        style={{ background: "rgba(255,250,202,0.04)", border: `1px solid ${C.border}` }}
                      >
                        <span className="font-semibold truncate max-w-[60%]" style={{ color: C.textSoft }}>
                          {teams.find((t) => t.id === match.home_team_id)?.name}
                          <span style={{ color: C.textMuted }}> vs </span>
                          {teams.find((t) => t.id === match.away_team_id)?.name}
                        </span>
                        <span
                          className="rounded-lg px-2.5 py-1 font-extrabold tabular-nums"
                          style={{
                            background: "rgba(0,79,57,0.3)",
                            border: "1px solid rgba(0,79,57,0.5)",
                            color: C.cream,
                          }}
                        >
                          {match.home_goals} – {match.away_goals}
                        </span>
                      </div>
                    ))}
                    {matches.filter((m) => m.status === "finished").length === 0 && (
                      <p className="text-xs text-center py-4" style={{ color: C.textMuted }}>
                        No hay resultados registrados aún.
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-2xl p-5"
                  style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4" style={{ color: "#FFFACA", opacity: 0.7 }} />
                    <h4 className="text-sm font-extrabold" style={{ color: C.cream }}>Próximos Partidos</h4>
                  </div>
                  <div className="space-y-2">
                    {matches.filter((m) => m.status === "scheduled").slice(0, 4).map((match) => (
                      <div
                        key={match.id}
                        className="flex justify-between items-center rounded-xl px-3 py-2.5 text-xs"
                        style={{ background: "rgba(255,250,202,0.04)", border: `1px solid ${C.border}` }}
                      >
                        <span className="font-semibold truncate max-w-[60%]" style={{ color: C.textSoft }}>
                          {teams.find((t) => t.id === match.home_team_id)?.name}
                          <span style={{ color: C.textMuted }}> vs </span>
                          {teams.find((t) => t.id === match.away_team_id)?.name}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 font-bold"
                          style={{ background: "rgba(255,250,202,0.1)", color: C.cream }}
                        >
                          J{match.matchday}
                        </span>
                      </div>
                    ))}
                    {matches.filter((m) => m.status === "scheduled").length === 0 && (
                      <p className="text-xs text-center py-4" style={{ color: C.textMuted }}>
                        No hay partidos programados.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div
                className="rounded-2xl p-5"
                style={{ background: C.dark2, border: `1px solid ${C.border}` }}
              >
                <h4 className="text-sm font-extrabold mb-4" style={{ color: C.cream }}>
                  Acciones Rápidas
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "➕ Nuevo Equipo",    tab: "teams" as ActiveTab,   icon: Shield },
                    { label: "➕ Nuevo Jugador",   tab: "players" as ActiveTab, icon: Users },
                    { label: "📅 Nuevo Partido",   tab: "matches" as ActiveTab, icon: Calendar },
                    { label: "📊 Cargar Stats",    tab: "stats" as ActiveTab,   icon: BarChart2 },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200"
                      style={{
                        background: "rgba(0,79,57,0.15)",
                        border: "1px solid rgba(0,79,57,0.35)",
                        color: C.cream,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,79,57,0.28)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,79,57,0.15)")}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB: TEAMS ══════════════════════════════════════════════════ */}
          {activeTab === "teams" && (
            <div className="space-y-5 slide-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: C.cream }}>Equipos Registrados</h2>
                  <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{teams.length} equipos activos en la liga</p>
                </div>
                <BtnPrimary onClick={handleOpenCreateTeam}>
                  <Plus className="h-4 w-4" /> Agregar Equipo
                </BtnPrimary>
              </div>

              {teamFormOpen && (
                <FormCard
                  title={editingTeamId ? "✏️ Editar Club" : "🛡️ Inscribir Nuevo Club"}
                  onClose={() => setTeamFormOpen(false)}
                >
                  <form onSubmit={handleSaveTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Lbl>Nombre del Equipo *</Lbl>
                      <Inp required value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Ej. Deportivo Fénix" />
                    </div>
                    <div>
                      <Lbl>Delegado / Manager</Lbl>
                      <Inp value={teamManager} onChange={(e) => setTeamManager(e.target.value)} placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                      <Lbl>Email del Coordinador</Lbl>
                      <Inp type="email" value={teamEmail} onChange={(e) => setTeamEmail(e.target.value)} placeholder="contacto@club.com" />
                    </div>
                    <div>
                      <Lbl>Campo / Sede Local</Lbl>
                      <Inp value={teamField} onChange={(e) => setTeamField(e.target.value)} placeholder="Ej. Campo del Sol" />
                    </div>
                    <div>
                      <Lbl>Ciudad</Lbl>
                      <Inp value={teamCity} onChange={(e) => setTeamCity(e.target.value)} placeholder="Ej. CDMX" />
                    </div>
                    <div>
                      <Lbl>Año de Fundación</Lbl>
                      <Inp type="number" value={teamFounded} onChange={(e) => setTeamFounded(parseInt(e.target.value))} />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
                      <BtnSecondary onClick={() => setTeamFormOpen(false)}>Cancelar</BtnSecondary>
                      <BtnPrimary type="submit"><Save className="h-4 w-4" /> Guardar Equipo</BtnPrimary>
                    </div>
                  </form>
                </FormCard>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {teams.map((team) => {
                  const teamPlayers = players.filter((p) => p.team_id === team.id);
                  return (
                    <div
                      key={team.id}
                      className="rounded-2xl p-5 card-hover"
                      style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <div
                            className="h-11 w-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
                              boxShadow: "0 4px 14px rgba(0,79,57,0.4)",
                            }}
                          >
                            🛡️
                          </div>
                          <div>
                            <h4 className="font-extrabold" style={{ color: C.cream }}>{team.name}</h4>
                            <p className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>
                              Fundado: {team.founded_year ?? "S/D"} · {team.city ?? "Sin ciudad"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenEditTeam(team)}
                            className="p-2 rounded-lg transition-all duration-150"
                            style={{ background: "rgba(255,250,202,0.06)", color: C.textSoft }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.12)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.06)")}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="p-2 rounded-lg transition-all duration-150"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div
                        className="grid grid-cols-3 gap-2 pt-3 border-t text-center"
                        style={{ borderColor: C.border }}
                      >
                        <div>
                          <div className="text-lg font-black" style={{ color: C.cream }}>{teamPlayers.length}</div>
                          <div className="text-[10px]" style={{ color: C.textMuted }}>Jugadores</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold truncate" style={{ color: C.cream }}>
                            {team.manager_name ?? "–"}
                          </div>
                          <div className="text-[10px]" style={{ color: C.textMuted }}>Manager</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold truncate" style={{ color: C.cream }}>
                            {team.home_field ?? "–"}
                          </div>
                          <div className="text-[10px]" style={{ color: C.textMuted }}>Campo</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ TAB: PLAYERS ════════════════════════════════════════════════ */}
          {activeTab === "players" && (
            <div className="space-y-5 slide-in">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: C.cream }}>Plantilla de Jugadores</h2>
                  <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{players.length} jugadores registrados en total</p>
                </div>
                <BtnPrimary onClick={handleOpenCreatePlayer}>
                  <Plus className="h-4 w-4" /> Agregar Jugador
                </BtnPrimary>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: C.textMuted }} />
                  <Inp
                    className="pl-10"
                    placeholder="Buscar por nombre..."
                    value={playerSearchQuery}
                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
                  />
                </div>
                <div className="sm:w-48">
                  <Sel
                    value={playerTeamFilter}
                    onChange={(e) => setPlayerTeamFilter(e.target.value)}
                  >
                    <option value="all">Todos los equipos</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>🛡️ {t.name}</option>
                    ))}
                  </Sel>
                </div>
              </div>

              {playerFormOpen && (
                <FormCard
                  title={editingPlayerId ? "✏️ Editar Jugador" : "⚽ Registrar Jugador"}
                  onClose={() => setPlayerFormOpen(false)}
                >
                  <form onSubmit={handleSavePlayer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Lbl>Nombre *</Lbl>
                      <Inp required value={playerFirstName} onChange={(e) => setPlayerFirstName(e.target.value)} placeholder="Ej. Mateo" />
                    </div>
                    <div>
                      <Lbl>Apellido *</Lbl>
                      <Inp required value={playerLastName} onChange={(e) => setPlayerLastName(e.target.value)} placeholder="Ej. Gómez" />
                    </div>
                    <div>
                      <Lbl>Club *</Lbl>
                      <Sel value={playerTeamId} onChange={(e) => setPlayerTeamId(e.target.value)} required>
                        {teams.map((t) => (<option key={t.id} value={t.id}>🛡️ {t.name}</option>))}
                      </Sel>
                    </div>
                    <div>
                      <Lbl>Número de Camiseta</Lbl>
                      <Inp type="number" min="1" max="99" value={playerJersey} onChange={(e) => setPlayerJersey(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <Lbl>Posición</Lbl>
                      <Sel value={playerPosition} onChange={(e) => setPlayerPosition(e.target.value as any)}>
                        <option value="GK">Arquero (GK)</option>
                        <option value="DEF">Defensa (DEF)</option>
                        <option value="MID">Mediocampista (MID)</option>
                        <option value="FWD">Delantero (FWD)</option>
                      </Sel>
                    </div>
                    <div>
                      <Lbl>Fecha de Nacimiento</Lbl>
                      <Inp type="date" value={playerDob} onChange={(e) => setPlayerDob(e.target.value)} />
                    </div>
                    <div>
                      <Lbl>Documento (CURP/INE)</Lbl>
                      <Inp value={playerDocId} onChange={(e) => setPlayerDocId(e.target.value)} placeholder="Ej. ID-9900" />
                    </div>
                    <div>
                      <Lbl>Teléfono</Lbl>
                      <Inp value={playerPhone} onChange={(e) => setPlayerPhone(e.target.value)} placeholder="555-0000" />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
                      <BtnSecondary onClick={() => setPlayerFormOpen(false)}>Cancelar</BtnSecondary>
                      <BtnPrimary type="submit"><Save className="h-4 w-4" /> Inscribir Jugador</BtnPrimary>
                    </div>
                  </form>
                </FormCard>
              )}

              {/* Players Table */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${C.border}` }}
              >
                <table className="w-full table-brand text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="w-10 text-center">#</th>
                      <th>Jugador</th>
                      <th>Equipo</th>
                      <th>Pos.</th>
                      <th className="hidden md:table-cell">Doc. ID</th>
                      <th className="text-right pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => {
                      const team = teams.find((t) => t.id === player.team_id);
                      return (
                        <tr key={player.id}>
                          <td className="text-center font-extrabold w-10" style={{ color: C.textMuted }}>
                            {player.jersey_number ?? "–"}
                          </td>
                          <td className="font-bold" style={{ color: C.cream }}>
                            {player.first_name} {player.last_name}
                          </td>
                          <td className="text-sm" style={{ color: C.textSoft }}>
                            🛡️ {team?.name ?? "Sin equipo"}
                          </td>
                          <td>{posBadge(player.position)}</td>
                          <td className="hidden md:table-cell font-mono text-xs" style={{ color: C.textMuted }}>
                            {player.document_id ?? "N/D"}
                          </td>
                          <td className="text-right pr-4">
                            <div className="inline-flex gap-1">
                              <button
                                onClick={() => handleOpenEditPlayer(player)}
                                className="p-1.5 rounded-lg transition-all"
                                style={{ background: "rgba(255,250,202,0.06)", color: C.textSoft }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.12)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.06)")}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePlayer(player.id)}
                                className="p-1.5 rounded-lg transition-all"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredPlayers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10" style={{ color: C.textMuted }}>
                          No se encontraron jugadores.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ TAB: MATCHES ════════════════════════════════════════════════ */}
          {activeTab === "matches" && (
            <div className="space-y-5 slide-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: C.cream }}>Calendario del Torneo</h2>
                  <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{finishedMatches} jugados · {scheduledMatches} por jugar</p>
                </div>
                <BtnPrimary onClick={handleOpenCreateMatch}>
                  <Plus className="h-4 w-4" /> Programar Partido
                </BtnPrimary>
              </div>

              {matchFormOpen && (
                <FormCard
                  title={editingMatchId ? "✏️ Editar Partido" : "📅 Programar Nuevo Partido"}
                  onClose={() => setMatchFormOpen(false)}
                >
                  <form onSubmit={handleSaveMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Lbl>Equipo Local *</Lbl>
                      <Sel value={matchHomeId} onChange={(e) => setMatchHomeId(e.target.value)} required>
                        {teams.map((t) => (<option key={t.id} value={t.id}>🛡️ {t.name}</option>))}
                      </Sel>
                    </div>
                    <div>
                      <Lbl>Equipo Visitante *</Lbl>
                      <Sel value={matchAwayId} onChange={(e) => setMatchAwayId(e.target.value)} required>
                        {teams.map((t) => (<option key={t.id} value={t.id}>🛡️ {t.name}</option>))}
                      </Sel>
                    </div>
                    <div>
                      <Lbl>Fecha y Hora *</Lbl>
                      <Inp type="datetime-local" required value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
                    </div>
                    <div>
                      <Lbl>Jornada #</Lbl>
                      <Inp type="number" min="1" value={matchday} onChange={(e) => setMatchday(parseInt(e.target.value))} />
                    </div>
                    <div>
                      <Lbl>Cancha / Sede</Lbl>
                      <Inp value={matchVenue} onChange={(e) => setMatchVenue(e.target.value)} placeholder="Ej. Cancha del Valle" />
                    </div>
                    <div>
                      <Lbl>Árbitro</Lbl>
                      <Inp value={matchReferee} onChange={(e) => setMatchReferee(e.target.value)} placeholder="Ej. Arturo Brizio" />
                    </div>

                    <div
                      className="md:col-span-2 rounded-xl p-4"
                      style={{ background: "rgba(0,79,57,0.1)", border: "1px solid rgba(0,79,57,0.25)" }}
                    >
                      <h5 className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: C.cream }}>
                        Resultado y Estado
                      </h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Lbl>Goles Local</Lbl>
                          <Inp type="number" min="0" value={matchHomeGoals} onChange={(e) => setMatchHomeGoals(parseInt(e.target.value))} />
                        </div>
                        <div>
                          <Lbl>Goles Visitante</Lbl>
                          <Inp type="number" min="0" value={matchAwayGoals} onChange={(e) => setMatchAwayGoals(parseInt(e.target.value))} />
                        </div>
                        <div>
                          <Lbl>Estado</Lbl>
                          <Sel value={matchStatus} onChange={(e) => setMatchStatus(e.target.value as any)}>
                            <option value="scheduled">Programado</option>
                            <option value="finished">Finalizado</option>
                            <option value="live">En Vivo</option>
                            <option value="cancelled">Cancelado</option>
                            <option value="postponed">Pospuesto</option>
                          </Sel>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Lbl>Notas / Crónica</Lbl>
                      <textarea
                        value={matchNotes}
                        onChange={(e) => setMatchNotes(e.target.value)}
                        placeholder="Incidencias o comentarios del partido..."
                        rows={2}
                        className="w-full rounded-xl py-2.5 px-4 text-sm outline-none transition-all duration-200 resize-none"
                        style={{
                          background: "rgba(21,22,19,0.8)",
                          border: `1.5px solid ${C.border}`,
                          color: C.cream,
                        }}
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
                      <BtnSecondary onClick={() => setMatchFormOpen(false)}>Cancelar</BtnSecondary>
                      <BtnPrimary type="submit"><Save className="h-4 w-4" /> Guardar Partido</BtnPrimary>
                    </div>
                  </form>
                </FormCard>
              )}

              {/* Matches grouped by Jornada */}
              {(() => {
                const jornadas = Array.from(new Set(matches.map((m) => m.matchday))).sort((a, b) => a - b);
                return jornadas.map((jornada) => (
                  <div key={jornada}>
                    <div
                      className="flex items-center gap-3 mb-2"
                    >
                      <span
                        className="rounded-xl px-3 py-1 text-xs font-extrabold"
                        style={{ background: "rgba(0,79,57,0.25)", color: C.cream, border: "1px solid rgba(0,79,57,0.4)" }}
                      >
                        Jornada {jornada}
                      </span>
                      <div className="flex-1 h-px" style={{ background: C.border }} />
                    </div>
                    <div className="space-y-3 mb-5">
                      {matches.filter((m) => m.matchday === jornada).map((match) => {
                        const home = teams.find((t) => t.id === match.home_team_id);
                        const away = teams.find((t) => t.id === match.away_team_id);
                        return (
                          <div
                            key={match.id}
                            className="rounded-2xl p-4 card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {statusBadge(match.status)}
                                <span className="text-[10px]" style={{ color: C.textMuted }}>
                                  📅 {new Date(match.match_date).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                                </span>
                                {match.venue && (
                                  <span className="text-[10px]" style={{ color: C.textMuted }}>
                                    · 📍 {match.venue}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm font-extrabold" style={{ color: C.cream }}>
                                <span>🛡️ {home?.name}</span>
                                <span
                                  className="rounded-xl px-3 py-1.5 text-sm font-black tabular-nums"
                                  style={{
                                    background: match.status === "finished" ? "rgba(0,79,57,0.3)" : "rgba(255,250,202,0.08)",
                                    border: match.status === "finished" ? "1px solid rgba(0,79,57,0.5)" : `1px solid ${C.border}`,
                                    color: C.cream,
                                  }}
                                >
                                  {match.status === "finished" ? `${match.home_goals} – ${match.away_goals}` : "vs"}
                                </span>
                                <span>🛡️ {away?.name}</span>
                              </div>
                              {match.referee_name && (
                                <div className="text-[10px] mt-1.5" style={{ color: C.textMuted }}>
                                  🏳️ Árbitro: {match.referee_name}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 items-center">
                              {match.status === "finished" && (
                                <button
                                  onClick={() => { setActiveTab("stats"); handleSelectMatchForStats(match.id); }}
                                  className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
                                  style={{ background: "rgba(0,79,57,0.2)", border: "1px solid rgba(0,79,57,0.4)", color: C.cream }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,79,57,0.35)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,79,57,0.2)")}
                                >
                                  📊 Cargar Stats
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditMatch(match)}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: "rgba(255,250,202,0.06)", color: C.textSoft }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.12)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,250,202,0.06)")}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMatch(match.id)}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* ═══ TAB: STATS ══════════════════════════════════════════════════ */}
          {activeTab === "stats" && (
            <div className="space-y-5 slide-in">
              <div>
                <h2 className="text-lg font-extrabold" style={{ color: C.cream }}>Registrar Estadísticas</h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Selecciona un partido finalizado e ingresa goles, asistencias y tarjetas por jugador
                </p>
              </div>

              {!selectedMatchForStats ? (
                <div
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                >
                  <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: C.textMuted }}>
                    Partidos Finalizados
                  </p>
                  <div className="space-y-2">
                    {matches.filter((m) => m.status === "finished").map((match) => {
                      const home = teams.find((t) => t.id === match.home_team_id);
                      const away = teams.find((t) => t.id === match.away_team_id);
                      return (
                        <div
                          key={match.id}
                          onClick={() => handleSelectMatchForStats(match.id)}
                          className="rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer transition-all duration-200 group"
                          style={{ background: "rgba(255,250,202,0.04)", border: `1px solid ${C.border}` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(0,79,57,0.12)";
                            e.currentTarget.style.borderColor = "rgba(0,79,57,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,250,202,0.04)";
                            e.currentTarget.style.borderColor = C.border;
                          }}
                        >
                          <div>
                            <div className="font-extrabold text-sm" style={{ color: C.cream }}>
                              🛡️ {home?.name} <span style={{ color: C.textMuted }}>vs</span> 🛡️ {away?.name}
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>
                              Jornada {match.matchday} · {new Date(match.match_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="rounded-xl px-3 py-1 font-black tabular-nums"
                              style={{ background: "rgba(0,79,57,0.3)", color: C.cream }}
                            >
                              {match.home_goals} – {match.away_goals}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: C.cream }} />
                          </div>
                        </div>
                      );
                    })}
                    {matches.filter((m) => m.status === "finished").length === 0 && (
                      <div className="text-center py-10 space-y-2">
                        <div className="text-3xl">📅</div>
                        <p className="text-sm font-semibold" style={{ color: C.textMuted }}>
                          No hay partidos finalizados aún.
                        </p>
                        <p className="text-xs" style={{ color: "rgba(255,250,202,0.3)" }}>
                          Ve a Partidos, edita uno y cambia su estado a &quot;Finalizado&quot;.
                        </p>
                        <button
                          onClick={() => setActiveTab("matches")}
                          className="mt-2 rounded-xl px-4 py-2 text-xs font-bold"
                          style={{ background: "rgba(0,79,57,0.2)", color: C.cream, border: "1px solid rgba(0,79,57,0.4)" }}
                        >
                          Ir a Partidos
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Stats sheet
                (() => {
                  const selMatch = matches.find((m) => m.id === selectedMatchForStats);
                  const homeTeam = teams.find((t) => t.id === selMatch?.home_team_id);
                  const awayTeam = teams.find((t) => t.id === selMatch?.away_team_id);
                  const homePlayers = players.filter((p) => p.team_id === selMatch?.home_team_id);
                  const awayPlayers = players.filter((p) => p.team_id === selMatch?.away_team_id);

                  return (
                    <div
                      className="rounded-2xl p-5 space-y-6"
                      style={{ background: C.dark2, border: `1px solid ${C.border}` }}
                    >
                      <div
                        className="flex justify-between items-center pb-4 border-b"
                        style={{ borderColor: C.border }}
                      >
                        <div>
                          <span
                            className="text-[10px] font-extrabold uppercase tracking-widest"
                            style={{ color: C.greenLight }}
                          >
                            Planilla Activa
                          </span>
                          <h4 className="font-extrabold text-base mt-0.5" style={{ color: C.cream }}>
                            🛡️ {homeTeam?.name} <span style={{ color: C.textMuted }}>vs</span> 🛡️ {awayTeam?.name}
                          </h4>
                          <p className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>
                            Resultado: {selMatch?.home_goals} – {selMatch?.away_goals}
                          </p>
                        </div>
                        <BtnSecondary onClick={() => setSelectedMatchForStats("")}>← Volver</BtnSecondary>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {[
                          { team: homeTeam, players: homePlayers, emoji: "🏠" },
                          { team: awayTeam, players: awayPlayers, emoji: "✈️" },
                        ].map(({ team, players: pList, emoji }) => (
                          <div key={team?.id}>
                            <h5
                              className="text-xs font-extrabold uppercase tracking-wider mb-3 pb-2 border-b flex items-center gap-2"
                              style={{ color: C.cream, borderColor: C.border }}
                            >
                              {emoji} {team?.name}
                            </h5>
                            <div className="space-y-2">
                              {pList.map((player) => (
                                <PlayerStatRow
                                  key={player.id}
                                  player={player}
                                  stats={statsMap[player.id] || { goals: 0, assists: 0, yellow: 0, red: 0 }}
                                  onChange={(field, val) => handleStatChange(player.id, player.team_id, field, val)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        className="flex justify-end gap-3 pt-4 border-t"
                        style={{ borderColor: C.border }}
                      >
                        <BtnSecondary onClick={() => setSelectedMatchForStats("")}>Cancelar</BtnSecondary>
                        <BtnPrimary onClick={handleSaveStats}>
                          <Save className="h-4 w-4" /> Guardar Planilla
                        </BtnPrimary>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}

// ─── PlayerStatRow ────────────────────────────────────────────────────────────
function PlayerStatRow({
  player,
  stats,
  onChange,
}: {
  player: Player;
  stats: { goals: number; assists: number; yellow: number; red: number };
  onChange: (field: "goals" | "assists" | "yellow" | "red", val: number) => void;
}) {
  const C = {
    cream: "#FFFACA",
    border: "rgba(255,250,202,0.08)",
    textMuted: "rgba(255,250,202,0.45)",
    dark: "#151613",
  };

  const Counter = ({
    field,
    label,
    emoji,
    max,
  }: {
    field: "goals" | "assists" | "yellow" | "red";
    label: string;
    emoji?: string;
    max?: number;
  }) => {
    const val = stats[field];
    return (
      <div className="text-center">
        <div className="text-[9px] font-bold uppercase mb-1" style={{ color: C.textMuted }}>
          {emoji ?? label}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(field, -1)}
            className="h-6 w-6 rounded-md text-xs font-black flex items-center justify-center transition-all"
            style={{ background: "rgba(255,250,202,0.06)", color: C.cream, border: `1px solid ${C.border}` }}
          >
            −
          </button>
          <span className="text-sm font-extrabold w-5 text-center tabular-nums" style={{ color: C.cream }}>
            {val}
          </span>
          <button
            type="button"
            onClick={() => onChange(field, 1)}
            className="h-6 w-6 rounded-md text-xs font-black flex items-center justify-center transition-all"
            style={{ background: "rgba(255,250,202,0.06)", color: C.cream, border: `1px solid ${C.border}` }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="rounded-xl px-3 py-2.5 flex items-center justify-between transition-all"
      style={{
        background: "rgba(255,250,202,0.03)",
        border: `1px solid ${C.border}`,
      }}
    >
      <div className="min-w-0 mr-3">
        <div className="text-xs font-extrabold truncate" style={{ color: C.cream }}>
          {player.first_name} {player.last_name}
        </div>
        <div className="text-[9px] font-bold uppercase mt-0.5" style={{ color: C.textMuted }}>
          #{player.jersey_number} · {player.position}
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
        <Counter field="goals"   label="Goles" emoji="⚽" />
        <Counter field="assists" label="Asist" emoji="👟" />
        <Counter field="yellow"  label="Amari" emoji="🟨" max={2} />
        <Counter field="red"     label="Roja"  emoji="🟥" max={1} />
      </div>
    </div>
  );
}
