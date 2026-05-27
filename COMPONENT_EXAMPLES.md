// Ejemplos de Componentes Clave - FutLigam
// Estos son ejemplos base para que empieces a desarrollar

// ============================================================================
// EJEMPLO 1: Componente de Tabla Reutilizable
// ============================================================================

// components/ui/table.tsx
import React from "react";

interface TableProps {
  headers: string[];
  rows: (string | number)[][];
  className?: string;
}

export const Table = ({ headers, rows, className = "" }: TableProps) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-6 py-4 text-sm text-gray-600"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// EJEMPLO 2: Componente de Card
// ============================================================================

// components/ui/card.tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = "" }: CardProps) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      )}
      {children}
    </div>
  );
};

// ============================================================================
// EJEMPLO 3: Componente de Standings (Tabla de Posiciones)
// ============================================================================

// components/dashboard/LeagueStandings.tsx
'use client';

import { Table } from "@/components/ui/table";
import type { LeagueStanding } from "@/lib/types";

interface LeagueStandingsProps {
  standings: LeagueStanding[];
  loading?: boolean;
}

export function LeagueStandings({ standings, loading = false }: LeagueStandingsProps) {
  if (loading) {
    return <div className="text-center py-8">Cargando tabla de posiciones...</div>;
  }

  if (!standings.length) {
    return <div className="text-center py-8 text-gray-500">No hay datos</div>;
  }

  const headers = ["Pos.", "Equipo", "PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"];
  const rows = standings.map((team) => [
    team.position,
    team.name,
    team.played_matches,
    team.wins,
    team.draws,
    team.losses,
    team.goals_for,
    team.goals_against,
    team.goal_difference,
    team.points,
  ]);

  return <Table headers={headers} rows={rows} />;
}

// ============================================================================
// EJEMPLO 4: Hook personalizado para Ligas
// ============================================================================

// lib/hooks/useLeagueDetail.ts
'use client';

import { useCallback, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { League } from "@/lib/types";

export const useLeagueDetail = (leagueId: string) => {
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("leagues")
          .select("*")
          .eq("id", leagueId)
          .single();

        if (error) throw error;
        setLeague(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error desconocido");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchLeague();
    }
  }, [leagueId, supabase]);

  const updateLeague = useCallback(
    async (updates: Partial<League>) => {
      try {
        const { data, error } = await supabase
          .from("leagues")
          .update(updates)
          .eq("id", leagueId)
          .select()
          .single();

        if (error) throw error;
        setLeague(data);
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error al actualizar");
        setError(error);
        return { success: false, error };
      }
    },
    [leagueId, supabase]
  );

  return { league, loading, error, updateLeague };
};

// ============================================================================
// EJEMPLO 5: Formulario con React Hook Form + Zod
// ============================================================================

// components/forms/LeagueForm.tsx
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const leagueFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  season_year: z.coerce
    .number()
    .min(2020)
    .max(new Date().getFullYear() + 1),
});

type LeagueFormValues = z.infer<typeof leagueFormSchema>;

interface LeagueFormProps {
  onSubmit: (data: LeagueFormValues) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<LeagueFormValues>;
}

export function LeagueForm({ onSubmit, isLoading = false, defaultValues }: LeagueFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueFormValues>({
    resolver: zodResolver(leagueFormSchema),
    defaultValues,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (data: LeagueFormValues) => {
    try {
      setSubmitting(true);
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Nombre *</label>
        <input
          {...register("name")}
          type="text"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Ej: Liga Regional de Fútbol"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Descripción</label>
        <textarea
          {...register("description")}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          rows={3}
          placeholder="Descripción de la liga..."
        />
      </div>

      {/* País */}
      <div>
        <label className="block text-sm font-medium text-gray-900">País</label>
        <input
          {...register("country")}
          type="text"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Ej: Colombia"
        />
      </div>

      {/* Ciudad */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Ciudad</label>
        <input
          {...register("city")}
          type="text"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Ej: Bogotá"
        />
      </div>

      {/* Año de Temporada */}
      <div>
        <label className="block text-sm font-medium text-gray-900">Año de Temporada</label>
        <input
          {...register("season_year")}
          type="number"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          defaultValue={new Date().getFullYear()}
        />
        {errors.season_year && (
          <p className="mt-1 text-sm text-red-600">{errors.season_year.message}</p>
        )}
      </div>

      {/* Botón Submit */}
      <Button
        type="submit"
        disabled={isLoading || submitting}
        className="w-full bg-primary-600 text-white hover:bg-primary-700"
      >
        {submitting || isLoading ? "Guardando..." : "Crear Liga"}
      </Button>
    </form>
  );
}

// ============================================================================
// EJEMPLO 6: Componente Dashboard Principal
// ============================================================================

// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!user) return;
      
      try {
        // Aquí irá la lógica para obtener ligas del usuario
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching leagues:", error);
        setDataLoading(false);
      }
    };

    fetchLeagues();
  }, [user]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Por favor, inicia sesión</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user.email?.split("@")[0]}
        </h1>
        <p className="mt-2 text-gray-600">
          Aquí puedes gestionar tus ligas de fútbol
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">0</p>
            <p className="mt-2 text-gray-600">Ligas Activas</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">0</p>
            <p className="mt-2 text-gray-600">Equipos</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">0</p>
            <p className="mt-2 text-gray-600">Jugadores</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">0</p>
            <p className="mt-2 text-gray-600">Partidos</p>
          </div>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card title="Acciones Rápidas">
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-primary-600">
            <Link href="/dashboard/ligams">Crear Liga</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/ligams">Ver Ligas</Link>
          </Button>
        </div>
      </Card>

      {/* Ligas Recientes */}
      <Card title="Tus Ligas">
        {leagues.length === 0 ? (
          <p className="text-gray-600">
            Aún no tienes ligas. 
            <Button asChild variant="link" className="ml-2">
              <Link href="/dashboard/ligams">Crear una ahora</Link>
            </Button>
          </p>
        ) : (
          <div className="space-y-4">
            {/* Aquí irán las ligas */}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================================
// EJEMPLO 7: Componente de Modal/Dialog
// ============================================================================

// components/ui/dialog.tsx
import React from "react";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: DialogProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`${sizeClasses[size]} w-full rounded-lg bg-white shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
// En tu componente:
import { Dialog } from "@/components/ui/dialog";

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
      
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crear Nueva Liga"
        size="lg"
      >
        <LeagueForm
          onSubmit={async (data) => {
            // Handle submit
            setIsOpen(false);
          }}
        />
      </Dialog>
    </>
  );
}
*/
