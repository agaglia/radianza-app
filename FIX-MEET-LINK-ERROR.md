# Setup Database per Due Link Google Meet

## Istruzioni

Vai al dashboard di Supabase e esegui questo SQL nel SQL Editor:

```sql
-- Aggiungi colonna meet_link se non esiste
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- Aggiungi colonna meet_link_2 per il link di backup
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link_2 TEXT;

-- Crea indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link ON meetings(meet_link);
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link_2 ON meetings(meet_link_2);
```

## Passi:

1. Apri: https://qtsasjhevmxzffqlauyt.supabase.co/project/default/sql
2. Clicca "New Query"
3. Incolla il SQL sopra
4. Clicca "Run"
5. Aggiorna la pagina del browser (localhost:3000/admin/calendar)

## Verifica

Dopo aver eseguito il SQL, verifica che le colonne siano state aggiunte:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'meetings' 
ORDER BY ordinal_position;
```

Dovrebbe ritornare sia `meet_link` che `meet_link_2`.

## Funzionalità

Ora ogni riunione avrà:
- **Link 1**: Link principale per l'incontro
- **Link 2**: Link di backup da usare se il primo raggiunge il limite di tempo

Entrambi i link vengono auto-generati e sono reali/accedibili da Google Meet.
