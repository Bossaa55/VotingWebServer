import asyncio
import os
import random
import time
import uuid
from app.logger import Logger
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List, Dict, Any

from app.database_manager import DatabaseManager
from app import auth_utils
from fastapi import UploadFile, File, Form, WebSocket, WebSocketDisconnect

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
    vote_results = db.get_vote_counts()
    if vote_results:
        for participant in vote_results:
            participant["imageUrl"] = f"/api/img/{participant['id']}"
    return {"participants": vote_results}

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
    request: Request,
    participant_id: str = Form(...),
    name: str = Form(...),
    image: UploadFile = File(None)
):
    """Update an existing participant's details."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")

    if db.get_participant(participant_id) is None:
        raise HTTPException(status_code=404, detail="Participant not found")

    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    if image:
        print(f"Updating image for participant {participant_id}")
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


@router.delete("/admin/delete-participant/{participant_id}")
async def delete_participant(request: Request, participant_id: str):
    """Delete a participant."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

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

@router.post("/admin/set-countdown")
async def set_countdown(request: Request, seconds: int = Form(...)):
    """Set the countdown time for voting."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if seconds <= 0:
        raise HTTPException(status_code=400, detail="Countdown time must be positive")

    db.set_setting("countdown_time", seconds)
    from app.main import set_countdown_time
    set_countdown_time(seconds)
    return {"message": "Countdown time set successfully", "countdown_time": seconds}

@router.get("/admin/countdown-time")
async def get_countdown_time():
    """Get the current countdown time."""
    countdown_time = db.get_setting("countdown_time", 60)
    return {"countdown_time": countdown_time}

@router.post("/admin/toggle-countdown")
async def toggle_countdown(request: Request):
    """Toggle the countdown state."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    from app.main import set_is_countdown_on, is_countdown_on, countdown_time
    set_is_countdown_on(not is_countdown_on)

    return {"message": "Countdown state toggled", "is_countdown_on": not is_countdown_on, "countdown_time": countdown_time}

@router.get("/admin/contdown-status")
async def is_countdown_on():
    """Check if the countdown is currently on."""
    from app.main import get_is_countdown_on, get_countdown_time
    return {"is_countdown_on": get_is_countdown_on(), "countdown_time": get_countdown_time()}

@router.post("/admin/reset-votes")
async def reset_votes(request: Request):
    """Reset all votes."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    db.reset_votes()
    return {"message": "Votes reset successfully"}

@router.websocket("/admin/subscribe-participants")
async def subscribe_participants(websocket: WebSocket):
    """WebSocket endpoint to subscribe to participant updates."""
    from app.main import get_is_countdown_on, get_countdown_time
    await websocket.accept()
    try:
        previous_participants = None
        while True:
            send_updates = get_is_countdown_on()
            while send_updates:
                vote_results = db.get_vote_counts()
                if vote_results:
                    for participant in vote_results:
                        participant["imageUrl"] = f"/api/img/{participant['id']}"
                if previous_participants != vote_results:
                    previous_participants = vote_results
                    await websocket.send_json({"participants": vote_results, "countdown_time": get_countdown_time()})
                await asyncio.sleep(0.01)  # Use asyncio.sleep instead of time.sleep
                send_updates = get_is_countdown_on()
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

#endregion