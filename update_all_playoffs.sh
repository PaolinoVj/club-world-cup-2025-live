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
    "result": "DEN WINS 4-3"
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
    "teamA": "New York Knicks",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-05-23T00:00:00Z",
    "venue": "Madison Square Garden, New York",
    "day": "Ven 23 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 2",
    "result": ""
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "New York Knicks",
    "dateTime": "2025-05-25T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Dom 25 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 3",
    "result": ""
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "New York Knicks",
    "dateTime": "2025-05-27T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Mar 27 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 4",
    "result": ""
  },

  {
    "teamA": "Minnesota Timberwolves",
    "teamB": "Denver Nuggets",
    "dateTime": "2025-05-20T00:30:00Z",
    "venue": "Target Center, Minneapolis",
    "day": "Mar 20 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 1",
    "result": ""
  },
  {
    "teamA": "Minnesota Timberwolves",
    "teamB": "Denver Nuggets",
    "dateTime": "2025-05-22T00:30:00Z",
    "venue": "Target Center, Minneapolis",
    "day": "Gio 22 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 2",
    "result": ""
  },
  {
    "teamA": "Denver Nuggets",
    "teamB": "Minnesota Timberwolves",
    "dateTime": "2025-05-24T00:30:00Z",
    "venue": "Ball Arena, Denver",
    "day": "Sab 24 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 3",
    "result": ""
  },
  {
    "teamA": "Denver Nuggets",
    "teamB": "Minnesota Timberwolves",
    "dateTime": "2025-05-26T00:30:00Z",
    "venue": "Ball Arena, Denver",
    "day": "Lun 26 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 4",
    "result": ""
  },

  {
    "teamA": "Vincente Est",
    "teamB": "Vincente Ovest",
    "dateTime": "2025-06-02T00:00:00Z",
    "venue": "NBA Finals Arena",
    "day": "Lun 2 Giugno",
    "timeIT": "02:00",
    "game": "Finale NBA, Gara 1",
    "result": ""
  },
  {
    "teamA": "Vincente Est",
    "teamB": "Vincente Ovest",
    "dateTime": "2025-06-04T00:00:00Z",
    "venue": "NBA Finals Arena",
    "day": "Mer 4 Giugno",
    "timeIT": "02:00",
    "game": "Finale NBA, Gara 2",
    "result": ""
  },
  {
    "teamA": "Vincente Ovest",
    "teamB": "Vincente Est",
    "dateTime": "2025-06-06T00:00:00Z",
    "venue": "NBA Finals Arena",
    "day": "Ven 6 Giugno",
    "timeIT": "02:00",
    "game": "Finale NBA, Gara 3",
    "result": ""
  },
  {
    "teamA": "Vincente Ovest",
    "teamB": "Vincente Est",
    "dateTime": "2025-06-08T00:00:00Z",
    "venue": "NBA Finals Arena",
    "day": "Dom 8 Giugno",
    "timeIT": "02:00",
    "game": "Finale NBA, Gara 4",
    "result": ""
  }
]' > "$TMP_JSON"

# === SOVRASCRIVI IL FILE ===
cat "$TMP_JSON" > "$JSON_PATH"


# === GIT COMMIT & PUSH ===
cd "$PROJECT_DIR"

git pull origin "$BRANCH" --rebase

git add .
git commit -m "Aggiornato JSON con risultati semifinale Ovest e schedule finali conference" || echo "⚠️ Nessun cambiamento da committare"
git push origin "$BRANCH"

echo "✅ JSON aggiornato e pushato su GitHub. Deploy Vercel in corso..."
