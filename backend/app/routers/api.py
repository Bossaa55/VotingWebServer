import os
import time
import uuid
from app.logger import Logger
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List, Dict, Any

from app.database_manager import DatabaseManager
from app import auth_utils
from fastapi import UploadFile, File, Form

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

@router.get("/participant/{participant_id}")
async def get_participant(participant_id: str):
    """Get details of a specific participant."""
    participant = db.get_participant(participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"participant": participant}

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

@router.get("/vote-results")
async def get_vote_results():
    """Get current vote results."""
    # You'll need to implement this in your database manager
    # For now, returning a placeholder
    return db.get_vote_counts()

@router.get("/img/{id}")
async def get_image(id: str):
    """Serve an image file."""
    image_path = Path("/data/images") / f"{id}.jpg"
    if image_path.is_file():
        return FileResponse(image_path)
    raise HTTPException(status_code=404, detail="Image not found")

#region Admin Routes

@router.post("/admin/add-participant")
async def add_participant(
    request: Request,
    name: str = Form(...),
    image: UploadFile = File(...)
):
    """Add a new participant with an image file."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if not name or not image:
        raise HTTPException(status_code=400, detail="Invalid participant data")

    id = str(uuid.uuid4())

    image_dir = Path("/data/images")
    image_dir.mkdir(parents=True, exist_ok=True)
    image_path = image_dir / f"{id}.jpg"
    with image_path.open("wb") as f:
        f.write(await image.read())

    success = db.add_participant(id, name)
    if success:
        return {"message": "Participant added successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to add participant")

@router.patch("/admin/update-participant")
async def update_participant(
    participant_id: str = Form(...),
    name: str = Form(...),
    image: UploadFile = File(None)
):
    """Update an existing participant's details."""
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    if image:
        image_dir = Path("/data/images")
        image_dir.mkdir(parents=True, exist_ok=True)
        image_path = image_dir / f"{participant_id}.jpg"
        with image_path.open("wb") as f:
            f.write(await image.read())

    success = db.update_participant(participant_id, name)
    if success:
        return {"message": "Participant updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update participant")


@router.delete("/admin/delete-participant")
async def delete_participant(participant_id: str = Form(...)):
    """Delete a participant."""
    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")

    success = db.delete_participant(participant_id)
    if success:
        image_path = Path("/data/images") / f"{participant_id}.jpg"
        if image_path.is_file():
            image_path.unlink()
        return {"message": "Participant deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete participant")
#endregion