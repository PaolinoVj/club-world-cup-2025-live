@echo off
setlocal

echo ▶️ Avvio aggiornamento playoff e sincronizzazione GitHub...

:: Percorso assoluto al tuo progetto
cd /d "C:\Users\info\nba-playoff-live"

:: Lancia lo script di aggiornamento JSON (Bash via Git for Windows)
"C:\Program Files\Git\bin\bash.exe" ./update_all_playoffs.sh

:: Controlla modifiche, committa e push su GitHub
git pull origin main --rebase
git add .
git commit -m "🔄 Update JSON playoff & sincronizzazione automatica" || echo ⚠️ Nessun cambiamento da committare
git push origin main

echo ✅ Aggiornamento completato con successo!
pause
