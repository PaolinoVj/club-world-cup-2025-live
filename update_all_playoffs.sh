#!/bin/bash

echo "⏳ Avvio aggiornamento JSON playoff..."

# === CONFIG ===
PROJECT_DIR="/c/Users/info/nba-playoff-live"
JSON_PATH="$PROJECT_DIR/public/playoffs-2025-extended.json"
BRANCH="main"

# === CREA IL NUOVO CONTENUTO JSON TEMPORANEO ===
TMP_JSON=$(mktemp)

printf '%s\n' '[
  {
    "teamA": "Oklahoma City Thunder",
    "teamB": "Minnesota Timberwolves",
    "dateTime": "2025-05-18T00:00:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Dom 18 Maggio",
    "timeIT": "02:00",
    "game": "Finale Ovest, Gara 1",
    "result": "OKC WINS 114-88",
    "status": "conclusa",
    "winner": "OKC"
  },
  {
    "teamA": "Oklahoma City Thunder",
    "teamB": "Minnesota Timberwolves",
    "dateTime": "2025-05-20T00:30:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Mar 20 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 2",
    "result": "OKC WINS 118-103",
    "series": "OKC leads 2-0",
    "status": "conclusa",
    "winner": "OKC",
    "isLead": true
  },
  {
    "teamA": "New York Knicks",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-05-21T00:00:00Z",
    "venue": "Madison Square Garden, New York",
    "day": "Mer 21 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 1",
    "result": "IND WINS 138-135 (OT)",
    "status": "conclusa",
    "winner": "IND"
  },
  {
    "teamA": "New York Knicks",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-05-23T00:00:00Z",
    "venue": "Madison Square Garden, New York",
    "day": "Ven 23 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 2",
    "result": "IND WINS 114-109",
    "series": "IND leads 2-0",
    "status": "conclusa",
    "winner": "IND",
    "isLead": true
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "New York Knicks",
    "dateTime": "2025-05-25T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Dom 25 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 3",
    "result": "",
    "status": "programmata"
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "New York Knicks",
    "dateTime": "2025-05-27T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Mar 27 Maggio",
    "timeIT": "02:00",
    "game": "Finale Est, Gara 4",
    "result": "",
    "status": "programmata",
    "isElimination": true
  },
  {
    "teamA": "Minnesota Timberwolves",
    "teamB": "Oklahoma City Thunder",
    "dateTime": "2025-05-24T00:30:00Z",
    "venue": "Target Center, Minneapolis",
    "day": "Sab 24 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 3",
    "result": "",
    "status": "in corso"
  },
  {
    "teamA": "Minnesota Timberwolves",
    "teamB": "Oklahoma City Thunder",
    "dateTime": "2025-05-26T00:30:00Z",
    "venue": "Target Center, Minneapolis",
    "day": "Lun 26 Maggio",
    "timeIT": "02:30",
    "game": "Finale Ovest, Gara 4",
    "result": "",
    "status": "programmata",
    "isElimination": true
  }
]' > "$TMP_JSON"

# === SOVRASCRIVI IL FILE DEFINITIVO ===
cat "$TMP_JSON" > "$JSON_PATH"

# === GIT COMMIT & PUSH ===
cd "$PROJECT_DIR" || exit 1
git pull origin "$BRANCH" --rebase
git add .
git commit -m "Aggiornato JSON esteso playoff con risultati aggiornati" || echo "⚠️ Nessun cambiamento da committare"
git push origin "$BRANCH"

echo "✅ JSON aggiornato e pushato. Deploy Vercel in corso..."
