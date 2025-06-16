from pymongo import MongoClient
import logging
from typing import Optional
from pymongo.database import Database

class DatabaseManager:
    """MongoDB database manager for the voting web server."""

    def __init__(self, url: str = "mongodb://localhost:27017/"):
        """Initialize the database connection.

        Args:
            connection_string: MongoDB connection string
        """
        self.client = MongoClient(url)
        self.db: Database = self.client["voting_db"]

    def session_voted(self, session_id: str) -> bool:
        """Check if a session has already voted.

        Args:
            session_id: Unique identifier for the session

        Returns:
            True if the session has voted, False otherwise
        """
        if not self.db:
            logging.error("Database not initialized.")
            return False

        collection = self.db["votes"]
        result = collection.find_one({"session_id": session_id})
        return result is not None

    def record_vote(self, session_id: str, participant_id: str) -> bool:
        """Record a vote for a participant by a session.

        Args:
            session_id: Unique identifier for the session
            participant_id: Unique identifier for the participant

        Returns:
            True if the vote was recorded successfully, False otherwise
        """
        if not self.db:
            logging.error("Database not initialized.")
            return False

        collection = self.db["votes"]
        collection.insert_one({
            "session_id": session_id,
            "participant_id": participant_id
        })

    def add_participant(self, participant_id: str, name: str) -> bool:
        """Add a new participant to the database.

        Args:
            participant_id: Unique identifier for the participant
            name: Name of the participant

        Returns:
            True if the participant was added successfully, False otherwise
        """
        if not self.db:
            logging.error("Database not initialized.")
            return False

        collection = self.db["participants"]
        result = collection.insert_one({
            "participant_id": participant_id,
            "name": name
        })
        return result.acknowledged

    def get_participants(self) -> Optional[list]:
        """Retrieve all participants from the database.

        Returns:
            List of participants or None if an error occurs
        """
        if not self.db:
            logging.error("Database not initialized.")
            return None

        collection = self.db["participants"]
        try:
            participants = list(collection.find({}, {"_id": 0}))
            return participants
        except Exception as e:
            logging.error(f"Error retrieving participants: {e}")
            return None