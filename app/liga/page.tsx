"use client";

import { useState, useEffect } from "react";
import { mockDb } from "@/lib/services/mockDb";
import type { Team, Player, Match, LeagueStanding, TopScorer } from "@/lib/types";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Trophy, Calendar, Users, ListOrdered, MapPin, Clock, CircleDot } from "lucide-react";

type TabType = "standings" | "scorers" | "matches" | "teams";

export default function PublicLigaPage() {
  const [activeTab, setActiveTab] = useState<TabType>("standings");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [activeMatchdayFilter, setActiveMatchdayFilter] = useState<number>(0);
  
  // States loaded from mockDb
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<LeagueStanding[]>([]);
  const [scorers, setScorers] = useState<TopScorer[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const leagueId = "l1"; // Active league in demo

  useEffect(() => {
    // Load data from mock DB
    const loadedTeams = mockDb.getTeams();
    const loadedMatches = mockDb.getMatches();
    const loadedStandings = mockDb.getStandings(leagueId);
    const loadedScorers = mockDb.getTopScorers(leagueId);
    const loadedPlayers = mockDb.getPlayers();

    setTeams(loadedTeams);
    setMatches(loadedMatches);
    setStandings(loadedStandings);
    setScorers(loadedScorers);
    setPlayers(loadedPlayers);

    if (loadedTeams.length > 0) {
      setSelectedTeamId(loadedTeams[0].id);
    }

    // Determine default matchday filter (e.g. max matchday)
    const matchdays = loadedMatches.map((m) => m.matchday || 1);
    if (matchdays.length > 0) {
      setActiveMatchdayFilter(Math.max(...matchdays));
    }
  }, []);

  // Filter matches by matchday
  const matchdays = Array.from(new Set(matches.map((m) => m.matchday || 1))).sort((a, b) => a - b);
  const filteredMatches = matches.filter((m) => m.matchday === activeMatchdayFilter);

  // Selected team players
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);
  const selectedTeamPlayers = players.filter((p) => p.team_id === selectedTeamId);

  // Stats summaries
  const totalGoals = standings.reduce((acc, curr) => acc + curr.goals_for, 0);
  const totalMatchesFinished = matches.filter((m) => m.status === "finished").length;

  return (
    <div className="flex min-h-screen flex-col bg-[#072411] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-950 via-[#072411] to-black text-zinc-100">
      <Nav />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-zinc-950 to-[#0c3e1e] border-b border-emerald-900/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <CircleDot className="h-3 w-3 animate-pulse" /> Torneo Oficial
              </span>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Liga Amateur Metropolitana
              </h1>
              <p className="mt-2 max-w-xl text-lg text-emerald-300/80">
                Explora las posiciones oficiales, goleadores destacados, plantillas completas y sigue los marcadores del torneo.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="rounded-xl border border-emerald-800/20 bg-zinc-950/40 p-4 backdrop-blur-md">
                <div className="text-2xl font-bold text-white">{totalMatchesFinished}</div>
                <div className="text-xs text-zinc-400">Partidos Completados</div>
              </div>
              <div className="rounded-xl border border-emerald-800/20 bg-zinc-950/40 p-4 backdrop-blur-md">
                <div className="text-2xl font-bold text-emerald-400">{totalGoals}</div>
                <div className="text-xs text-zinc-400">Goles Totales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/20 sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex space-x-1 py-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("standings")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "standings"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <ListOrdered className="h-4 w-4" /> Clasificación
            </button>
            <button
              onClick={() => setActiveTab("scorers")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "scorers"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <Trophy className="h-4 w-4" /> Goleadores
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "matches"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <Calendar className="h-4 w-4" /> Calendario
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === "teams"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" /> Plantillas
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 relative z-10">
        
        {/* TAB 1: STANDINGS */}
        {activeTab === "standings" && (
          <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/30 p-6 shadow-xl backdrop-blur-xl slide-in">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Tabla de Posiciones</h3>
                <p className="text-xs text-zinc-400">Ordenado por Puntos → Diferencia de Goles → Goles a Favor</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> PJ: Partidos Jugados
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> DG: Dif Goles
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/60 text-zinc-400">
                    <th className="py-3 pl-4 text-center w-12 font-semibold">Pos</th>
                    <th className="py-3 pl-2 font-semibold">Equipo</th>
                    <th className="py-3 text-center font-semibold">PJ</th>
                    <th className="py-3 text-center font-semibold">G</th>
                    <th className="py-3 text-center font-semibold">E</th>
                    <th className="py-3 text-center font-semibold">P</th>
                    <th className="py-3 text-center font-semibold hidden md:table-cell">GF</th>
                    <th className="py-3 text-center font-semibold hidden md:table-cell">GC</th>
                    <th className="py-3 text-center font-semibold">DG</th>
                    <th className="py-3 pr-4 text-right font-extrabold text-white">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {standings.map((team, idx) => (
                    <tr
                      key={team.id}
                      className={`transition-colors duration-150 hover:bg-emerald-500/5 ${
                        idx === 0 ? "bg-emerald-950/10" : ""
                      }`}
                    >
                      <td className="py-4 text-center font-bold">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            idx === 0
                              ? "bg-emerald-600 text-white"
                              : idx === 1
                              ? "bg-emerald-700/50 text-zinc-100"
                              : "text-zinc-400"
                          }`}
                        >
                          {team.position}
                        </span>
                      </td>
                      <td className="py-4 pl-2 font-bold text-white flex items-center gap-3">
                        <span className="text-xl">🛡️</span>
                        <span>{team.name}</span>
                        {idx === 0 && (
                          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 uppercase tracking-wide">
                            Líder
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-center font-medium text-zinc-300">{team.played_matches}</td>
                      <td className="py-4 text-center text-zinc-400">{team.wins}</td>
                      <td className="py-4 text-center text-zinc-400">{team.draws}</td>
                      <td className="py-4 text-center text-zinc-400">{team.losses}</td>
                      <td className="py-4 text-center text-zinc-400 hidden md:table-cell">{team.goals_for}</td>
                      <td className="py-4 text-center text-zinc-400 hidden md:table-cell">{team.goals_against}</td>
                      <td className="py-4 text-center font-semibold text-zinc-300">
                        {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                      </td>
                      <td className="py-4 pr-4 text-right font-extrabold text-white text-base">{team.points}</td>
                    </tr>
                  ))}
                  {standings.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-zinc-500">
                        No hay equipos cargados en esta liga.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SCORERS */}
        {activeTab === "scorers" && (
          <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/30 p-6 shadow-xl backdrop-blur-xl slide-in">
            <h3 className="text-xl font-bold text-white mb-2">Tabla de Goleadores</h3>
            <p className="text-xs text-zinc-400 mb-6">Máximos anotadores y asistentes del torneo actual</p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Goals Column */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 border-b border-emerald-950 pb-2">
                  ⚽ Goles Totales
                </h4>
                <div className="space-y-3">
                  {scorers.slice(0, 10).map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/30 bg-zinc-950/20 p-3 hover:border-emerald-500/10 hover:bg-emerald-500/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-zinc-500">#{idx + 1}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 font-bold text-zinc-200">
                          🏃
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {player.first_name} {player.last_name}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-1">
                            <span>🛡️ {player.team_name}</span>
                            <span>• PJ: {player.matches_played}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-white">{player.total_goals}</div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Goles</div>
                      </div>
                    </div>
                  ))}
                  {scorers.length === 0 && (
                    <div className="py-8 text-center text-zinc-500 text-sm">
                      Aún no hay goles registrados en este torneo.
                    </div>
                  )}
                </div>
              </div>

              {/* Assists Column */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 border-b border-emerald-950 pb-2">
                  👟 Asistencias Totales
                </h4>
                <div className="space-y-3">
                  {[...scorers]
                    .sort((a, b) => b.total_assists - a.total_assists)
                    .slice(0, 10)
                    .filter((p) => p.total_assists > 0)
                    .map((player, idx) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-800/30 bg-zinc-950/20 p-3 hover:border-emerald-500/10 hover:bg-emerald-500/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-center font-bold text-zinc-500">#{idx + 1}</span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 font-bold text-zinc-200">
                            🏃
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {player.first_name} {player.last_name}
                            </div>
                            <div className="text-xs text-zinc-400 flex items-center gap-1">
                              <span>🛡️ {player.team_name}</span>
                              <span>• PJ: {player.matches_played}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-extrabold text-white">{player.total_assists}</div>
                          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Asistencias</div>
                        </div>
                      </div>
                    ))}
                  {scorers.filter((p) => p.total_assists > 0).length === 0 && (
                    <div className="py-8 text-center text-zinc-500 text-sm">
                      Aún no hay asistencias registradas en este torneo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MATCHES */}
        {activeTab === "matches" && (
          <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/30 p-6 shadow-xl backdrop-blur-xl slide-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Calendario y Resultados</h3>
                <p className="text-xs text-zinc-400">Filtrar partidos programados por jornadas del torneo</p>
              </div>

              {/* Matchday Selector */}
              <div className="flex flex-wrap gap-1">
                {matchdays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveMatchdayFilter(day)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeMatchdayFilter === day
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    Jornada {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredMatches.map((match) => {
                const homeTeam = teams.find((t) => t.id === match.home_team_id);
                const awayTeam = teams.find((t) => t.id === match.away_team_id);

                return (
                  <div
                    key={match.id}
                    className="relative overflow-hidden rounded-xl border border-zinc-800/40 bg-zinc-950/40 p-5 shadow-lg hover:border-emerald-500/10 transition"
                  >
                    {/* Finished Status Badge */}
                    <div className="absolute right-4 top-4">
                      {match.status === "finished" ? (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                          Finalizado
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400 uppercase">
                          Programado
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Jornada {match.matchday}
                    </div>

                    {/* Home vs Away Scoreboard */}
                    <div className="mt-4 flex items-center justify-between gap-2 border-b border-zinc-800/30 pb-4">
                      {/* Home */}
                      <div className="flex-1 text-center md:text-left flex items-center gap-2">
                        <span className="text-xl">🛡️</span>
                        <div className="font-extrabold text-sm text-white">{homeTeam?.name || "Local"}</div>
                      </div>

                      {/* Goals Box */}
                      <div className="flex items-center gap-2 px-3">
                        {match.status === "finished" ? (
                          <>
                            <span className="rounded bg-zinc-900 border border-zinc-800 h-9 w-9 flex items-center justify-center font-extrabold text-lg text-white">
                              {match.home_goals}
                            </span>
                            <span className="text-zinc-600 font-bold">:</span>
                            <span className="rounded bg-zinc-900 border border-zinc-800 h-9 w-9 flex items-center justify-center font-extrabold text-lg text-white">
                              {match.away_goals}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            vs
                          </span>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex-1 text-right flex items-center justify-end gap-2">
                        <div className="font-extrabold text-sm text-white">{awayTeam?.name || "Visitante"}</div>
                        <span className="text-xl">🛡️</span>
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {match.venue || "Sin definir"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-zinc-500" /> {new Date(match.match_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {match.referee_name && (
                        <span className="text-zinc-500 italic">Árbitro: {match.referee_name}</span>
                      )}
                    </div>

                    {/* Match Notes */}
                    {match.notes && (
                      <div className="mt-3 rounded border border-zinc-800/20 bg-zinc-900/10 p-2 text-xs text-zinc-400 italic">
                        {match.notes}
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredMatches.length === 0 && (
                <div className="col-span-2 py-8 text-center text-zinc-500">
                  No hay partidos programados para esta jornada.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TEAMS & SQUADS */}
        {activeTab === "teams" && (
          <div className="rounded-xl border border-zinc-800/40 bg-zinc-950/30 p-6 shadow-xl backdrop-blur-xl slide-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Plantilla de Jugadores</h3>
                <p className="text-xs text-zinc-400">Explora las alineaciones y estadísticas de cada club</p>
              </div>

              {/* Team Selector Dropdown */}
              <div className="w-full md:w-64">
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 px-3 text-sm text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      🛡️ {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Squad Content */}
            {selectedTeam && (
              <div className="space-y-6">
                {/* Team Card Info */}
                <div className="rounded-lg border border-emerald-950/60 bg-emerald-950/10 p-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        🛡️ {selectedTeam.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manager: <span className="text-zinc-200">{selectedTeam.manager_name || "No asignado"}</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-400">Fundado:</span>{" "}
                        <span className="font-semibold text-white">{selectedTeam.founded_year || "S/D"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Cancha Local:</span>{" "}
                        <span className="font-semibold text-white">{selectedTeam.home_field || "S/D"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Squad List organized by positions */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* GK & DEF */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        🧤 Porteros
                      </h5>
                      <div className="space-y-2">
                        {selectedTeamPlayers.filter((p) => p.position === "GK").map((p) => (
                          <PlayerSquadRow key={p.id} player={p} scorers={scorers} />
                        ))}
                        {selectedTeamPlayers.filter((p) => p.position === "GK").length === 0 && (
                          <div className="text-xs text-zinc-500 py-1 pl-2 border-l border-zinc-800">No hay porteros cargados.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        🛡️ Defensas
                      </h5>
                      <div className="space-y-2">
                        {selectedTeamPlayers.filter((p) => p.position === "DEF").map((p) => (
                          <PlayerSquadRow key={p.id} player={p} scorers={scorers} />
                        ))}
                        {selectedTeamPlayers.filter((p) => p.position === "DEF").length === 0 && (
                          <div className="text-xs text-zinc-500 py-1 pl-2 border-l border-zinc-800">No hay defensas cargados.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MID & FWD */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        ⚙️ Mediocampistas
                      </h5>
                      <div className="space-y-2">
                        {selectedTeamPlayers.filter((p) => p.position === "MID").map((p) => (
                          <PlayerSquadRow key={p.id} player={p} scorers={scorers} />
                        ))}
                        {selectedTeamPlayers.filter((p) => p.position === "MID").length === 0 && (
                          <div className="text-xs text-zinc-500 py-1 pl-2 border-l border-zinc-800">No hay mediocampistas cargados.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                        🔥 Delanteros
                      </h5>
                      <div className="space-y-2">
                        {selectedTeamPlayers.filter((p) => p.position === "FWD").map((p) => (
                          <PlayerSquadRow key={p.id} player={p} scorers={scorers} />
                        ))}
                        {selectedTeamPlayers.filter((p) => p.position === "FWD").length === 0 && (
                          <div className="text-xs text-zinc-500 py-1 pl-2 border-l border-zinc-800">No hay delanteros cargados.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Row component for Roster Lists
function PlayerSquadRow({ player, scorers }: { player: Player; scorers: TopScorer[] }) {
  const pScorer = scorers.find((s) => s.id === player.id);
  const goals = pScorer ? pScorer.total_goals : 0;
  const assists = pScorer ? pScorer.total_assists : 0;

  return (
    <div className="flex items-center justify-between rounded border border-zinc-800/30 bg-zinc-950/20 p-2.5 hover:border-emerald-500/10 hover:bg-emerald-500/5 transition text-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
          #{player.jersey_number || "-"}
        </span>
        <div>
          <div className="font-bold text-white">{player.first_name} {player.last_name}</div>
          <div className="text-[10px] text-zinc-400">Posición: {player.position} • {player.status === "active" ? "Activo" : "Lesionado"}</div>
        </div>
      </div>
      {(goals > 0 || assists > 0) && (
        <div className="flex gap-2">
          {goals > 0 && (
            <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ⚽ {goals}
            </span>
          )}
          {assists > 0 && (
            <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
              👟 {assists}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
