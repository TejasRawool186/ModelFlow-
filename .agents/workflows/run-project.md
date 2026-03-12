---
description: How to run the ModelFlow project (all 3 services)
---

# Running ModelFlow

ModelFlow has 3 services that need to run simultaneously. Open 3 terminals and run them in order.

## Prerequisites

- **Node.js** 18+ installed
- **Python** 3.9+ installed
- **npm** and **pip** available

## Step 1 — Install Dependencies (first time only)

### Backend
```bash
cd d:\ModelFlow\backend
npm install
```

### Frontend
```bash
cd d:\ModelFlow\frontend
npm install
```

### ML Service
```bash
cd d:\ModelFlow\ml-service
pip install -r requirements.txt
```

## Step 2 — Configure Environment

Create/verify `d:\ModelFlow\backend\.env`:
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
LINGODEV_API_KEY=your_lingo_dev_api_key_here
LINGODEV_API_URL=https://api.lingo.dev/v1
```

## Step 3 — Start All 3 Services

### Terminal 1: Backend (port 3001)
// turbo
```bash
cd d:\ModelFlow\backend
npm run dev
```
Expected output: `✓ ModelFlow Backend running` on http://localhost:3001

### Terminal 2: Frontend (port 3000)
// turbo
```bash
cd d:\ModelFlow\frontend
npm run dev
```
Expected output: `Ready` on http://localhost:3000

### Terminal 3: ML Service (port 8000)
// turbo
```bash
cd d:\ModelFlow\ml-service
python -m uvicorn main:app --reload --port 8000
```
Expected output: `Uvicorn running` on http://localhost:8000

## Step 4 — Open in Browser

Open http://localhost:3000 in your browser.

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js UI |
| Backend API | http://localhost:3001/api | Express REST API |
| ML Service | http://localhost:8000 | Python FastAPI (training, prediction, embeddings) |
| Health Check | http://localhost:3001/health | Backend health |
| API Docs | http://localhost:8000/docs | ML service Swagger docs |

## Troubleshooting

- **Port already in use**: Kill the process using the port:
  ```powershell
  Get-NetTCPConnection -LocalPort 3001 | Select -Exp OwningProcess | ForEach { Stop-Process -Id $_ -Force }
  ```
- **ML service crash**: Make sure `sentence-transformers` is installed: `pip install sentence-transformers`
- **Frontend build error**: Delete `.next` folder and restart: `Remove-Item -Recurse .next; npm run dev`
