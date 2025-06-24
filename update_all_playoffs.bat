@echo off
setlocal

echo ▶️ Avvio aggiornamento Club World Cup 2025 e sincronizzazione GitHub...

:: Percorso assoluto al tuo progetto
cd /d "C:\Users\info\club-world-cup-2025-live"

:: Lancia lo script di aggiornamento JSON (Bash via Git for Windows)
"C:\Program Files\Git\bin\bash.exe" ./update_all_matches.sh

:: Controlla modifiche, committa e push su GitHub
git pull origin main --rebase
git add .
git commit -m "🔄 Update JSON Club World Cup & sincronizzazione automatica" || echo ⚠️ Nessun cambiamento da committare
git push origin main

echo ✅ Aggiornamento completato con successo!
pause
