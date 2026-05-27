"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CheckCircle2, ShieldCheck, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await signIn(email.trim(), password.trim());
      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMsg(res.error?.message || "Ocurrió un error al iniciar sesión.");
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#052e16] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-950 via-zinc-950 to-black text-zinc-100">
      <Nav />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card Glassmorphic */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-900/30 bg-zinc-950/40 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/20">
            {/* Glowing Accent */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Acceso al panel administrativo de FutLigam
              </p>
            </div>

            {/* Banner Informativo Demo */}
            <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-bold text-emerald-400">Acceso de Demostración:</span>
                  <div className="mt-1 font-mono text-zinc-300 flex flex-col gap-0.5">
                    <div>Usuario: <span className="text-white bg-emerald-950 px-1 py-0.5 rounded">admin</span></div>
                    <div>Contraseña: <span className="text-white bg-emerald-950 px-1 py-0.5 rounded">admin</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Usuario o Correo Electrónico
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                  </span>
                ) : (
                  "Ingresar al Panel"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-zinc-500">
              ¿Quieres ver las estadísticas de la liga sin iniciar sesión?
              <div className="mt-2">
                <Link
                  href="/liga"
                  className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition"
                >
                  Ir a la Vista Pública de Jugadores →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
