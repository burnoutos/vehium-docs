@echo off
REM Build and push vehium-docs image to GitHub Container Registry
setlocal

set IMAGE=ghcr.io/burnoutos/vehium-docs:latest

echo Building %IMAGE% ...
docker build -t %IMAGE% .
if errorlevel 1 goto :fail

echo Pushing %IMAGE% ...
docker push %IMAGE%
if errorlevel 1 goto :fail

echo Done.
exit /b 0

:fail
echo Build or push failed.
exit /b 1
