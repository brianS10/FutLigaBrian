# Guía de Instalación y Configuración - FutLigam

## 📋 Requisitos Previos

- Node.js 18.17+ o superior
- npm, yarn, pnpm o bun
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Git (para control de versiones)
- Editor de código (VSCode recomendado)

## 🔧 Instalación Paso a Paso

### 1. Crear Proyecto en Supabase

#### 1.1 Registrarse en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub o correo
4. Crea una organización (si es la primera vez)

#### 1.2 Crear un Proyecto
1. Haz clic en "New project"
2. Selecciona tu organización
3. Asigna un nombre: `fut-ligam` (ejemplo)
4. Elige una región cercana a ti
5. Genera una contraseña fuerte para postgres
6. Espera a que se cree el proyecto (2-3 minutos)

#### 1.3 Obtener Credenciales
1. Ve a Project Settings > API
2. Copia:
   - **URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Guárdalo seguro (para funciones de servidor)

### 2. Configurar Base de Datos

#### 2.1 Crear Tablas
1. En Supabase, ve a SQL Editor
2. Haz clic en "+ New Query"
3. Copia todo el contenido de `database_schema.sql`
4. Pégalo en el editor
5. Haz clic en "Run" (esquina inferior derecha)

✅ Verifica que todas las tablas se hayan creado:
- Ve a Database > Tables
- Deberías ver: `leagues`, `teams`, `players`, `matches`, `match_statistics`, `user_roles`
- Deberías ver las vistas: `league_standings`, `top_scorers`

### 3. Configurar Autenticación

#### 3.1 Email/Password Auth
1. Ve a Authentication > Providers
2. Busca "Email" y asegúrate de que esté habilitado
3. Click en el toggle si está deshabilitado

#### 3.2 Configurar URLs de Redirección
1. Ve a Authentication > URL Configuration
2. En "Site URL", ingresa:
   - Desarrollo: `http://localhost:3000`
   - Producción: tu dominio final
3. En "Redirect URLs", añade:
   - `http://localhost:3000/auth/callback`
   - tu dominio + `/auth/callback` (producción)

#### 3.3 Email Templates (Opcional)
1. Ve a Authentication > Email Templates
2. Personaliza los emails de:
   - Confirm signup
   - Magic Link
   - Reset Password

### 4. Configurar el Proyecto Next.js

#### 4.1 Variables de Entorno
```bash
# En la raíz del proyecto, crea o edita .env.local
cp .env.example .env.local
```

Completa el archivo con:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FutLigam

# Opcional
NEXT_PUBLIC_ENABLE_DEBUG=true
```

#### 4.2 Instalar Dependencias
```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

#### 4.3 Verificar Instalación
```bash
npm run type-check
npm run lint
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Accede a: `http://localhost:3000`

## 🏗️ Arquitectura de la Aplicación

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                      Navegador (Cliente)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js App Router (React Components)              │  │
│  │  - Pages (app/)                                     │  │
│  │  - Components (components/)                         │  │
│  │  - Hooks (lib/hooks/)                               │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase (Backend as a Service)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │  - Tablas (leagues, teams, players, matches, etc.)  │  │
│  │  - Vistas (league_standings, top_scorers)           │  │
│  │  - RLS Policies (Seguridad)                         │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase Auth                                       │  │
│  │  - Email/Password                                    │  │
│  │  - Sessions                                          │  │
│  │  - JWT Tokens                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Storage (Futuro para fotos)                         │  │
│  │  - Logos de equipos                                  │  │
│  │  - Fotos de jugadores                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Stack de Componentes

```
FRONTEND LAYER
├── Pages (app/) - Rutas de Next.js
├── Components (components/)
│   ├── UI - Componentes base (Button, Input, etc.)
│   ├── Forms - Formularios especializados
│   ├── Dashboard - Componentes del dashboard
│   └── Layout - Navbar, Footer, Sidebar
├── Hooks (lib/hooks/) - React hooks personalizados
│   ├── useAuth - Autenticación
│   ├── useLeague - Gestión de ligas
│   └── Custom hooks
└── Styles (styles/)

BUSINESS LOGIC LAYER
├── Services (lib/services/)
│   └── api.ts - Llamadas a Supabase
├── Types (lib/types/)
│   └── index.ts - Definiciones TypeScript
├── Context (lib/context/)
│   └── Contexto de React global
└── Utils (lib/utils/)
    └── Funciones utilitarias

DATA ACCESS LAYER
├── Supabase Client (lib/supabase/)
│   └── client.ts - Instancias del cliente
└── Database
    └── PostgreSQL en Supabase
```

## 🔑 Flujo de Autenticación

```
1. Usuario en /auth/signup
   ↓
2. Completa formulario (email, password)
   ↓
3. Envía a Supabase Auth
   ↓
4. Supabase crea usuario en auth.users
   ↓
5. Envía email de confirmación (si está configurado)
   ↓
6. Usuario confirma email (click en enlace)
   ↓
7. Usuario puede iniciar sesión
   ↓
8. Token JWT se almacena en cookies seguras
   ↓
9. Accede a dashboard protegido
```

## 🔒 Seguridad

### Buenas Prácticas Implementadas

1. **Variables de Entorno**
   - Todas las credenciales en `.env.local`
   - Nunca commitear `.env.local` a git

2. **Autenticación**
   - JWT tokens en cookies secure
   - Session management con Supabase

3. **CORS y Seguridad HTTP**
   - Encabezados de seguridad en next.config.js
   - Content-Security-Policy

4. **Base de Datos**
   - Row Level Security (RLS) en las políticas comentadas
   - Validaciones en trigger de base de datos

### Implementar RLS (Producción)

Descomenta las políticas de seguridad en `database_schema.sql`:

```sql
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
-- ... más políticas
```

Esto asegura que:
- Solo los miembros de una liga ven sus datos
- Solo presidentes pueden editar ligas
- Los datos están protegidos a nivel de BD

## 📊 Diagrama de Base de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                       DATABASE SCHEMA                         │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  LEAGUES              TEAMS                PLAYERS           │
│  ├─ id              ├─ id                ├─ id              │
│  ├─ name            ├─ league_id ────┬──┤─ team_id ────┐   │
│  ├─ president_id    ├─ name          │  ├─ league_id   │   │
│  ├─ season_year     ├─ logo_url      │  ├─ first_name  │   │
│  └─ status          └─ status        │  ├─ jersey_no.  │   │
│                                      │  └─ position    │   │
│                                      │                  │   │
│                    MATCHES ◄─────────┘                  │   │
│                    ├─ id                                │   │
│                    ├─ home_team_id                      │   │
│                    ├─ away_team_id                      │   │
│                    ├─ match_date                        │   │
│                    ├─ home_goals                        │   │
│                    ├─ away_goals                        │   │
│                    └─ status                            │   │
│                         │                                │   │
│                         └────────────┬───────────────────┘   │
│                                      │                       │
│                       MATCH_STATISTICS                       │
│                       ├─ id                                  │
│                       ├─ match_id                            │
│                       ├─ player_id                           │
│                       ├─ goals                               │
│                       ├─ assists                             │
│                       ├─ yellow_cards                        │
│                       └─ red_cards                           │
│                                                              │
│  USER_ROLES                                                  │
│  ├─ id                                                       │
│  ├─ user_id (auth.users)                                    │
│  ├─ league_id                                               │
│  └─ role (president|admin|manager|referee|viewer)           │
│                                                              │
│  VIEWS:                                                      │
│  • league_standings - Tabla de posiciones calculada         │
│  • top_scorers - Top 10 goleadores                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🧪 Testing

### Testing Básico de Conexión

1. **Verifica Supabase connection**
```bash
npm run type-check
```

2. **Prueba el servidor de desarrollo**
```bash
npm run dev
# Visita http://localhost:3000
```

3. **Verifica la página de inicio**
```
✅ Logo FutLigam visible
✅ Botones de Sign Up / Sign In
✅ Sección de características visible
✅ Responsive en mobile
```

## 🚀 Próximas Fases de Desarrollo

### Fase 1 (Semana 1)
- [ ] Sistema de autenticación completo
- [ ] Dashboard básico
- [ ] CRUD de ligas

### Fase 2 (Semana 2)
- [ ] Gestión de equipos
- [ ] Gestión de jugadores
- [ ] Subida de imágenes

### Fase 3 (Semana 3)
- [ ] Gestión de partidos
- [ ] Registro de estadísticas
- [ ] Tabla de posiciones

### Fase 4 (Semana 4)
- [ ] Vistas públicas
- [ ] Exportación de reportes
- [ ] Email notifications
- [ ] Deployment a producción

## 🐛 Debugging

### Habilitar Modo Debug
En `.env.local`:
```
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Logs en Console
```typescript
// En componentes
console.log('Data:', data);
console.error('Error:', error);
```

### Inspeccionar Base de Datos
1. Ve a Supabase > SQL Editor
2. Ejecuta queries para revisar datos:
```sql
SELECT * FROM leagues;
SELECT * FROM teams WHERE league_id = 'xxx';
```

### DevTools de Next.js
```bash
# Usa React DevTools (Chrome extension)
# Inspecciona componentes y props
```

## 📞 Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI Docs](https://ui.shadcn.com)

## ✅ Checklist de Setup

- [ ] Cuenta de Supabase creada
- [ ] Proyecto Supabase creado
- [ ] Base de datos schema importada
- [ ] URLs de redirección configuradas
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas (npm install)
- [ ] Servidor de desarrollo corriendo (npm run dev)
- [ ] Página de inicio cargando correctamente
- [ ] TypeScript sin errores (npm run type-check)
- [ ] Código linting correcto (npm run lint)

---

**¡Estás listo para comenzar el desarrollo! 🚀**
