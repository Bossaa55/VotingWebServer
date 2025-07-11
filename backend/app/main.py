import asyncio
from app.logger import Logger
import os
from pathlib import Path
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

from app.routers import api
from app.routers import auth
from .database_manager import DatabaseManager

DATABASE_USER = os.getenv("DATABASE_USER", None)
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", None)
INITIAL_ADMIN_USERNAME = os.getenv("INITIAL_ADMIN_USERNAME", None)
INITIAL_ADMIN_PASSWORD = os.getenv("INITIAL_ADMIN_PASSWORD", None)

if not DATABASE_USER or not DATABASE_PASSWORD:
    raise ValueError("DATABASE_USER and DATABASE_PASSWORD environment variables must be set.")

logger = Logger()
app = FastAPI()
db = DatabaseManager()

countdown_time = int(db.get_setting("countdown_time", 60))
is_countdown_on = True

frontend_build = Path(__file__).parent / "frontend"

origins = [
    "http://localhost:8000",
    "localhost:8000"
    "http://localhost:5173",
    "localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api.router, prefix="/api", tags=["api"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

if frontend_build.exists():
    print(f"Frontend build directory found at: {frontend_build}")
    app.mount("/static", StaticFiles(directory=frontend_build / "assets"), name="static")
    print(f"Mounted static files at /static: {frontend_build / 'assets'}")
    for static_dir in ["assets", "img"]:
        static_path = frontend_build / static_dir
        print(f"Checking for static directory: {static_path}")
        if static_path.exists():
            app.mount(f"/{static_dir}", StaticFiles(directory=static_path), name=static_dir)
            print(f"Mounted static files at /{static_dir}: {static_path}")


@app.get("/")
async def serve_react_app(request: Request, response: Response):
    """Serve the React app's index.html and set session cookie."""
    if is_countdown_on:
        return RedirectResponse(url="/vote", status_code=302)

    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response
    elif db.session_voted(session_id):
        return RedirectResponse(url="/voteresult", status_code=302)

    return FileResponse(frontend_build / "index.html")

@app.get("/admin")
@app.get("/admin/{path:path}")
async def serve_admin_routes(request: Request, path: str = ""):
    """Handle admin routes with authentication check."""
    access_token = request.cookies.get("access_token")

    if not access_token:
        if path != "login":
            return RedirectResponse(url="/admin/login", status_code=302)
    elif path == "login":
        return RedirectResponse(url="/admin", status_code=302)

    return FileResponse(frontend_build / "index.html")

@app.get("/vote")
async def serve_vote(request: Request):
    """Serve the voting page."""
    if is_countdown_on is False:
        return RedirectResponse(url="/", status_code=302)

    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response

    vote_info = db.get_vote_info(session_id)

    if vote_info:
        return RedirectResponse(url="/voteresult", status_code=302)

    return FileResponse(frontend_build / "index.html")

@app.get("/voteresult")
async def serve_voteresult(request: Request, path: str = ""):
    """Handle admin routes with authentication check."""
    if is_countdown_on is False:
        return RedirectResponse(url="/", status_code=302)

    session_id = request.cookies.get("session_id")

    if not session_id:
        return RedirectResponse(url="/", status_code=302)

    vote_info = db.get_vote_info(session_id)
    if not vote_info:
        return RedirectResponse(url="/", status_code=302)

    return FileResponse(frontend_build / "index.html")

async def run_countdown():
    global is_countdown_on, countdown_time
    while True:
        if is_countdown_on:
            countdown_time -= 1
            if countdown_time <= 0:
                is_countdown_on = False
        await asyncio.sleep(1)


@app.on_event("startup")
async def startup_event():
    #Create initial admin user if it doesn't exist
    if db.get_users_count() == 0:
        if not INITIAL_ADMIN_USERNAME or not INITIAL_ADMIN_PASSWORD:
            raise ValueError("INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD environment variables must be set.")
        db.create_user(INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_PASSWORD)
        logger.info(f"Created initial admin user: {INITIAL_ADMIN_USERNAME}")

    # Start the countdown task
    asyncio.create_task(run_countdown())
    logger.info("Countdown task started.")