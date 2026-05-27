"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, X, Shield, BarChart3, LogOut, Trophy } from "lucide-react";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{
        background: "rgba(21,22,19,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(255,250,202,0.08)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl font-bold shadow-lg transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #004f39 0%, #006b4e 100%)",
                  boxShadow: "0 4px 14px rgba(0,79,57,0.45)",
                }}
              >
                <span className="text-lg">⚽</span>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-base font-extrabold tracking-tight"
                  style={{ color: "#FFFACA" }}
                >
                  FutLiga
                </span>
                <span
                  className="text-base font-extrabold tracking-tight -mt-0.5"
                  style={{ color: "#FFFACA", opacity: 0.65 }}
                >
                  Brian
                </span>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/liga"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/5"
              style={{ color: "rgba(255,250,202,0.7)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFACA")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,250,202,0.7)")}
            >
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/5"
                style={{ color: "rgba(255,250,202,0.7)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFACA")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,250,202,0.7)")}
              >
                <Shield className="h-4 w-4" />
                Panel Admin
              </Link>
            )}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: "rgba(0,79,57,0.3)",
                    border: "1px solid rgba(0,79,57,0.6)",
                    color: "#FFFACA",
                  }}
                >
                  <Trophy className="h-3 w-3" />
                  Admin Activo
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
                  style={{ color: "rgba(255,100,100,0.85)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                    e.currentTarget.style.color = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,100,100,0.85)";
                  }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <button
                  className="btn-glow flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #004f39 0%, #006b4e 100%)",
                    color: "#FFFACA",
                  }}
                >
                  🔑 Acceso Admin
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Trigger */}
          <button
            className="md:hidden rounded-lg p-2 transition-colors"
            style={{ color: "rgba(255,250,202,0.7)" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="border-t py-4 md:hidden space-y-1 animate-in slide-in-from-top-2 duration-200"
            style={{ borderColor: "rgba(255,250,202,0.08)" }}
          >
            <Link
              href="/liga"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
              style={{ color: "rgba(255,250,202,0.75)" }}
            >
              <BarChart3 className="h-4 w-4" />
              Estadísticas Públicas
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                style={{ color: "rgba(255,250,202,0.75)" }}
              >
                <Shield className="h-4 w-4" />
                Panel Admin
              </Link>
            )}
            <div
              className="border-t pt-3 mt-2"
              style={{ borderColor: "rgba(255,250,202,0.08)" }}
            >
              {user ? (
                <div className="space-y-2 px-4">
                  <div
                    className="text-xs text-center font-bold rounded-lg py-2"
                    style={{
                      background: "rgba(0,79,57,0.3)",
                      color: "#FFFACA",
                      border: "1px solid rgba(0,79,57,0.5)",
                    }}
                  >
                    🛡️ Administrador Activo
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors"
                    style={{ color: "rgba(252,165,165,0.9)" }}
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                    <button
                      className="w-full rounded-xl py-2.5 text-sm font-bold"
                      style={{
                        background: "linear-gradient(135deg, #004f39 0%, #006b4e 100%)",
                        color: "#FFFACA",
                      }}
                    >
                      🔑 Acceso Administrador
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
