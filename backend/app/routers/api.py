import asyncio
import os
import uuid
from app.logger import Logger
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from app.database_manager import DatabaseManager
from app import auth_utils
from fastapi import UploadFile, File, Form, WebSocket, WebSocketDisconnect

from app.routers import admin

DATABASE_USER = os.getenv("DATABASE_USER", None)
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", None)

logger = Logger()
router = APIRouter()
router.include_router(admin.router, prefix="/admin", tags=["admin"])

db = DatabaseManager()

#region Participant Management

@router.get("/participants")
async def get_participants():
    """Get the list of participants."""
    participants = db.get_participants()
    return {"participants": participants}

@router.get("/participant/{participant_id}")
async def get_participant(participant_id: str):
    """Get details of a specific participant."""
    participant = db.get_participant(participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"participant": participant}

#endregion

#region Voting Operations

@router.get("/vote-info")
async def vote_info(request: Request):
    """Get information about the voting session."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID not found")

    vote_info = db.get_vote_info(session_id)

    if not vote_info:
        raise HTTPException(status_code=404, detail="Vote information not found")

    return vote_info

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

#endregion

#region Static File Serving

@router.get("/img/{id}")
async def get_image(id: str):
    """Serve an image file."""
    image_path = Path("/data/images") / f"{id}.jpg"
    if image_path.is_file():
        return FileResponse(image_path)
    raise HTTPException(status_code=404, detail="Image not found")

#endregion