# Arquitectura Técnica - FutLigam

## 📐 Visión General de Arquitectura

FutLigam utiliza una arquitectura moderna **BaaS (Backend as a Service)** con Supabase, combinada con **Next.js App Router** para el frontend. Este enfoque proporciona:

✅ Escalabilidad automática
✅ Seguridad a nivel enterprise
✅ Mantenimiento reducido
✅ Costo-efectividad (gratuito hasta ciertos límites)
✅ Time-to-market rápido

## 🏛️ Layers de la Aplicación

### Capa 1: Presentation (UI/UX)
**Ubicación**: `app/`, `components/`

```
Presentation Layer
├── Pages (app/page.tsx, app/dashboard/...)
├── Components
│   ├── Smart Components (conectados a datos)
│   └── Dumb Components (presentación pura)
├── Layouts
│   ├── RootLayout
│   ├── DashboardLayout
│   └── PublicLayout
└── Styles
    └── Tailwind CSS + Custom CSS
```

**Responsabilidades**:
- Renderizado de UI
- Manejo de interacciones de usuario
- Validación en cliente (UI)
- Responsiveness

**Tecnologías**:
- React 18+ (Server & Client Components)
- Next.js 14+ (App Router)
- Tailwind CSS
- Shadcn UI Components

### Capa 2: Business Logic
**Ubicación**: `lib/hooks/`, `lib/services/`, `lib/context/`

```
Business Logic Layer
├── Hooks (Custom React Hooks)
│   ├── useAuth - Manejo de autenticación
│   ├── useLeague - Gestión de ligas
│   └── Custom Hooks (useTeam, usePlayer, etc.)
├── Services (Lógica de negocio)
│   ├── api.ts - Funciones de acceso a datos
│   ├── calculations.ts - Lógica de cálculos
│   └── transformations.ts - Transformación de datos
├── Context (Estado global)
│   ├── AuthContext - Usuario autenticado
│   └── LeagueContext - Liga seleccionada
└── Utils
    ├── formatters.ts - Formato de datos
    ├── validators.ts - Validaciones
    └── helpers.ts - Funciones utilitarias
```

**Responsabilidades**:
- Lógica de negocio
- Manejo de estado
- Cálculos y transformaciones
- Orquestación de servicios

**Patrones**:
- Custom Hooks para lógica reutilizable
- Context API para estado global
- Composición sobre herencia

### Capa 3: Data Access
**Ubicación**: `lib/supabase/`, `lib/types/`, `lib/services/`

```
Data Access Layer
├── Supabase Client
│   ├── createClient() - Cliente navegador
│   └── createServerSupabaseClient() - Cliente servidor
├── Database Functions
│   ├── getLeagues()
│   ├── createTeam()
│   ├── updateMatch()
│   └── Query Builders
├── Type Definitions
│   ├── Database Types
│   ├── API Types
│   └── Form Types
└── Constants
    ├── Query Keys (para React Query)
    └── Enums
```

**Responsabilidades**:
- Comunicación con Supabase
- Transformación de datos Raw → Types
- Caching y estado de datos
- Manejo de errores

### Capa 4: Backend/Database
**Ubicación**: Supabase (PostgreSQL)

```
Backend Layer (Supabase)
├── PostgreSQL Database
│   ├── Tables
│   │   ├── leagues
│   │   ├── teams
│   │   ├── players
│   │   ├── matches
│   │   ├── match_statistics
│   │   └── user_roles
│   ├── Views
│   │   ├── league_standings
│   │   └── top_scorers
│   ├── Functions
│   ├── Triggers
│   └── Policies (RLS)
├── Authentication
│   ├── JWT Tokens
│   ├── Session Management
│   └── Email Verification
└── Storage
    ├── Logos de equipos
    └── Fotos de jugadores
```

**Responsabilidades**:
- Persistencia de datos
- Validaciones en BD
- Row Level Security
- Cálculos complejos (vistas)

## 🔄 Flujos de Datos

### Flujo de Lectura (Query)

```
User Action (click)
    ↓
Component Handler
    ↓
Custom Hook (useLeague)
    ↓
Service Function (getLeagues)
    ↓
Supabase Client.from('leagues').select()
    ↓
PostgreSQL Query
    ↓
Datos JSON
    ↓
Component Re-render
    ↓
UI Actualizada
```

### Flujo de Escritura (Mutation)

```
User Submits Form
    ↓
Form Validation (Zod)
    ↓
Component Handler
    ↓
Custom Hook (createLeague)
    ↓
Service Function (createLeague en Supabase)
    ↓
Supabase Client.from('leagues').insert()
    ↓
Database Validation + RLS Check
    ↓
INSERT/UPDATE/DELETE en PostgreSQL
    ↓
Response JSON
    ↓
Update Local State
    ↓
Show Toast/Notification
    ↓
UI Actualizada
```

## 🔐 Seguridad

### Niveles de Seguridad

#### Nivel 1: Navegador (Cliente)
```typescript
// Validación de formularios
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Type-safe con TypeScript
interface League {
  id: string;
  name: string;
}
```

#### Nivel 2: Aplicación (Next.js)
```typescript
// Middleware de autenticación
export async function middleware(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return redirect('/auth/signin');
  }
}

// API Routes protegidas
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return unauthorized();
}
```

#### Nivel 3: JWT/Sesión
```typescript
// JWT en cookies secure
supabase.auth.signInWithPassword({...});
// Token automáticamente guardado en cookie secure
```

#### Nivel 4: Base de Datos (Row Level Security)
```sql
-- Solo el presidente puede editar su liga
CREATE POLICY "edit_league_if_president" ON leagues
  FOR UPDATE
  USING (president_id = auth.uid())
  WITH CHECK (president_id = auth.uid());
```

### Secretos y Configuración

```
.env.local (NUNCA en git)
├── NEXT_PUBLIC_SUPABASE_URL ✅ Público
├── NEXT_PUBLIC_SUPABASE_ANON_KEY ✅ Público (limitado)
└── DATABASE_URL ❌ Secreto (server-side only)

.env.example (Plantilla)
└── Muestra estructura sin valores sensibles
```

## 🎯 Patrones de Diseño Implementados

### 1. Server Components vs Client Components

```typescript
// Server Component (app/dashboard/page.tsx)
export default async function Dashboard() {
  // Acceso directo a BD
  const leagues = await getLeaguesByUser();
  return <DashboardContent leagues={leagues} />;
}

// Client Component (components/dashboard/LeagueForm.tsx)
'use client';
export function LeagueForm() {
  const { createLeague } = useLeague();
  // State, interactividad
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 2. Custom Hooks para Lógica Reutilizable

```typescript
// lib/hooks/useLeague.ts
export const useLeague = () => {
  const [leagues, setLeagues] = useState([]);
  
  const fetchLeagues = useCallback(async () => {
    const data = await leagueService.getAll();
    setLeagues(data);
  }, []);
  
  return { leagues, fetchLeagues };
};
```

### 3. Service Layer para Lógica de Negocio

```typescript
// lib/services/api.ts
export async function getLeagueStandings(leagueId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('league_standings')
    .select('*')
    .eq('league_id', leagueId)
    .order('position');
  return data;
}
```

### 4. Type-Safe con TypeScript

```typescript
// lib/types/index.ts
export interface League {
  id: string;
  name: string;
  // ... propiedades tipadas
}

// Uso en componentes
const league: League = {
  id: 'uuid',
  name: 'Mi Liga',
  // TypeScript te ayuda a no olvidar propiedades
};
```

### 5. Form Validation con Zod + React Hook Form

```typescript
const leagueSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  season_year: z.number().min(2020),
});

type LeagueFormInput = z.infer<typeof leagueSchema>;

export function LeagueForm() {
  const { register, handleSubmit } = useForm<LeagueFormInput>({
    resolver: zodResolver(leagueSchema),
  });
  // ...
}
```

## 📊 Estado de la Aplicación

### Dónde vivir el estado

```
┌─────────────────────────────────────────────┐
│ Estado Global (Persistente)                 │
├─────────────────────────────────────────────┤
│ • Usuario autenticado (Auth Context)        │
│ • Liga seleccionada (League Context)        │
│ • Permisos/Roles                            │
│ Ubicación: localStorage + Context API       │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Estado de Servidor (DB)                     │
├─────────────────────────────────────────────┤
│ • Ligas, Equipos, Jugadores, Partidos      │
│ • Estadísticas                              │
│ • Información de usuario                    │
│ Ubicación: Supabase PostgreSQL              │
└─────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────┐
│ Estado Local (Temporal)                     │
├─────────────────────────────────────────────┤
│ • Form inputs (antes de submit)             │
│ • Modals (abierto/cerrado)                  │
│ • Filtros UI (search, sort)                 │
│ • Loading states                            │
│ Ubicación: React State (useState)           │
└─────────────────────────────────────────────┘
```

## 🚀 Escalabilidad

### Horizontal Scaling
- Supabase maneja automáticamente
- PostgreSQL con replicación
- CDN integrado para assets

### Vertical Scaling
- Next.js con ISR (Incremental Static Regeneration)
- Caching inteligente
- Índices de BD optimizados

### Optimizaciones Implementadas

```typescript
// 1. Code Splitting automático en Next.js
// Cada página es su propio bundle

// 2. Image Optimization
import Image from 'next/image';
<Image src="..." width={800} height={600} />

// 3. Static Generation donde es posible
export const revalidate = 3600; // ISR - revalidar cada hora

// 4. Índices en BD para queries comunes
CREATE INDEX idx_teams_league_id ON teams(league_id);

// 5. Lazy loading de componentes
const DashboardChart = dynamic(() => import('./Chart'));
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
// Funciones utilitarias
test('calculatePoints calculates correctly', () => {
  expect(calculatePoints(3, 0)).toBe(9); // 3 wins * 3 points
});
```

### Integration Testing
```typescript
// Servicios
test('getLeagueStandings returns sorted data', async () => {
  const standings = await getLeagueStandings(leagueId);
  expect(standings[0].position).toBe(1);
});
```

### E2E Testing
```typescript
// Flujos completos de usuario
test('User can create a league', async () => {
  // Login
  // Go to create league
  // Fill form
  // Submit
  // Verify in standings
});
```

## 🔧 Deployment Architecture

### Desarrollo
```
Local Machine
    ↓
npm run dev
    ↓
localhost:3000
```

### Staging
```
GitHub (rama staging)
    ↓
Vercel Deploy (preview)
    ↓
staging.futligam.com
```

### Producción
```
GitHub (main branch)
    ↓
Vercel Deploy (automatic)
    ↓
futligam.com
    ↓
Supabase PostgreSQL (production tier)
```

### CDN y Static Assets
```
Next.js Image Optimization
    ↓
Vercel Edge Network
    ↓
Usuarios de todo el mundo reciben rápido
```

## 📈 Monitoreo

### Logs
- Supabase logs (Authentication, Database)
- Vercel logs (Deploy, Runtime errors)
- Browser console logs (Development)

### Métricas
- Web Vitals (LCP, FID, CLS)
- Database query performance
- Authentication success rate
- Error tracking (Sentry, LogRocket - opcional)

### Alertas
```yaml
# Ejemplos de alertas útiles
- Query más lenta de 500ms
- Authentication failure rate > 5%
- Deploy fallido
- Storage cerca del límite
```

## 🗺️ Roadmap Arquitectónico

### Phase 1 (MVP actual)
- Architecture básica con Supabase
- Authentication
- CRUD operations

### Phase 2
- Real-time updates (Supabase Realtime)
- Image upload (Supabase Storage)
- Notificaciones por email

### Phase 3
- WebSocket para live scores
- Push notifications
- Caching avanzado (Redis)

### Phase 4 (Enterprise)
- Multi-tenancy mejorado
- API pública
- Webhooks
- SSO (SAML, OAuth)

---

**Esta arquitectura es escalable, mantenible y sigue best practices modernas de desarrollo web. 🚀**
