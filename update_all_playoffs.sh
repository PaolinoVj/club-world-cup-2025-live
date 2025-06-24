#!/bin/bash

echo "⏳ Avvio aggiornamento JSON Club World Cup..."

# === CONFIG ===
PROJECT_DIR="/c/Users/info/club-world-cup-2025-live"
JSON_PATH="$PROJECT_DIR/public/data/matches.json"
BRANCH="main"

# === CREA IL NUOVO CONTENUTO JSON TEMPORANEO ===
TMP_JSON=$(mktemp)

cat > "$TMP_JSON" <<EOF
[
  {
    "home_team": { "id": 1, "name": "Club A", "slug": "club-a" },
    "away_team": { "id": 2, "name": "Club B", "slug": "club-b" },
    "date": "2025-06-18",
    "time_italy": "20:00",
    "stadium": "Stadio Internazionale, Miami",
    "phase": "Group Stage",
    "group": "A",
    "status": "upcoming"
  },
  {
    "home_team": { "id": 3, "name": "Club C", "slug": "club-c" },
    "away_team": { "id": 4, "name": "Club D", "slug": "club-d" },
    "date": "2025-06-18",
    "time_italy": "22:00",
    "stadium": "Stadio Internazionale, Miami",
    "phase": "Group Stage",
    "group": "A",
    "status": "upcoming"
  }
]
EOF

# === SOVRASCRIVI IL FILE ===
cat "$TMP_JSON" > "$JSON_PATH"

# === GIT COMMIT & PUSH ===
cd "$PROJECT_DIR" || exit 1
git pull origin "$BRANCH" --rebase
git add .
git commit -m "🆕 Update JSON Club World Cup automatico" || echo "⚠️ Nessun cambiamento da committare"
git push origin "$BRANCH"

echo "✅ JSON aggiornato e pushato su GitHub!"
