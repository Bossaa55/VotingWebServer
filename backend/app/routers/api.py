import os
from app.logger import Logger
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List, Dict, Any

from app.database_manager import DatabaseManager

DATABASE_USER = os.getenv("DATABASE_USER", None)
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", None)

logger = Logger()
router = APIRouter()

db = DatabaseManager()

@router.get("/participants")
async def get_participants():
    """Get the list of participants."""
    participants = db.get_participants()
    return {"participants": participants}

@router.post("/vote/{participant_id}")
async def submit_vote(request: Request, participant_id: str):
    """Submit a vote for a participant."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID not found")

    if db.session_voted(session_id):
        raise HTTPException(status_code=400, detail="You have already voted")

    success = db.record_vote(session_id, participant_id)
    if success:
        return {"message": "Vote recorded successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to record vote")

@router.get("/vote-results")
async def get_vote_results():
    """Get current vote results."""
    # You'll need to implement this in your database manager
    # For now, returning a placeholder
    return {"results": "Vote results endpoint - implement in database manager"}

@router.get("/img/{id}")
async def get_image(id: str):
    """Serve an image file."""
    image_path = Path("app/data/images") / f"{id}.jpg"
    if image_path.is_file():
        return FileResponse(image_path)
    raise HTTPException(status_code=404, detail="Image not found")