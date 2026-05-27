import Link from "next/link";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#151613" }}
    >
      <Nav />

      <main className="flex-1">

        {/* ========== HERO ========== */}
        <section
          className="relative overflow-hidden px-4 pt-24 pb-20 sm:px-6 lg:px-8"
          style={{
            background: "linear-gradient(160deg, #151613 0%, #0d2119 50%, #004f39 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #004f39 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="pointer-events-none absolute top-1/2 right-0 h-80 w-80 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #FFFACA 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="relative mx-auto max-w-5xl text-center">
            {/* Pre-badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold fade-in"
              style={{
                background: "rgba(0,79,57,0.3)",
                border: "1px solid rgba(0,79,57,0.6)",
                color: "#FFFACA",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#FFFACA" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#FFFACA" }} />
              </span>
              Liga Activa 2026 — Temporada en curso
            </div>

            <h1
              className="mb-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl slide-in"
              style={{ color: "#FFFACA" }}
            >
              Gestiona tu liga
              <br />
              <span
                className="relative inline-block"
                style={{
                  background: "linear-gradient(90deg, #FFFACA 0%, #a8f5d6 50%, #FFFACA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                como profesional
              </span>
            </h1>

            <p
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed slide-in"
              style={{
                color: "rgba(255,250,202,0.65)",
                animationDelay: "0.1s",
              }}
            >
              <strong className="font-bold" style={{ color: "#FFFACA" }}>FutLigaBrian</strong> te da todas las herramientas para administrar
              equipos, jugadores, partidos y estadísticas de tu liga amateur — sin complicaciones.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center slide-in" style={{ animationDelay: "0.2s" }}>
              <Link href="/liga" id="hero-ver-liga">
                <button
                  className="btn-glow w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-extrabold transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #004f39 0%, #006b4e 100%)",
                    color: "#FFFACA",
                    boxShadow: "0 6px 28px rgba(0,79,57,0.5)",
                  }}
                >
                  🏆 Ver Estadísticas de la Liga
                </button>
              </Link>
              <Link href="/auth/signin" id="hero-acceso-admin">
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-extrabold transition-all duration-200 hover:bg-white/5"
                  style={{
                    border: "2px solid rgba(255,250,202,0.3)",
                    color: "#FFFACA",
                  }}
                >
                  🔑 Panel Administrador
                </button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { val: "4", label: "Equipos" },
                { val: "12+", label: "Jugadores" },
                { val: "6", label: "Partidos" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-4 text-center fade-in"
                  style={{
                    background: "rgba(0,79,57,0.15)",
                    border: "1px solid rgba(0,79,57,0.35)",
                  }}
                >
                  <div className="text-3xl font-black" style={{ color: "#FFFACA" }}>{stat.val}</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,250,202,0.55)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FEATURES ========== */}
        <section
          className="px-4 py-20 sm:px-6 lg:px-8"
          style={{ background: "#1a1c18" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#004f39" }}
              >
                Características
              </span>
              <h2
                className="mt-2 text-3xl font-black sm:text-4xl"
                style={{ color: "#FFFACA" }}
              >
                Todo lo que necesitas para tu liga
              </h2>
              <p className="mt-3 text-base" style={{ color: "rgba(255,250,202,0.5)" }}>
                Control total desde un solo panel, sin base de datos ni configuración compleja.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.id}
                  id={`feature-${feature.id}`}
                  className="card-hover rounded-2xl p-6 cursor-default"
                  style={{
                    background: "#151613",
                    border: "1px solid rgba(255,250,202,0.07)",
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    style={{
                      background: "rgba(0,79,57,0.25)",
                      border: "1px solid rgba(0,79,57,0.45)",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-base font-extrabold" style={{ color: "#FFFACA" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,250,202,0.5)" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section
          className="px-4 py-20 sm:px-6 lg:px-8"
          style={{ background: "#151613" }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#004f39" }}
            >
              ¿Cómo funciona?
            </span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl mb-12" style={{ color: "#FFFACA" }}>
              Simple, rápido, sin límites
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {i < steps.length - 1 && (
                    <div
                      className="hidden sm:block absolute top-6 left-full w-full h-px z-0"
                      style={{ background: "rgba(0,79,57,0.35)" }}
                    />
                  )}
                  <div className="relative z-10 text-center p-6">
                    <div
                      className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black"
                      style={{
                        background: "linear-gradient(135deg, #004f39 0%, #006b4e 100%)",
                        color: "#FFFACA",
                        boxShadow: "0 4px 16px rgba(0,79,57,0.4)",
                      }}
                    >
                      {step.number}
                    </div>
                    <h4 className="font-extrabold mb-1" style={{ color: "#FFFACA" }}>{step.title}</h4>
                    <p className="text-sm" style={{ color: "rgba(255,250,202,0.5)" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CTA ========== */}
        <section
          className="px-4 py-20 sm:px-6 lg:px-8"
          style={{
            background: "linear-gradient(135deg, #004f39 0%, #003528 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-5xl mb-5">🏆</div>
            <h2
              className="mb-4 text-3xl font-black sm:text-4xl"
              style={{ color: "#FFFACA" }}
            >
              ¿Listo para ver los resultados?
            </h2>
            <p className="mb-10 text-lg" style={{ color: "rgba(255,250,202,0.65)" }}>
              Consulta la tabla de clasificación, el ranking de goleadores y el calendario de partidos ahora mismo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/liga" id="cta-liga">
                <button
                  className="w-full sm:w-auto rounded-2xl px-8 py-4 text-base font-extrabold transition-all duration-200 hover:scale-105"
                  style={{
                    background: "#FFFACA",
                    color: "#151613",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  🏆 Tabla de Clasificación
                </button>
              </Link>
              <Link href="/auth/signin" id="cta-admin">
                <button
                  className="w-full sm:w-auto rounded-2xl px-8 py-4 text-base font-extrabold transition-all duration-200 hover:bg-white/5"
                  style={{
                    border: "2px solid rgba(255,250,202,0.35)",
                    color: "#FFFACA",
                  }}
                >
                  🔑 Administrar Liga
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

const features = [
  {
    id: 1,
    icon: "🏆",
    title: "Gestión de Ligas",
    description:
      "Crea y administra temporadas completas con configuración flexible para cualquier formato de liga.",
  },
  {
    id: 2,
    icon: "🛡️",
    title: "Equipos y Plantillas",
    description:
      "Organiza tus clubs con toda la información: manager, campo local, ciudad y año de fundación.",
  },
  {
    id: 3,
    icon: "⚽",
    title: "Jugadores y Posiciones",
    description:
      "Registra cada jugador con número de dorsal, posición, fecha de nacimiento y documento.",
  },
  {
    id: 4,
    icon: "📅",
    title: "Calendario de Partidos",
    description:
      "Programa jornadas, asigna árbitros y actualiza resultados en tiempo real.",
  },
  {
    id: 5,
    icon: "📊",
    title: "Tabla de Posiciones",
    description:
      "Clasificación automática actualizada al instante con puntos, diferencia de goles y más.",
  },
  {
    id: 6,
    icon: "🥅",
    title: "Estadísticas y Goleadores",
    description:
      "Registra goles, asistencias, tarjetas amarillas y rojas partido a partido.",
  },
];

const steps = [
  { number: "1", title: "Accede como Admin", desc: "Entra al panel de administración con un clic." },
  { number: "2", title: "Registra tu Liga", desc: "Agrega equipos, jugadores y programa los partidos." },
  { number: "3", title: "Comparte Resultados", desc: "Las estadísticas se actualizan al instante para todos." },
];
