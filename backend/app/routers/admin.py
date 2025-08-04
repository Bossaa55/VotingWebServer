
import asyncio
from pathlib import Path
from sqlalchemy.orm import Session
import uuid
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, WebSocket, WebSocketDisconnect

from app import auth_utils
from app import database, database_manager
from app.logger import Logger
from app import utils

logger = Logger()
router = APIRouter()

#region Admin - Vote Results and Monitoring

@router.get("/vote-results")
async def get_vote_results(request: Request, db: Session = Depends(database.get_db)):
    """Get current vote results."""
    # You'll need to implement this in your database manager
    # For now, returning a placeholder
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    vote_results = database_manager.get_vote_counts(db)
    return {"participants": vote_results}

#endregion

#region Admin - Participant Management

@router.post("/add-participant")
async def add_participant(
    request: Request,
    name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    """Add a new participant with an image file."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if not name or not image:
        raise HTTPException(status_code=400, detail="Invalid participant data")

    if image.content_type:
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
    else:
        raise HTTPException(status_code=400, detail="File must be an image")

    image_data = await image.read()
    optimized_image_data = utils.optimize_image(image_data)

    if not optimized_image_data:
        raise HTTPException(status_code=500, detail="Invalid image file")

    id = str(uuid.uuid4())

    image_dir = Path("/data/images")
    image_dir.mkdir(parents=True, exist_ok=True)
    image_path = image_dir / f"{id}.jpg"
    with image_path.open("wb") as f:
        f.write(optimized_image_data)

    success = database_manager.add_participant(db, id, name)
    if success:
        return {"message": "Participant added successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to add participant")

@router.patch("/update-participant")
async def update_participant(
    request: Request,
    participant_id: str = Form(...),
    name: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db)
):
    """Update an existing participant's details."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")

    if database_manager.get_participant(db, participant_id) is None:
        raise HTTPException(status_code=404, detail="Participant not found")

    if not name:
        raise HTTPException(status_code=400, detail="Name is required")

    if image:
        if image.content_type:
            if not image.content_type.startswith('image/'):
                raise HTTPException(status_code=400, detail="File must be an image")
        else:
            raise HTTPException(status_code=400, detail="File must be an image")

        image_data = await image.read()
        optimized_image_data = utils.optimize_image(image_data)

        if not optimized_image_data:
            raise HTTPException(status_code=500, detail="Invalid image file")

        image_dir = Path("/data/images")
        image_dir.mkdir(parents=True, exist_ok=True)
        image_path = image_dir / f"{participant_id}.jpg"
        with image_path.open("wb") as f:
            f.write(optimized_image_data)

    success = database_manager.update_participant(db, participant_id, name)
    if success:
        return {"message": "Participant updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to update participant")

@router.delete("/delete-participant/{participant_id}")
async def delete_participant(request: Request, participant_id: str, db: Session = Depends(database.get_db)):
    """Delete a participant."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if not participant_id:
        raise HTTPException(status_code=400, detail="Participant ID is required")

    success = database_manager.delete_participant(db, participant_id)
    if success:
        image_path = Path("/data/images") / f"{participant_id}.jpg"
        if image_path.is_file():
            image_path.unlink()
        return {"message": "Participant deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete participant")

#endregion

#region Admin - Countdown and Voting Control

@router.post("/set-countdown")
async def set_countdown(request: Request, seconds: int = Form(...), db: Session = Depends(database.get_db)):
    """Set the countdown time for voting."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    if seconds <= 0:
        raise HTTPException(status_code=400, detail="Countdown time must be positive")

    database_manager.set_setting(db, "countdown_time", seconds)
    from app.main import set_countdown_time
    set_countdown_time(seconds)
    return {"message": "Countdown time set successfully", "countdown_time": seconds}

@router.get("/countdown-time")
async def get_countdown_time(db: Session = Depends(database.get_db)):
    """Get the current countdown time."""
    countdown_time = database_manager.get_setting(db, "countdown_time", 60)
    return {"countdown_time": countdown_time}

@router.post("/toggle-countdown")
async def toggle_countdown(request: Request):
    """Toggle the countdown state."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    from app.main import set_is_countdown_on, is_countdown_on, countdown_time
    set_is_countdown_on(not is_countdown_on)

    return {"message": "Countdown state toggled", "is_countdown_on": not is_countdown_on, "countdown_time": countdown_time}

@router.get("/contdown-status")
async def is_countdown_on():
    """Check if the countdown is currently on."""
    from app.main import get_is_countdown_on, get_countdown_time
    return {"is_countdown_on": get_is_countdown_on(), "countdown_time": get_countdown_time()}

@router.post("/reset-votes")
async def reset_votes(request: Request, db: Session = Depends(database.get_db)):
    """Reset all votes."""
    access_token = request.cookies.get("access_token")
    if not access_token or not auth_utils.verify_token(access_token):
        raise HTTPException(status_code=401, detail="Unauthorized access")

    from app.main import reset_countdown
    reset_countdown(db)

    database_manager.reset_votes(db)
    return {"message": "Votes reset successfully"}

@router.websocket("/subscribe-participants")
async def subscribe_participants(websocket: WebSocket):
    """WebSocket endpoint to subscribe to participant updates."""
    from app.main import get_is_countdown_on, get_countdown_time
    await websocket.accept()
    try:
        previous_participants = None
        while True:
            send_updates = get_is_countdown_on()
            while send_updates:
                with database.SessionLocal() as db:
                    vote_results = database_manager.get_vote_counts(db)
                    if previous_participants != vote_results:
                        previous_participants = vote_results
                        await websocket.send_json({"participants": vote_results, "countdown_time": get_countdown_time()})
                    await asyncio.sleep(0.01)
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