# BearWithMe Backend

FastAPI backend for BearWithMe (auth, users, journals, moods, chat).

## Requirements

- Python 3.11+
- MongoDB running locally (default: `mongodb://localhost:27017`)
- NVIDIA API key (for chat model)

## 1) Setup

From the `backend` folder:

```powershell
cd backend
```

### Option A (recommended): uv

```powershell
uv sync
```

### Option B: venv + pip

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -U pip
pip install -e .
```

## 2) Environment variables

Create `.env` in `backend` using `.env.example` as reference.

Minimum required for local run:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=bearwithme

JWT_SECRET=change-me-to-a-random-32-char-string

GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx

NVIDIA_API_KEY=nvapi-xxxx
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=moonshotai/kimi-k2-instruct
AI_TEMPERATURE=0.7
```

Notes:

- Chat uses NVIDIA API key and defaults to `moonshotai/kimi-k2-instruct`.
- Keep `JWT_SECRET` strong in non-local environments.

## 3) Run the server

From `backend`:

```powershell
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Alternative:

```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 4) Verify it is running

- Health check: `http://localhost:8000/api/v1/health`
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## 5) Main API prefixes

- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/journals`
- `/api/v1/moods`
- `/api/v1/chat`
- `/api/v1/patterns`
