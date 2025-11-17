# Risolvere l'errore: "Could not find the 'meet_link' column of 'meetings' in the schema cache"

## Soluzione Rapida

Vai al dashboard di Supabase e esegui questo SQL nel SQL Editor:

```sql
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link TEXT;
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link ON meetings(meet_link);
```

## Passi:

1. Apri: https://qtsasjhevmxzffqlauyt.supabase.co/project/default/sql
2. Clicca "New Query"
3. Incolla il SQL sopra
4. Clicca "Run"
5. Aggiorna la pagina del browser (localhost:3000/admin/calendar)

## Verifica

Dopo aver eseguito il SQL, verifica che la colonna sia stata aggiunta:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'meetings' AND column_name = 'meet_link';
```

Dovrebbe ritornare un risultato con 'meet_link'.
