from pathlib import Path
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Request, Response
import uuid
from .database_manager import DatabaseManager

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

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str, request: Request, response: Response):
    # Check if session cookie exists, create one if not
    session_id = request.cookies.get("session_id")
    print(f"Session ID: {session_id}")  # Debugging line to check session ID
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=session_id, httponly=True)

    # Handle root path
    if not full_path:
        file_response = FileResponse(frontend_build / "index.html")
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response

    file_path = frontend_build / full_path
    if file_path.is_file():
        file_response = FileResponse(file_path)
        file_response.set_cookie(key="session_id", value=session_id, httponly=True)
        return file_response
    # Always serve index.html for client-side routes
    file_response =  FileResponse(frontend_build / "index.html")
    file_response.set_cookie(key="session_id", value=session_id, httponly=True)
    return file_response

@app.on_event("startup")
async def startup_event():
    if not db.get_participants():
        db.add_participant("1", "Alice")
        db.add_participant("2", "Bob")
        db.add_participant("3", "Charlie")
        db.add_participant("4", "Diana")