import { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FutLigaBrian — Gestión Profesional de Ligas de Fútbol",
  description:
    "FutLigaBrian: la plataforma profesional para gestionar ligas de fútbol amateur. Controla equipos, jugadores, partidos y estadísticas en tiempo real.",
  keywords:
    "fútbol, ligas amateur, gestión deportiva, calendario, estadísticas, FutLigaBrian",
  authors: [{ name: "Brian" }],
  creator: "Brian",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "FutLigaBrian",
    title: "FutLigaBrian — Gestión de Ligas de Fútbol",
    description: "Plataforma profesional para la gestión de ligas de fútbol amateur.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FutLigaBrian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutLigaBrian",
    description: "Gestión profesional de ligas de fútbol amateur",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>{children}</body>
    </html>
  );
}
