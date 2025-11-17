#!/usr/bin/env python3
import requests
import sys

SUPABASE_URL = "https://qtsasjhevmxzffqlauyt.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0c2Fzamhldm14emZmcWxhdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODI0MzIsImV4cCI6MjA3ODc1ODQzMn0.txpvIM4L8aqrWLq3YpWc2-Fajp_idMZ4-YTuABHIkGk"

# SQL to execute
sql = """
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS meet_link TEXT;
CREATE INDEX IF NOT EXISTS idx_meetings_meet_link ON meetings(meet_link);
"""

# Execute via Supabase REST API
url = f"{SUPABASE_URL}/rest/v1/rpc/execute_sql"
headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json"
}

payload = {"sql": sql}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
