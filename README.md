# FutLigam - Sistema de Gestión de Ligas de Fútbol Amateur

## 📋 Descripción

FutLigam es una plataforma SaaS moderna y profesional para la gestión integral de ligas de fútbol amateur. Permite a los presidentes de liga administrar equipos, jugadores, partidos y visualizar estadísticas en tiempo real.

## 🎯 Características Principales MVP

### 1. **Gestión de Ligas**
   - Crear y editar ligas
   - Configurar temporadas
   - Gestionar presidentes/administradores

### 2. **Gestión de Equipos**
   - Crear/editar/eliminar equipos
   - Asignar gerentes y entrenadores
   - Cargar logos de equipos
   - Registrar información del campo

### 3. **Gestión de Jugadores**
   - Registrar jugadores por equipo
   - Asignar números de camiseta
   - Registrar posiciones
   - Subir fotos de jugadores
   - Datos personales (nombre, fecha nacimiento, documento)

### 4. **Gestión de Partidos/Jornadas**
   - Crear calendario de partidos
   - Registrar resultados
   - Asignar árbitros
   - Estados: programado, en vivo, finalizado, pospuesto, cancelado

### 5. **Estadísticas**
   - Registrar goles por jugador
   - Asistencias
   - Tarjetas amarillas/rojas
   - Minutos jugados

### 6. **Vistas Públicas**
   - Tabla de posiciones automática
   - Ranking de goleadores
   - Calendario de partidos

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+
- **Components**: Shadcn UI
- **Forms**: React Hook Form + Zod

### Backend/BaaS
- **Database**: PostgreSQL (vía Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime (opcional)

### DevTools
- **Language**: TypeScript
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier

## 📁 Estructura de Carpetas

```
fut_brian/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio (pública)
│   ├── dashboard/               # Área protegida
│   │   ├── layout.tsx           # Layout del dashboard
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── ligams/              # Gestión de ligas
│   │   ├── equipos/             # Gestión de equipos
│   │   ├── jugadores/           # Gestión de jugadores
│   │   └── partidos/            # Gestión de partidos
│   ├── [league]/                # Rutas públicas de liga
│   │   ├── standings/           # Tabla de posiciones
│   │   ├── scorers/             # Tabla de goleadores
│   │   └── matches/             # Calendario de partidos
│   └── api/                     # API Routes
│       └── auth/                # Rutas de autenticación
├── components/                  # Componentes reutilizables
│   ├── ui/                      # Componentes UI base (Shadcn)
│   ├── dashboard/               # Componentes del dashboard
│   ├── forms/                   # Formularios
│   └── layout/                  # Componentes de layout (Nav, Footer)
├── lib/                         # Lógica y utilidades
│   ├── supabase/               # Cliente y funciones de Supabase
│   │   └── client.ts           # Instancias del cliente
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useAuth.ts          # Hook de autenticación
│   │   └── useLeague.ts        # Hook de ligas
│   ├── context/                # Contexto de React
│   ├── services/               # Servicios (lógica de negocio)
│   │   └── api.ts              # Funciones de API
│   ├── types/                  # Tipos TypeScript
│   │   └── index.ts            # Definiciones de tipos
│   └── utils/                  # Funciones utilitarias
│       └── cn.ts               # Utilidad para clases Tailwind
├── styles/                     # Estilos globales
│   └── globals.css             # Estilos globales con Tailwind
├── public/                     # Archivos estáticos
├── database_schema.sql         # Esquema PostgreSQL
├── package.json                # Dependencias del proyecto
├── tsconfig.json               # Configuración TypeScript
├── next.config.js              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind
├── postcss.config.js           # Configuración de PostCSS
└── .env.example                # Variables de entorno (ejemplo)
```

## 🚀 Configuración Inicial

### 1. **Clonar el repositorio**
```bash
cd fut_brian
```

### 2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus credenciales de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
```

### 4. **Crear la base de datos en Supabase**
1. Accede a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a SQL Editor
4. Copia y ejecuta el contenido de `database_schema.sql`

### 5. **Configurar autenticación en Supabase**
1. Ve a Authentication > Providers
2. Habilita Email/Password
3. Configura las URL de redireccionamiento:
   - `http://localhost:3000` (desarrollo)
   - Tu URL de producción

### 6. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Dependencias Principales

### Autenticación y Base de Datos
- `@supabase/supabase-js`: Cliente de Supabase
- `@supabase/auth-helpers-nextjs`: Helpers de autenticación para Next.js

### UI y Estilos
- `tailwindcss`: Framework de CSS
- `lucide-react`: Iconos SVG
- `clsx` / `tailwind-merge`: Utilidades de clases CSS

### Formularios y Validación
- `react-hook-form`: Gestión de formularios
- `zod`: Validación de esquemas
- `@hookform/resolvers`: Resolvers para react-hook-form

### State Management
- `zustand`: State management minimalista (opcional)
- `react-query`: Gestión de datos del servidor

### Utilidades
- `date-fns`: Utilidades de fechas
- `sonner`: Toast notifications
- `next-themes`: Soporte para temas oscuro/claro

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### `leagues`
- Liga/torneo
- Presidente
- Configuración de temporada

#### `teams`
- Equipos participantes
- Información de gerente/entrenador
- Logo y estadio

#### `players`
- Jugadores
- Asignación a equipo y número de camiseta
- Información personal

#### `matches`
- Partidos/jornadas
- Resultado
- Estado

#### `match_statistics`
- Estadísticas por jugador en cada partido
- Goles, asistencias, tarjetas, minutos

#### `user_roles`
- Permisos de usuarios en ligas
- Roles: presidente, administrador, gerente, árbitro, visor

### Vistas (Views)

#### `league_standings`
- Tabla de posiciones automática
- Calcula puntos, diferencia de goles, etc.

#### `top_scorers`
- Ranking de goleadores por liga

## 🔐 Seguridad

- **Row Level Security (RLS)**: Políticas de seguridad en base de datos (incluidas en schema.sql, comentadas)
- **Autenticación**: Supabase Auth
- **Variables de entorno**: Claves sensibles en `.env.local`

## 🎨 Diseño

### Paleta de Colores
- **Primary (Verde Profesional)**: Verde CSS profesional (#22c55e para el fondo)
- **Secundario**: Blancos y grises claros
- **Texto**: Gris oscuro/negro para máxima legibilidad

### Tipografía
- **Font**: Inter (sans-serif)
- **Responsive**: Diseño mobile-first

## 📱 Responsive Design

Tailwind CSS breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚢 Deployment

### Opciones recomendadas:
- **Vercel**: Deployment automático con Next.js
- **Netlify**: Alternative a Vercel
- **Self-hosted**: Docker + cualquier servidor

### Pasos para Vercel:
1. Push tu código a GitHub
2. Conecta tu repositorio a Vercel
3. Añade las variables de entorno
4. Deploy automático en cada push a main

## 📚 Próximos Pasos Recomendados

1. **Implementar autenticación completa**
   - SignUp, SignIn, SignOut, Reset Password

2. **Dashboard principal**
   - Overview de ligas
   - Últimos partidos
   - Estadísticas principales

3. **CRUD de Ligas**
   - Crear nueva liga
   - Editar información
   - Ver detalles

4. **CRUD de Equipos**
   - Gestión completa de equipos por liga

5. **CRUD de Jugadores**
   - Asignación a equipos
   - Gestión de números de camiseta

6. **Gestión de Partidos**
   - Crear calendario
   - Registrar resultados
   - Grabar estadísticas

7. **Vistas Públicas**
   - Tabla de posiciones
   - Goleadores
   - Calendario público

8. **Mejoras adicionales**
   - Notificaciones
   - Upload de imágenes a Supabase Storage
   - Búsqueda avanzada
   - Exportación de reportes

## 🐛 Troubleshooting

### Error de conexión a Supabase
- Verifica las variables de entorno en `.env.local`
- Asegúrate de que la URL y las claves son correctas
- Comprueba que el proyecto Supabase está activo

### Problemas con estilos
- Ejecuta `npm run build` para regenerar CSS
- Limpia `.next/` y ejecuta `npm run dev` nuevamente

### Error de tipos TypeScript
- Ejecuta `npm run type-check`
- Asegúrate de que los tipos están correctamente importados

## 📞 Soporte y Contribución

Este es un MVP. Siéntete libre de:
- Reportar issues
- Proponer mejoras
- Hacer pull requests

## 📄 Licencia

MIT License

---

**Creado con ❤️ para las ligas de fútbol amateur**
