-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  favorite_club VARCHAR(100) NOT NULL,
  favorite_player VARCHAR(100) NOT NULL,
  favorite_international_team VARCHAR(100) NOT NULL,
  email VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  id INTEGER PRIMARY KEY,
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Live', 'Finished')),
  home_score INTEGER,
  away_score INTEGER,
  competition VARCHAR(100),
  ai_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hot Takes
CREATE TABLE hot_takes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  hot_take_text TEXT NOT NULL,
  ai_rating INTEGER CHECK (ai_rating BETWEEN 1 AND 10),
  ai_roast TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  analysis_text TEXT NOT NULL,
  ai_rating INTEGER CHECK (ai_rating BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  predicted_winner VARCHAR(100) NOT NULL,
  predicted_home_score INTEGER,
  predicted_away_score INTEGER,
  reasoning VARCHAR(280),
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);