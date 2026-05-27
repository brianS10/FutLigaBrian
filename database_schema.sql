-- ============================================================================
-- ESQUEMA DE BASE DE DATOS - SISTEMA DE GESTIÓN DE LIGAS DE FÚTBOL AMATEUR
-- ============================================================================

-- Tabla de Ligas
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  president_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url VARCHAR(500),
  country VARCHAR(100),
  city VARCHAR(100),
  season_year INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_season_year CHECK (season_year >= 2020)
);

-- Tabla de Equipos
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  manager_name VARCHAR(255),
  coach_email VARCHAR(255),
  logo_url VARCHAR(500),
  city VARCHAR(100),
  home_field VARCHAR(255),
  founded_year INT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(league_id, name)
);

-- Tabla de Jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  jersey_number INT,
  position VARCHAR(50), -- GK, DEF, MID, FWD
  date_of_birth DATE,
  document_id VARCHAR(50), -- RUT, DNI, cédula, etc.
  photo_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'injured', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_jersey_number CHECK (jersey_number > 0 AND jersey_number <= 99),
  CONSTRAINT unique_jersey_per_team CHECK (jersey_number IS NULL OR (team_id, jersey_number) IS NOT NULL)
);

-- Tabla de Partidos/Jornadas
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  matchday INT, -- Jornada
  match_date TIMESTAMP NOT NULL,
  venue VARCHAR(255),
  home_goals INT DEFAULT 0,
  away_goals INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled', 'postponed')),
  referee_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT different_teams CHECK (home_team_id != away_team_id),
  CONSTRAINT valid_goals CHECK (home_goals >= 0 AND away_goals >= 0)
);

-- Tabla de Estadísticas de Partidos
CREATE TABLE match_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  yellow_cards INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  minutes_played INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_player_per_match UNIQUE(match_id, player_id),
  CONSTRAINT valid_statistics CHECK (
    goals >= 0 AND assists >= 0 AND 
    yellow_cards >= 0 AND yellow_cards <= 2 AND
    red_cards >= 0 AND red_cards <= 1 AND
    minutes_played >= 0 AND minutes_played <= 120
  )
);

-- Tabla de Roles de Usuarios (para gestionar permisos)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('president', 'administrator', 'team_manager', 'referee', 'viewer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, league_id, role)
);

-- ============================================================================
-- VISTAS (VIEWS) PARA TABLA DE POSICIONES Y GOLEADORES
-- ============================================================================

-- Vista: Tabla de Posiciones
CREATE OR REPLACE VIEW league_standings AS
SELECT 
  t.id,
  t.league_id,
  t.name,
  t.logo_url,
  COUNT(DISTINCT m.id) AS played_matches,
  SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals > m.away_goals THEN 1
           WHEN m.away_team_id = t.id AND m.away_goals > m.home_goals THEN 1
           ELSE 0 END) AS wins,
  SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals = m.away_goals THEN 1
           WHEN m.away_team_id = t.id AND m.away_goals = m.home_goals THEN 1
           ELSE 0 END) AS draws,
  SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals < m.away_goals THEN 1
           WHEN m.away_team_id = t.id AND m.away_goals < m.home_goals THEN 1
           ELSE 0 END) AS losses,
  COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_goals
                     WHEN m.away_team_id = t.id THEN m.away_goals
                     ELSE 0 END), 0) AS goals_for,
  COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.away_goals
                     WHEN m.away_team_id = t.id THEN m.home_goals
                     ELSE 0 END), 0) AS goals_against,
  COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_goals
                     WHEN m.away_team_id = t.id THEN m.away_goals
                     ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.away_goals
                     WHEN m.away_team_id = t.id THEN m.home_goals
                     ELSE 0 END), 0) AS goal_difference,
  (SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals > m.away_goals THEN 1
            WHEN m.away_team_id = t.id AND m.away_goals > m.home_goals THEN 1
            ELSE 0 END) * 3) +
  SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals = m.away_goals THEN 1
           WHEN m.away_team_id = t.id AND m.away_goals = m.home_goals THEN 1
           ELSE 0 END) AS points,
  ROW_NUMBER() OVER (PARTITION BY t.league_id ORDER BY 
    ((SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals > m.away_goals THEN 1
              WHEN m.away_team_id = t.id AND m.away_goals > m.home_goals THEN 1
              ELSE 0 END) * 3) +
    SUM(CASE WHEN m.home_team_id = t.id AND m.home_goals = m.away_goals THEN 1
             WHEN m.away_team_id = t.id AND m.away_goals = m.home_goals THEN 1
             ELSE 0 END)) DESC,
    (COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_goals
                       WHEN m.away_team_id = t.id THEN m.away_goals
                       ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.away_goals
                       WHEN m.away_team_id = t.id THEN m.home_goals
                       ELSE 0 END), 0)) DESC
  ) AS position
FROM teams t
LEFT JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id) AND m.status = 'finished'
WHERE t.status = 'active'
GROUP BY t.id, t.league_id, t.name, t.logo_url;

-- Vista: Tabla de Goleadores (Top Scorers)
CREATE OR REPLACE VIEW top_scorers AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.league_id,
  t.id AS team_id,
  t.name AS team_name,
  t.logo_url AS team_logo,
  p.photo_url,
  SUM(COALESCE(ms.goals, 0)) AS total_goals,
  SUM(COALESCE(ms.assists, 0)) AS total_assists,
  COUNT(DISTINCT m.id) AS matches_played
FROM players p
JOIN teams t ON p.team_id = t.id
LEFT JOIN match_statistics ms ON p.id = ms.player_id
LEFT JOIN matches m ON ms.match_id = m.id AND m.status = 'finished'
WHERE p.status = 'active' AND t.status = 'active'
GROUP BY p.id, p.first_name, p.last_name, p.league_id, t.id, t.name, t.logo_url, p.photo_url
ORDER BY total_goals DESC;

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE QUERIES
-- ============================================================================

CREATE INDEX idx_teams_league_id ON teams(league_id);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_league_id ON players(league_id);
CREATE INDEX idx_matches_league_id ON matches(league_id);
CREATE INDEX idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX idx_matches_match_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_match_statistics_match_id ON match_statistics(match_id);
CREATE INDEX idx_match_statistics_player_id ON match_statistics(player_id);
CREATE INDEX idx_match_statistics_team_id ON match_statistics(team_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_league_id ON user_roles(league_id);

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD RLS (Row Level Security) - OPCIONAL
-- ============================================================================
-- Nota: Descomenta estas líneas si usas RLS en Supabase

/*
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuarios pueden ver ligas donde tienen un rol
CREATE POLICY "view_league_if_member" ON leagues
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE league_id = leagues.id
    ) OR
    president_id = auth.uid()
  );

-- Policy: Solo presidente puede editar su liga
CREATE POLICY "edit_league_if_president" ON leagues
  FOR UPDATE
  USING (president_id = auth.uid())
  WITH CHECK (president_id = auth.uid());

-- Policy: Usuarios pueden ver equipos de ligas donde tienen rol
CREATE POLICY "view_teams_in_league" ON teams
  FOR SELECT
  USING (
    league_id IN (
      SELECT l.id FROM leagues l
      WHERE l.president_id = auth.uid() OR
      l.id IN (SELECT league_id FROM user_roles WHERE user_id = auth.uid())
    )
  );

-- Policy: Usuarios pueden ver jugadores de sus equipos
CREATE POLICY "view_players_in_league" ON players
  FOR SELECT
  USING (
    league_id IN (
      SELECT l.id FROM leagues l
      WHERE l.president_id = auth.uid() OR
      l.id IN (SELECT league_id FROM user_roles WHERE user_id = auth.uid())
    )
  );

-- Policy: Usuarios pueden ver partidos de su liga
CREATE POLICY "view_matches_in_league" ON matches
  FOR SELECT
  USING (
    league_id IN (
      SELECT l.id FROM leagues l
      WHERE l.president_id = auth.uid() OR
      l.id IN (SELECT league_id FROM user_roles WHERE user_id = auth.uid())
    )
  );

-- Policy: Usuarios pueden ver estadísticas de su liga
CREATE POLICY "view_match_statistics" ON match_statistics
  FOR SELECT
  USING (
    team_id IN (
      SELECT t.id FROM teams t
      WHERE t.league_id IN (
        SELECT l.id FROM leagues l
        WHERE l.president_id = auth.uid() OR
        l.id IN (SELECT league_id FROM user_roles WHERE user_id = auth.uid())
      )
    )
  );
*/
