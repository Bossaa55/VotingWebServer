from pathlib import Path
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

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
async def serve_react_app(full_path: str):
    # Handle root path
    if not full_path:
        return FileResponse(frontend_build / "index.html")
    
    file_path = frontend_build / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    # Always serve index.html for client-side routes
    return FileResponse(frontend_build / "index.html")