@echo off
chcp 65001 > nul
title 🔄 Aggiornamento JSON Playoff NBA 2025
echo.
echo ▶️ Avvio aggiornamento JSON playoff...
echo ----------------------------------------

:: Avvia lo script Bash usando Git Bash
"C:\Program Files\Git\bin\bash.exe" ./update_all_playoffs.sh

echo ----------------------------------------
echo ✅ Operazione completata. Premi un tasto per chiudere.
pause > nul
