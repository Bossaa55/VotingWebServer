import asyncio
import os
import uuid
from app.logger import Logger
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from sqlalchemy.orm import Session

from app import database, database_manager
from app import auth_utils
from fastapi import UploadFile, File, Form, WebSocket, WebSocketDisconnect

from app.routers import admin

DATABASE_USER = os.getenv("DATABASE_USER", None)
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", None)

logger = Logger()
router = APIRouter()
router.include_router(admin.router, prefix="/admin", tags=["admin"])

#region Participant Management

@router.get("/participants")
async def get_participants(db: Session = Depends(database.get_db)):
    """Get the list of participants."""
    participants = database_manager.get_participants(db)
    return {"participants": participants}

@router.get("/participant/{participant_id}")
async def get_participant(participant_id: str, db: Session = Depends(database.get_db)):
    """Get details of a specific participant."""
    participant = database_manager.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"participant": participant}

#endregion

#region Voting Operations

@router.get("/vote-info")
async def vote_info(request: Request, db: Session = Depends(database.get_db)):
    """Get information about the voting session."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID not found")

    vote_info = database_manager.get_vote_info(db, session_id)

    if not vote_info:
        raise HTTPException(status_code=404, detail="Vote information not found")

    return vote_info

@router.post("/vote/{participant_id}")
async def submit_vote(request: Request, participant_id: str, db: Session = Depends(database.get_db)):
    """Submit a vote for a participant."""
    from app.main import get_is_countdown_on
    if not get_is_countdown_on():
        raise HTTPException(status_code=400, detail="Voting is not currently active")

    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID not found")

    if database_manager.session_voted(db, session_id):
        raise HTTPException(status_code=400, detail="You have already voted")

    success = database_manager.record_vote(db, session_id, participant_id)
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
    else:
        return FileResponse("/data/images/default.svg")

#endregion