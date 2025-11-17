# Script per aggiungere la colonna meet_link alla tabella meetings in Supabase
# Usa l'API SQL di Supabase o il dashboard

$supabaseUrl = "https://qtsasjhevmxzffqlauyt.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0c2Fzamhldm14emZmcWxhdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODI0MzIsImV4cCI6MjA3ODc1ODQzMn0.txpvIM4L8aqrWLq3YpWc2-Fajp_idMZ4-YTuABHIkGk"

$sql = @"
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link TEXT;
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link ON meetings(meet_link);
"@

# Copia il SQL sottostante e eseguilo nel SQL Editor di Supabase Dashboard
# https://qtsasjhevmxzffqlauyt.supabase.co/project/default/sql/new

Write-Host "Esegui il seguente SQL nel dashboard di Supabase:" -ForegroundColor Green
Write-Host ""
Write-Host $sql
Write-Host ""
Write-Host "1. Vai a: https://qtsasjhevmxzffqlauyt.supabase.co/project/default/sql"
Write-Host "2. Clicca su 'New Query'"
Write-Host "3. Incolla il SQL sopra"
Write-Host "4. Clicca su 'Run'"
