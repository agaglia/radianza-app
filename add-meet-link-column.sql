-- Aggiungi colonne meet_link e meet_link_2 alla tabella meetings
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link TEXT;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link_2 TEXT;

-- Crea indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link ON meetings(meet_link);
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link_2 ON meetings(meet_link_2);
