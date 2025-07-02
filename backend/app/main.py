from app.logger import Logger
import os
from pathlib import Path
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

from app.routers import api
from .database_manager import DatabaseManager

DATABASE_USER = os.getenv("DATABASE_USER", None)
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", None)

if not DATABASE_USER or not DATABASE_PASSWORD:
    raise ValueError("DATABASE_USER and DATABASE_PASSWORD environment variables must be set.")

logger = Logger()
app = FastAPI()
db = DatabaseManager()

frontend_build = Path(__file__).parent / "frontend"

origins = [
    "http://localhost:8000",
    "localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include API router
app.include_router(api.router, prefix="/api", tags=["api"])

if frontend_build.exists():
    app.mount("/static", StaticFiles(directory=frontend_build / "assets"), name="static")
    for static_dir in ["assets"]:
        static_path = frontend_build / static_dir
        if static_path.exists():
            app.mount(f"/{static_dir}", StaticFiles(directory=static_path), name=static_dir)


@app.get("/")
async def serve_react_app(request: Request, response: Response):
    """Serve the React app's index.html and set session cookie."""
    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response

    return FileResponse(frontend_build / "index.html")


@app.get("/{path:path}")
async def serve_react_routes(request: Request, path: str):
    """
    Catch-all route to serve React app for client-side routing.
    This ensures that React Router can handle all routes.
    """
    # Don't serve React app for API routes
    if path.startswith("api/"):
        return {"error": "API endpoint not found"}

    session_id = request.cookies.get("session_id")

    file_path = frontend_build / path
    if file_path.is_file():
        return FileResponse(file_path)

    if not session_id:
        session_id = str(uuid.uuid4())
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response

    return FileResponse(frontend_build / "index.html")