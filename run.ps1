# run.ps1 - Start both backend and frontend for Sci-Hub (no dependency install)

Write-Host "Sci-Hub Launcher" -ForegroundColor Cyan

# --- Backend setup ---
$backendPath = "G:\sci-hub\src\components\graph\backend"
Set-Location $backendPath

# Create virtual environment if missing (but don't install packages)
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Virtual environment created. Please install dependencies manually once if needed." -ForegroundColor Yellow
}

# Start backend in a new window using uvicorn
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\venv\Scripts\Activate.ps1; uvicorn backend:app --reload --host 0.0.0.0 --port 8000"

# --- Frontend setup ---
$frontendPath = "G:\sci-hub"
Set-Location $frontendPath

# Start frontend in a new window
Write-Host "Starting frontend dev server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

# --- Open browser tabs ---
Write-Host "Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"        # Opens the React/Vite Frontend
Start-Process "http://localhost:8000/docs"   # Opens the FastAPI Backend Docs

Write-Host "All services started. Close the new windows to stop." -ForegroundColor Green