from fastapi import APIRouter, Request
from fastapi.responses import FileResponse
from pathlib import Path
from typing import Union

from app.database_manager import DatabaseManager

router = APIRouter()

db = DatabaseManager()

@router.get("/get_participants")
async def get_participants():
    """Get the list of participants."""
    participants = db.get_participants()
    return {"participants": participants}

@router.get("/submit_vote/{participant_id}")
async def submit_vote(request: Request, participant_id: str):
    """Submit a vote for a participant."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        return {"error": "Session ID not found."}

    if db.session_voted(session_id):
        return {"error": "You have already voted."}

    success = db.record_vote(session_id, participant_id)
    if success:
        return {"message": "Vote recorded successfully."}
    else:
        return {"error": "Failed to record vote."}