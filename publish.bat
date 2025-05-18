@echo off
title Publishing

:: Pobranie starej wersji z package.json
for /f "tokens=2 delims=:, " %%A in ('findstr /C:"\"version\"" package.json') do set versionOLD=%%A
set versionOLD=%versionOLD:"=%

echo Stara wersja: %versionOLD%

:: Pobranie nowej wersji od użytkownika
set /p versionNEW=Podaj nową wersję: 

:: Pobranie tekstu commita od użytkownika
set /p commitText=Podaj tekst w commicie: 

:: Zmiana wersji w package.json
powershell -Command "(Get-Content package.json) -replace '\"version\": \"%versionOLD%\"', '\"version\": \"%versionNEW%\"' | Set-Content package.json"

:: Dodanie zmian do Git
git add .
git commit -m "%commitText%"
git push --force

:: Publikacja na npm
npm publish

echo Publikacja zakończona!
echo Zaktualizowano z %versionOLD% do %versionNEW%
pause