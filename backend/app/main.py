import asyncio
import random
import time

from app.logger import Logger
import os
from pathlib import Path
from sqlalchemy.orm import Session
from typing import Union

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

from app.routers import api
from app.routers import auth
from app import database, database_manager

DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", None)
INITIAL_ADMIN_USERNAME = os.getenv("INITIAL_ADMIN_USERNAME", None)
INITIAL_ADMIN_PASSWORD = os.getenv("INITIAL_ADMIN_PASSWORD", None)

if not DATABASE_PASSWORD:
    raise ValueError("DATABASE_PASSWORD environment variables must be set.")

logger = Logger()
app = FastAPI()

initial_countdown_time = 60
countdown_time = 60
is_countdown_on = False
countdown_start_time = 0
countdown_task = None

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
async def serve_react_app(request: Request, response: Response, db: Session = Depends(database.get_db)):
    """Serve the React app's index.html and set session cookie."""
    if countdown_start_time != 0:
        return RedirectResponse(url="/vote", status_code=302)

    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response

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
async def serve_vote(request: Request, db: Session = Depends(database.get_db)):
    """Serve the voting page."""
    if not get_is_countdown_on():
        return RedirectResponse(url="/", status_code=302)

    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response

    return FileResponse(frontend_build / "index.html")

async def simulate_voting_process():
    """Simulate the voting process for testing purposes."""
    global countdown_start_time

    with database.SessionLocal() as db:
        # Get all participants
        participants = database_manager.get_participants(db)
        if not participants:
            print("No participants found.")
            return

        while True:
            while countdown_start_time != 0:
                session_id = str(uuid.uuid4())
                database_manager.record_vote(db, session_id, participants[random.randint(0,len(participants)-1)]["id"])
                await asyncio.sleep(0.01 * random.randint(0,50))  # Simulate a delay between votes
            await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    global initial_countdown_time, countdown_time
    with database.SessionLocal() as db:
        initial_countdown_time = int(database_manager.get_setting(db, "countdown_time", 60))
        countdown_time = initial_countdown_time
        #Create initial admin user if it doesn't exist
        if database_manager.get_users_count(db) == 0:
            if not INITIAL_ADMIN_USERNAME or not INITIAL_ADMIN_PASSWORD:
                raise ValueError("INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD environment variables must be set.")
            database_manager.create_user(db, INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_PASSWORD)
            logger.info(f"Created initial admin user: {INITIAL_ADMIN_USERNAME}")

    #asyncio.create_task(simulate_voting_process())


def set_countdown_time(seconds: int):
    global countdown_time, initial_countdown_time
    countdown_time = seconds
    initial_countdown_time = seconds
    with database.SessionLocal() as db:
        database_manager.set_setting(db, "countdown_time", seconds)
    logger.info(f"Countdown time set to: {countdown_time}")

def toggle_countdown() -> bool:
    global countdown_start_time, countdown_time
    if countdown_start_time == 0:
        countdown_start_time = time.time()
    else:
        countdown_time = countdown_time - int(time.time() - countdown_start_time)
        countdown_start_time = 0
    logger.info(f"Countdown state set to: {countdown_start_time != 0}")
    return countdown_start_time != 0

def reset_countdown(db: Session):
    global countdown_time, countdown_start_time
    countdown_start_time = 0
    initial_countdown_time = int(database_manager.get_setting(db, "countdown_time", 60))
    countdown_time = initial_countdown_time
    logger.info("Countdown reset to default values.")

def get_is_countdown_on() -> bool:
    """Get the current countdown state."""
    global countdown_start_time, initial_countdown_time, countdown_time
    if countdown_start_time != 0:
        left = countdown_time - int(time.time() - countdown_start_time)
        if left <= 0:
            countdown_start_time = 0
            countdown_time = initial_countdown_time
    return countdown_start_time != 0

def get_countdown_time() -> int:
    """Get the current countdown time."""
    global countdown_time, countdown_start_time
    if countdown_start_time != 0:
        left = countdown_time - int(time.time() - countdown_start_time)
        if left <= 0:
            countdown_start_time = 0
            countdown_time = initial_countdown_time
    return countdown_time - int(time.time() - countdown_start_time) if countdown_start_time != 0 else countdown_time