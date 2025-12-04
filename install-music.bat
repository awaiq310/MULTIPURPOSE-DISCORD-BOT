@echo off
echo Installing music dependencies...
npm install @discordjs/opus @distube/soundcloud @distube/spotify distube libsodium-wrappers
echo.
echo Music dependencies installed!
echo You can now enable music by updating handlers/distube.js
pause