# 🔧 Fix Database Constraint - MediRadianza Support

## Problema
La tabella `content` in Supabase ha un constraint che limita i valori di `type` a:
- 'video', 'photo', 'text', 'poem', 'letter'

Questi valori non includono i nuovi tipi aggiunti:
- 'music', 'image', 'mantra', 'mediradiananza'

## Soluzione
È necessario eseguire una migrazione SQL in Supabase per aggiornare il constraint.

## Passaggi

### 1. Accedi a Supabase
- Vai a https://app.supabase.com
- Seleziona il tuo progetto "radianza"

### 2. Apri la SQL Editor
- Clicca su "SQL Editor" nel menu a sinistra
- Clicca su "New Query" per creare una nuova query

### 3. Copia e incolla il seguente SQL:

```sql
-- Update content type constraint to include all supported types
ALTER TABLE content 
DROP CONSTRAINT IF EXISTS content_type_check;

ALTER TABLE content 
ADD CONSTRAINT content_type_check 
CHECK (type IN ('video', 'photo', 'text', 'poem', 'letter', 'music', 'image', 'mantra', 'mediradiananza'));
```

### 4. Esegui la query
- Clicca il pulsante "Run" o premi `Ctrl+Enter`
- Se la query ha successo, vedrai un messaggio di conferma

### 5. Verifica
- Torna all'app e prova a creare/modificare un contenuto di tipo "MediRadianza"
- L'errore dovrebbe essere risolto

## File Correlati
- `/migrations-content-types.sql` - Script SQL della migrazione
- `/supabase-schema.sql` - Schema aggiornato con i nuovi tipi
