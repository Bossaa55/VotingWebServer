import time
import mysql.connector
from mysql.connector import Error
from typing import Any, Optional
from sqlalchemy.orm import Session
import os

from app import models


#region Voting Operations

def session_voted(db: Session, session_id: str) -> bool:
    """Check if a session has already voted.

    Args:
        session_id: Unique identifier for the session

    Returns:
        True if the session has voted, False otherwise
    """
    try:
        result = db.query(models.Vote).filter(models.Vote.session_id == session_id).first()
        return result is not None
    except Error as e:
        print(f"Error checking if session voted: {e}")
        return False

def record_vote(db: Session, session_id: str, participant_id: str) -> bool:
    """Record a vote for a participant by a session.

    Args:
        session_id: Unique identifier for the session
        participant_id: Unique identifier for the participant

    Returns:
        True if the vote was recorded successfully, False otherwise
    """
    try:
        db_vote = models.Vote(session_id=session_id, participant_id=participant_id)
        db.add(db_vote)
        db.commit()
        db.refresh(db_vote)
        print(f"Vote recorded: session {session_id} voted for participant {participant_id}")
        return True
    except Error as e:
        print(f"Error recording vote: {e}")
        return False

def get_vote_info(db: Session, session_id: str) -> Optional[dict]:
    """Get information about the voting session.

    Args:
        session_id: Unique identifier for the session

    Returns:
        Dictionary with session information or None if error
    """
    try:
        result = (
            db.query(models.Vote, models.Participant)
            .filter(models.Vote.session_id == session_id)
            .join(models.Participant, models.Participant.id == models.Vote.participant_id)
            .first()
        )
        if result:
            vote, participant = result
            vote_info = {"id": participant.id, "name": participant.name}
            return vote_info
        else:
            return None
        return result.__dict__ if result else None
    except Error as e:
        print(f"Error getting vote info: {e}")
        return None

def get_vote_counts(db: Session) -> Optional[list]:
    """Get vote counts for all participants.

    Returns:
        List of dictionaries with participant info and vote counts, or None if error
    """
    try:
        results = db.query(models.VoteCount).all()

        # For regular cursor, results are tuples that can be accessed by index
        result_list = []
        for row in results:
            result_list.append({
                "id": row.id,
                "name": row.name,
                "votes": row.votes,
                "imageUrl": f"/api/img/{row.id}"
            })
        return result_list
    except Error as e:
        print(f"Error getting vote counts: {e}")
        return None

def reset_votes(db: Session) -> bool:
    """Reset all votes in the database.

    Returns:
        True if votes were reset successfully, False otherwise
    """
    try:
        db.query(models.Vote).delete()
        db.commit()
        print("All votes have been reset.")
        return True
    except Error as e:
        print(f"Error resetting votes: {e}")
        return False

#endregion

#region Participant Management

def add_participant(db: Session, participant_id: str, name: str) -> bool:
    """Add a new participant to the database.

    Args:
        participant_id: Unique identifier for the participant
        name: Name of the participant

    Returns:
        True if the participant was added successfully, False otherwise
    """
    try:
        db_participant = models.Participant(id=participant_id, name=name)
        db.add(db_participant)
        db.commit()
        db.refresh(db_participant)
        print(f"Participant added/updated: {participant_id} - {name}")
        return True
    except Error as e:
        print(f"Error adding participant: {e}")
        return False

def update_participant(db: Session, participant_id: str, name: str) -> bool:
    """Update an existing participant's name.

    Args:
        participant_id: Unique identifier for the participant
        name: New name for the participant

    Returns:
        True if the participant was updated successfully, False otherwise
    """
    try:
        db_participant = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
        if not db_participant:
            print(f"Participant {participant_id} not found.")
            return False
        setattr(db_participant, 'name', name)
        db.commit()
        db.refresh(db_participant)
        print(f"Participant updated: {participant_id} - {name}")
        return True
    except Error as e:
        print(f"Error updating participant: {e}")
        return False

def delete_participant(db: Session, participant_id: str) -> bool:
    """Delete a participant from the database.

    Args:
        participant_id: Unique identifier for the participant

    Returns:
        True if the participant was deleted successfully, False otherwise
    """
    try:
        db_participant = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
        if not db_participant:
            print(f"Participant {participant_id} not found.")
            return False
        db.delete(db_participant)
        db.commit()

        print(f"Participant deleted: {participant_id}")
        return True
    except Error as e:
        print(f"Error deleting participant: {e}")
        return False

def get_participants(db: Session) -> Optional[list]:
    """Retrieve all participants from the database.

    Returns:
        List of participants or None if an error occurs
    """
    try:
        result = db.query(models.Participant).order_by(models.Participant.name).all()

        participants = []
        # Add imageUrl to each participant
        for res in result:
            participant = res.__dict__
            participant["imageUrl"] = f"/api/img/{participant['id']}"
            participants.append(participant)

        return participants
    except Error as e:
        print(f"Error retrieving participants: {e}")
        return None

def get_participant(db: Session, participant_id: str) -> Optional[dict]:
    """Get details of a specific participant.

    Args:
        participant_id: Unique identifier for the participant

    Returns:
        Dictionary with participant details or None if not found
    """
    try:
        result = db.query(models.Participant).filter(models.Participant.id == participant_id).first()
        if result:
            participant = result.__dict__
            participant["imageUrl"] = f"/api/img/{participant['id']}"
            return participant
        else:
            print(f"Participant {participant_id} not found.")
            return None
    except Error as e:
        print(f"Error retrieving participant {participant_id}: {e}")
        return None

#endregion

#region User Authentication

def authenticate_user(db: Session, username: str, password: str) -> Optional[bool]:
    try:
        result = db.query(models.User).filter(models.User.username == username).first()

        if result:
            stored_hash: str = str(result.password)
            from app.auth_utils import verify_password
            return verify_password(password, stored_hash)
        return False
    except Exception as e:
        print(f"Error authenticating user: {e}")
        return False

def create_user(db: Session, username, password: str) -> bool:
    """Create a new user in the database."""
    try:
        from app.auth_utils import get_password_hash
        hashed_password = get_password_hash(password)

        db_user = models.User(username=username, password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        print(f"User created: {username}")
        return True
    except Error as e:
        print(f"Error creating user: {e}")
        return False

def get_users_count(db: Session) -> int:
    """Get the count of users in the database."""
    try:
        result = db.query(models.User).count()
        return result if isinstance(result, int) else 0
    except Error as e:
        print(f"Error getting users count: {e}")
        return 0

#endregion

#region Settings

def get_setting(db: Session, key: str, default_value: Any = None) -> Any:
    """Get a setting value by key.

    Args:
        key: The key of the setting
        default_value: Default value to return if the setting is not found

    Returns:
        The value of the setting or default_value if not found
    """
    try:
        result = db.query(models.Setting).filter(models.Setting.key == key).first()
        if result:
            return result.value
        return default_value
    except Error as e:
        print(f"Error getting setting {key}: {e}")
        return default_value

def set_setting(db: Session, key: str, value: Any) -> bool:
    """Set a setting value by key.

    Args:
        key: The key of the setting
        value: The value to set

    Returns:
        True if the setting was set successfully, False otherwise
    """
    try:
        db_setting = db.query(models.Setting).filter(models.Setting.key == key).first()
        if db_setting:
            db_setting.value = value
        else:
            db_setting = models.Setting(key=key, value=value)
            db.add(db_setting)
        db.commit()
        db.refresh(db_setting)

        print(f"Setting {key} set to {value}")
        return True
    except Error as e:
        print(f"Error setting {key}: {e}")
        return False

#endregion