#!/bin/bash

echo "⏳ Avvio aggiornamento JSON playoff..."

# === CONFIG ===
PROJECT_DIR="/c/Users/info/nba-playoff-live"
JSON_PATH="$PROJECT_DIR/public/playoffs-2025-extended.json"
BRANCH="main"

# === CREA IL NUOVO CONTENUTO JSON TEMPORANEO ===
TMP_JSON=$(mktemp)

cat > "$TMP_JSON" <<EOF
[
  {
    "teamA": "Indiana Pacers",
    "teamB": "Oklahoma City Thunder",
    "dateTime": "2025-06-05T00:00:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Gio 05 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 1",
    "result": "IND WINS 111-110",
    "series": "IND leads 1-0",
    "status": "conclusa",
    "winner": "Indiana Pacers",
    "isElimination": false
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "Oklahoma City Thunder",
    "dateTime": "2025-06-08T00:00:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Dom 08 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 2",
    "result": "OKC WINS 123-107",
    "series": "Series tied 1-1",
    "status": "conclusa",
    "winner": "Oklahoma City Thunder",
    "isElimination": false
  },
  {
    "teamA": "Oklahoma City Thunder",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-06-11T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Mer 11 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 3",
    "result": "IND WINS 116-107",
    "series": "IND leads 2-1",
    "status": "conclusa",
    "winner": "Indiana Pacers",
    "isElimination": false
  },
  {
    "teamA": "Oklahoma City Thunder",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-06-13T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Ven 13 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 4",
    "result": "",
    "status": "programmata"
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "Oklahoma City Thunder",
    "dateTime": "2025-06-16T00:00:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Lun 16 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 5",
    "result": "",
    "status": "programmata"
  },
  {
    "teamA": "Oklahoma City Thunder",
    "teamB": "Indiana Pacers",
    "dateTime": "2025-06-19T00:00:00Z",
    "venue": "Gainbridge Fieldhouse, Indianapolis",
    "day": "Gio 19 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 6",
    "result": "",
    "status": "programmata"
  },
  {
    "teamA": "Indiana Pacers",
    "teamB": "Oklahoma City Thunder",
    "dateTime": "2025-06-22T00:00:00Z",
    "venue": "Paycom Center, Oklahoma City",
    "day": "Dom 22 June",
    "timeIT": "02:00",
    "game": "NBA Finals, Gara 7",
    "result": "",
    "status": "programmata"
  }
]

  
  


EOF

# === SOVRASCRIVI IL FILE ===
cat "$TMP_JSON" > "$JSON_PATH"

# === GIT COMMIT & PUSH ===
cd "$PROJECT_DIR" || exit 1
git pull origin "$BRANCH" --rebase
git add .
git commit -m "🆕 Update JSON playoff esteso automatico" || echo "⚠️ Nessun cambiamento da committare"
git push origin "$BRANCH"

echo "✅ JSON aggiornato e pushato su GitHub!"
