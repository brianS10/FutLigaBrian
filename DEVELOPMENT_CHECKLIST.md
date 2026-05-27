# MVP Development Checklist - FutLigam

Este documento es tu guía paso a paso para completar el MVP de FutLigam.

## 📋 Fase 0: Setup & Configuración (Día 1)

### Backend Setup
- [ ] Crear cuenta en Supabase
- [ ] Crear proyecto Supabase
- [ ] Ejecutar script SQL (database_schema.sql)
- [ ] Verificar tablas creadas
- [ ] Configurar autenticación (Email/Password)
- [ ] Establecer URLs de redirección

### Frontend Setup
- [ ] Instalar dependencias (`npm install`)
- [ ] Configurar variables de entorno (.env.local)
- [ ] Ejecutar servidor de desarrollo (`npm run dev`)
- [ ] Verificar página de inicio cargando
- [ ] Verificar no hay errores TypeScript
- [ ] Verificar responsive design

### Control de Versiones
- [ ] Inicializar git
- [ ] Crear repositorio en GitHub
- [ ] Hacer primer commit

---

## 🔐 Fase 1: Autenticación (Día 2)

### Componentes de Autenticación
- [ ] Crear página `/auth/signin`
  - [ ] Formulario de email/password
  - [ ] Validación con Zod
  - [ ] Manejo de errores
  - [ ] Link a signup
  - [ ] Link a "Olvidé mi contraseña"

- [ ] Crear página `/auth/signup`
  - [ ] Formulario de registro
  - [ ] Validación de contraseña (min 8 caracteres)
  - [ ] Confirmación de contraseña
  - [ ] Términos y condiciones (checkbox)
  - [ ] Link a signin

- [ ] Crear página `/auth/forgot-password`
  - [ ] Formulario para reset
  - [ ] Confirmación de email enviado

- [ ] Crear página `/auth/reset-password`
  - [ ] Formulario nuevo password
  - [ ] Validación

### Middleware y Protección
- [ ] Crear middleware de autenticación
- [ ] Proteger rutas `/dashboard/*`
- [ ] Redirect a login si no autenticado
- [ ] Persist de sesión

### Hooks de Autenticación
- [ ] Mejorar `useAuth` hook
- [ ] Crear `useProtectedRoute` hook
- [ ] Crear `useSession` hook

### Testing
- [ ] Probar signup exitoso
- [ ] Probar signin exitoso
- [ ] Probar reset de contraseña
- [ ] Probar protección de rutas

---

## 🏠 Fase 2: Dashboard Base (Día 3)

### Layout del Dashboard
- [ ] Crear `app/dashboard/layout.tsx`
- [ ] Sidebar con navegación
- [ ] Top navbar con usuario
- [ ] Logout button
- [ ] Responsive en mobile

### Página Principal del Dashboard
- [ ] Card con bienvenida del usuario
- [ ] Stats cards (ligas, equipos, jugadores, partidos)
- [ ] Link a crear liga
- [ ] Link a últimas acciones
- [ ] Estilo profesional verde

### Componentes Generales
- [ ] Sidebar component
- [ ] TopNav component
- [ ] Table component reutilizable
- [ ] Card component
- [ ] Badge component
- [ ] Toast/Alert component

---

## ⚽ Fase 3: Gestión de Ligas (Día 4-5)

### CRUD de Ligas
- [ ] Página `/dashboard/ligams` (listado)
  - [ ] Tabla de ligas
  - [ ] Botón "Crear Liga"
  - [ ] Editar liga (pencil icon)
  - [ ] Eliminar liga (trash icon)
  - [ ] Link a detalles

- [ ] Página `/dashboard/ligams/[id]` (detalle)
  - [ ] Información de la liga
  - [ ] Editar información
  - [ ] Tabs: Equipos, Jugadores, Partidos

- [ ] Modal/Form de crear liga
  - [ ] Nombre *
  - [ ] Descripción
  - [ ] País
  - [ ] Ciudad
  - [ ] Año de temporada

- [ ] Modal/Form de editar liga
  - [ ] Mismo formulario que crear
  - [ ] Pre-populado con datos

### Funcionalidad
- [ ] Hook `useLeague` para CRUD
- [ ] Servicio API para ligas
- [ ] Validación con Zod
- [ ] Manejo de errores
- [ ] Toast notifications (éxito/error)

### Vistas/Queries
- [ ] Query: ligas del usuario autenticado
- [ ] Query: liga por ID
- [ ] Mutation: crear liga
- [ ] Mutation: actualizar liga
- [ ] Mutation: eliminar liga

---

## 🏆 Fase 4: Gestión de Equipos (Día 6)

### CRUD de Equipos
- [ ] Página `/dashboard/equipos?league_id=xxx`
  - [ ] Tabla de equipos
  - [ ] Filtrado por liga
  - [ ] Botón "Agregar Equipo"
  - [ ] Editar equipo
  - [ ] Eliminar equipo

- [ ] Modal/Form de crear equipo
  - [ ] Nombre *
  - [ ] Gerente
  - [ ] Email del entrenador
  - [ ] Ciudad
  - [ ] Campo de juego
  - [ ] Año de fundación
  - [ ] Upload de logo (futuro)

- [ ] Modal/Form de editar equipo

### Funcionalidad
- [ ] Hook `useTeam` para CRUD
- [ ] Servicio API para equipos
- [ ] Validación
- [ ] Manejo de errores
- [ ] Lista de equipos por liga

### Vistas/Queries
- [ ] Query: equipos por liga
- [ ] Query: equipo por ID
- [ ] Mutation: crear equipo
- [ ] Mutation: actualizar equipo
- [ ] Mutation: eliminar equipo

---

## 👥 Fase 5: Gestión de Jugadores (Día 7)

### CRUD de Jugadores
- [ ] Página `/dashboard/jugadores?team_id=xxx`
  - [ ] Tabla de jugadores
  - [ ] Filtrado por equipo
  - [ ] Botón "Agregar Jugador"
  - [ ] Editar jugador
  - [ ] Eliminar jugador
  - [ ] Estados: Activo, Inactivo, Lesionado, Suspendido

- [ ] Modal/Form de crear jugador
  - [ ] Nombre *
  - [ ] Apellido *
  - [ ] Email
  - [ ] Teléfono
  - [ ] Número de camiseta (1-99)
  - [ ] Posición (GK, DEF, MID, FWD)
  - [ ] Fecha de nacimiento
  - [ ] Documento de identidad
  - [ ] Photo upload (futuro)

- [ ] Modal/Form de editar jugador

### Funcionalidad
- [ ] Hook `usePlayer` para CRUD
- [ ] Servicio API para jugadores
- [ ] Validación (número de camiseta único por equipo)
- [ ] Manejo de errores
- [ ] Lista de jugadores por equipo

### Vistas/Queries
- [ ] Query: jugadores por equipo
- [ ] Query: jugadores por liga
- [ ] Query: jugador por ID
- [ ] Mutation: crear jugador
- [ ] Mutation: actualizar jugador
- [ ] Mutation: eliminar jugador

---

## 📅 Fase 6: Gestión de Partidos (Día 8-9)

### CRUD de Partidos
- [ ] Página `/dashboard/partidos?league_id=xxx`
  - [ ] Tabla/Calendario de partidos
  - [ ] Vista: Lista, Calendario (futuro)
  - [ ] Filtrado por estado, fecha
  - [ ] Botón "Crear Partido"
  - [ ] Editar partido
  - [ ] Eliminar partido
  - [ ] Estados: Programado, En vivo, Finalizado, Cancelado, Pospuesto

- [ ] Modal/Form de crear partido
  - [ ] Liga *
  - [ ] Equipo Local *
  - [ ] Equipo Visitante *
  - [ ] Fecha/Hora del partido *
  - [ ] Jornada/Matchday
  - [ ] Lugar del partido
  - [ ] Árbitro

- [ ] Modal/Form de editar partido

- [ ] Componente para registrar resultado
  - [ ] Goles equipo local
  - [ ] Goles equipo visitante
  - [ ] Cambiar estado a "Finalizado"

### Funcionalidad
- [ ] Hook `useMatch` para CRUD
- [ ] Servicio API para partidos
- [ ] Validación (no mismo equipo local/visitante)
- [ ] Manejo de errores
- [ ] Lista de partidos por liga
- [ ] Ordenamiento por fecha

### Vistas/Queries
- [ ] Query: partidos por liga
- [ ] Query: partidos por fecha
- [ ] Query: partido por ID
- [ ] Mutation: crear partido
- [ ] Mutation: actualizar partido
- [ ] Mutation: eliminar partido

---

## 📊 Fase 7: Estadísticas de Partidos (Día 10-11)

### Registro de Estadísticas
- [ ] Página `/dashboard/partidos/[id]/stats`
  - [ ] Seleccionar jugador
  - [ ] Formulario para registrar:
    - [ ] Goles
    - [ ] Asistencias
    - [ ] Tarjetas amarillas
    - [ ] Tarjetas rojas
    - [ ] Minutos jugados

- [ ] Tabla de estadísticas por partido
  - [ ] Mostar todos los jugadores con sus stats
  - [ ] Editar stats
  - [ ] Eliminar stat

### Funcionalidad
- [ ] Hook `useMatchStatistics`
- [ ] Servicio API para estadísticas
- [ ] Validación (tarjetas max 2 amarillas o 1 roja)
- [ ] Manejo de errores

### Vistas/Queries
- [ ] Query: estadísticas por partido
- [ ] Query: estadísticas por jugador
- [ ] Mutation: crear estadística
- [ ] Mutation: actualizar estadística
- [ ] Mutation: eliminar estadística

---

## 📈 Fase 8: Vistas Públicas (Día 12-13)

### Tabla de Posiciones
- [ ] Página `/[league]/standings`
  - [ ] Mostrar tabla de posiciones automática
  - [ ] Columnas: Pos., Equipo, PJ, G, E, P, GF, GC, DG, Pts
  - [ ] Ordenada por puntos (desc)
  - [ ] Link a detalles del equipo
  - [ ] Responsivo

### Tabla de Goleadores
- [ ] Página `/[league]/scorers`
  - [ ] Top 10 goleadores
  - [ ] Columnas: Pos., Jugador, Equipo, Goles, Asistencias, PJ
  - [ ] Ordenada por goles (desc)
  - [ ] Link a detalles del jugador
  - [ ] Responsivo

### Calendario de Partidos
- [ ] Página `/[league]/matches`
  - [ ] Lista de todos los partidos
  - [ ] Filtrado por estado
  - [ ] Mostrar resultado si está finalizado
  - [ ] Detalles del partido con stats

### Página de Detalles
- [ ] Página `/[league]`
  - [ ] Información de la liga
  - [ ] Últimos partidos
  - [ ] Top goleadores
  - [ ] Próximos partidos

### Funcionalidad
- [ ] Queries para vistas públicas
- [ ] Caché de datos (ISR)
- [ ] Validar acceso público vs privado

---

## 🎨 Fase 9: Pulido y UX (Día 14-15)

### Diseño y Estilos
- [ ] Revisar paleta de colores (verdes profesionales)
- [ ] Consistencia en espaciados
- [ ] Tipografía uniforme
- [ ] Iconos consistentes (Lucide)
- [ ] Estados de hover/focus en inputs

### Animaciones
- [ ] Transiciones suaves en modales
- [ ] Fade in de componentes
- [ ] Loading states con spinners
- [ ] Skeleton loaders para data

### Validaciones
- [ ] Mensajes de error claros
- [ ] Validación en tiempo real
- [ ] Toast notifications mejoradas
- [ ] Confirmaciones para delete

### Performance
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes
- [ ] Code splitting
- [ ] Índices de BD optimizados

### Accesibilidad
- [ ] Labels en inputs
- [ ] ARIA labels donde sea necesario
- [ ] Keyboard navigation
- [ ] Color contrast OK

### Mobile
- [ ] Responsive en todas las páginas
- [ ] Touch-friendly buttons
- [ ] Overflow handling
- [ ] Modal en mobile

---

## 🧪 Fase 10: Testing (Día 16-17)

### Testing Manual
- [ ] Crear usuario nuevo
- [ ] Crear liga completa
- [ ] Crear equipos
- [ ] Crear jugadores
- [ ] Crear partidos
- [ ] Registrar resultados y stats
- [ ] Ver tabla de posiciones
- [ ] Ver tabla de goleadores
- [ ] Delete operations
- [ ] Logout y login

### Testing en Navegadores
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (iPhone/Android)

### Testing de Errores
- [ ] Intentar crear con datos inválidos
- [ ] Intentar acceder a liga de otro usuario
- [ ] Desconectar internet y reintentar
- [ ] Sesión expirada

---

## 🚀 Fase 11: Preparación para Producción (Día 18)

### Configuración
- [ ] Variables de entorno finales
- [ ] Supabase en modo production
- [ ] CORS configurado
- [ ] Security headers OK
- [ ] Rate limiting (futuro)

### Deployment
- [ ] Crear repositorio público (o privado)
- [ ] Conectar Vercel a GitHub
- [ ] Configurar variables en Vercel
- [ ] Deploy a producción
- [ ] Verificar funcionamiento en prod
- [ ] Configurar dominio personalizado (futuro)

### Documentación
- [ ] README.md completo
- [ ] INSTALLATION_GUIDE.md
- [ ] ARCHITECTURE.md
- [ ] Código con comentarios donde necesario
- [ ] Guía de contribución (futuro)

### Monitoreo
- [ ] Configurar logs en Supabase
- [ ] Verificar errores en Vercel
- [ ] Monitoreo básico
- [ ] Alert para errors (futuro)

---

## ✨ Fase 12: Features Adicionales (Post-MVP)

### Inmediatos
- [ ] Upload de logos para equipos
- [ ] Upload de fotos de jugadores
- [ ] Email notifications
- [ ] Export a PDF/Excel

### Mediano Plazo
- [ ] Real-time updates (Supabase Realtime)
- [ ] Notificaciones push
- [ ] Sistema de reportes
- [ ] Comentarios en partidos
- [ ] Galería de fotos del partido

### Largo Plazo
- [ ] API pública
- [ ] Integración con redes sociales
- [ ] Chat en vivo durante partidos
- [ ] Predicciones/Fantasy league
- [ ] Monetización (suscripciones premium)

---

## 📝 Registro de Progreso

| Fase | Descripción | Status | Fecha Inicio | Fecha Fin |
|------|-------------|--------|--------------|-----------|
| 0 | Setup | ⬜ | | |
| 1 | Autenticación | ⬜ | | |
| 2 | Dashboard Base | ⬜ | | |
| 3 | Ligas | ⬜ | | |
| 4 | Equipos | ⬜ | | |
| 5 | Jugadores | ⬜ | | |
| 6 | Partidos | ⬜ | | |
| 7 | Estadísticas | ⬜ | | |
| 8 | Vistas Públicas | ⬜ | | |
| 9 | Pulido | ⬜ | | |
| 10 | Testing | ⬜ | | |
| 11 | Producción | ⬜ | | |

---

## 🎯 Objetivos del MVP

✅ Autenticación segura
✅ Gestión completa de ligas
✅ Gestión de equipos y jugadores
✅ Calendario y resultados de partidos
✅ Estadísticas de goles y tarjetas
✅ Tabla de posiciones automática
✅ Ranking de goleadores
✅ Interfaz profesional y responsiva
✅ Deployed en producción

---

## 🚀 Tiempo Estimado

**Total: 18-21 días** (trabajando 4-6 horas diarias)

- Fase 0: 1 día
- Fase 1: 1 día
- Fase 2: 1 día
- Fase 3: 2 días
- Fase 4: 1 día
- Fase 5: 1 día
- Fase 6-7: 2 días
- Fase 8: 2 días
- Fase 9: 2 días
- Fase 10: 2 días
- Fase 11: 1 día
- Buffer/Imprevistos: 2 días

---

## 💡 Tips para Éxito

1. **Pequeños commits**: Haz commits frecuentes con cambios pequeños
2. **Test temprano**: No dejes todo el testing para el final
3. **Reutiliza código**: Crea componentes genéricos reutilizables
4. **Feedback temprano**: Muestra el progreso regularmente
5. **Documentación**: Documenta mientras desarrollas
6. **Backup**: Haz push a GitHub regularmente
7. **Performance**: Monitorea performance desde el inicio
8. **UX**: Piensa en el usuario mientras desarrollas

---

**¡Éxito en tu desarrollo! 🎉**
