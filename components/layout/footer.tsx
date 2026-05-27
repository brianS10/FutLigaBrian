"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0d0e0b",
        borderTop: "1px solid rgba(255,250,202,0.07)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #004f39 0%, #006b4e 100%)",
                  boxShadow: "0 4px 14px rgba(0,79,57,0.4)",
                }}
              >
                <span className="text-lg">⚽</span>
              </div>
              <span
                className="text-lg font-extrabold tracking-tight"
                style={{ color: "#FFFACA" }}
              >
                FutLigaBrian
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,250,202,0.45)" }}>
              La plataforma profesional para gestionar ligas de fútbol amateur. Equipos, jugadores, partidos y estadísticas en un solo lugar.
            </p>
            <div className="mt-5 flex gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "rgba(0,79,57,0.3)",
                  border: "1px solid rgba(0,79,57,0.5)",
                  color: "#FFFACA",
                }}
              >
                ⚽ Fútbol Amateur
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "rgba(255,250,202,0.08)",
                  border: "1px solid rgba(255,250,202,0.15)",
                  color: "rgba(255,250,202,0.7)",
                }}
              >
                🏆 Gestión Total
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,250,202,0.4)" }}>
              Plataforma
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/liga", label: "Estadísticas" },
                { href: "/liga", label: "Tabla de Posiciones" },
                { href: "/liga", label: "Goleadores" },
                { href: "/auth/signin", label: "Panel Admin" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,250,202,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFACA")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,250,202,0.5)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,250,202,0.4)" }}>
              Legal
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "#", label: "Privacidad" },
                { href: "#", label: "Términos de Uso" },
                { href: "#", label: "Contacto" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,250,202,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFACA")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,250,202,0.5)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderColor: "rgba(255,250,202,0.07)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,250,202,0.3)" }}>
            © {year} <span style={{ color: "rgba(255,250,202,0.55)" }}>FutLigaBrian</span>. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,250,202,0.25)" }}>
            Hecho con ⚽ para la mejor liga
          </p>
        </div>
      </div>
    </footer>
  );
}
