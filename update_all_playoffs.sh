#!/bin/bash

# === CONFIG ===
PROJECT_DIR="nba-playoff-live"
JSON_PATH="$PROJECT_DIR/public/playoffs-2025-updated.json"
BRANCH="main"

# === CREA IL NUOVO CONTENUTO JSON TEMPORANEO ===
TMP_JSON=$(mktemp)

printf '%s\n' '[
  {
    "teamA": "Oklahoma City Thunder",
    "teamB": "Denver Nuggets",
    "dateTime": "2025-05-18T19:30:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Dom 18 Maggio",
    "timeIT": "21:30",
    "game": "Semifinale Ovest, Gara 7",
    "result": ""
  },
  {
    "teamA": "New York Knicks",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-05-21T00:00:00Z",
    "venue": "Madison Square Garden, New York",
    "day": "Mer 21 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 1",
    "result": ""
  },
  {
    "teamA": "Minnesota Timberwolves",
    "teamB": "TBD",
    "dateTime": "2025-05-20T00:30:00Z",
    "venue": "Target Center, Minneapolis",
    "day": "Mar 20 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 1",
    "result": ""
  }
]' > "$TMP_JSON"

# === SOVRASCRIVI IL FILE ===
cp "$TMP_JSON" "$JSON_PATH"
rm "$TMP_JSON"

# === GIT COMMIT & PUSH ===
cd "$PROJECT_DIR"
git add "$JSON_PATH"
git commit -m "Aggiornato JSON completo fino alla finale NBA 2025"
git push origin "$BRANCH"

echo "✅ JSON aggiornato e deploy avviato su Vercel."
