import time
import mysql.connector
from mysql.connector import Error
from typing import Any, Optional
import os

class DatabaseManager:
    """MySQL database manager for the voting web server."""

    #region Database Connection Management

    def __init__(self):
        """Initialize the database connection.

        Args:
            url: MySQL connection URL (optional, will use environment variables if not provided)
        """
        self.connection = None

        try:
            # Get connection parameters from environment variables
            host = os.getenv('DATABASE_HOST', 'mysql')
            port = int(os.getenv('DATABASE_PORT', '3306'))
            user = 'root'
            password = os.getenv('DATABASE_PASSWORD', '')
            database = 'voting_db'


            while not self.connection:
                print(f"Connecting to MySQL at {host}:{port} as user {user} with database {database}")
                try:
                    self.connection = mysql.connector.connect(
                        host=host,
                        port=port,
                        user=user,
                        password=password,
                        database=database,
                        autocommit=True
                    )
                    if not self.connection:
                        print("Failed to connect to the database, retrying in 5 seconds...")
                        time.sleep(5)
                except Error as e:
                    print(f"Error connecting to MySQL: {e}")
                    print("Retrying in 5 seconds...")
                    time.sleep(5)

            print(f"Connected to MySQL at {host}:{port} as user {user} with database {database}")

        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            self.connection = None

    def close(self):
        """Close the database connection."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Database connection closed.")

    #endregion

    #region Voting Operations

    def session_voted(self, session_id: str) -> bool:
        """Check if a session has already voted.

        Args:
            session_id: Unique identifier for the session

        Returns:
            True if the session has voted, False otherwise
        """
        if not self.connection:
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT 1 FROM votes WHERE session_id = %s", (session_id,))
            result = cursor.fetchone()
            cursor.close()
            return result is not None
        except Error as e:
            print(f"Error checking if session voted: {e}")
            return False

    def record_vote(self, session_id: str, participant_id: str) -> bool:
        """Record a vote for a participant by a session.

        Args:
            session_id: Unique identifier for the session
            participant_id: Unique identifier for the participant

        Returns:
            True if the vote was recorded successfully, False otherwise
        """
        if not self.connection:
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO votes (session_id, participant_id) VALUES (%s, %s)",
                (session_id, participant_id)
            )
            cursor.close()
            print(f"Vote recorded: session {session_id} voted for participant {participant_id}")
            return True
        except Error as e:
            print(f"Error recording vote: {e}")
            return False

    def get_vote_info(self, session_id: str) -> Optional[dict]:
        """Get information about the voting session.

        Args:
            session_id: Unique identifier for the session

        Returns:
            Dictionary with session information or None if error
        """
        if not self.connection:
            print("Database not connected.")
            return None

        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute("SELECT v.created_at, p.id, p.name FROM votes v, participants p WHERE p.id = v.participant_id AND v.session_id = %s", (session_id,))
            vote_info = cursor.fetchall()
            cursor.close()

            if not vote_info:
                return None

            # Ensure the result is a dictionary before returning
            first_vote = vote_info[0]
            if isinstance(first_vote, dict):
                return first_vote
            else:
                return None
        except Error as e:
            print(f"Error getting vote info: {e}")
            return None

    def get_vote_counts(self) -> Optional[list]:
        """Get vote counts for all participants.

        Returns:
            List of dictionaries with participant info and vote counts, or None if error
        """
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute("""
                SELECT p.id, p.name, COALESCE(v.vote_count, 0) as votes
                FROM participants p
                LEFT JOIN (
                    SELECT participant_id, COUNT(*) as vote_count
                    FROM votes
                    GROUP BY participant_id
                ) v ON p.id = v.participant_id
                ORDER BY votes DESC, p.name
            """)
            results = cursor.fetchall()
            cursor.close()

            # For regular cursor, results are tuples that can be accessed by index
            result_list = []
            for row in results:
                if isinstance(row, tuple) and len(row) >= 3:
                    result_list.append({
                        "id": row[0],
                        "name": row[1],
                        "votes": row[2],
                        "imageUrl": f"/api/img/{row[0]}"
                    })
            return result_list
        except Error as e:
            print(f"Error getting vote counts: {e}")
            return None

    def reset_votes(self) -> bool:
        """Reset all votes in the database.

        Returns:
            True if votes were reset successfully, False otherwise
        """
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute("DELETE FROM votes")
            self.connection.commit()
            cursor.close()
            print("All votes have been reset.")
            return True
        except Error as e:
            print(f"Error resetting votes: {e}")
            return False

    #endregion

    #region Participant Management

    def add_participant(self, participant_id: str, name: str) -> bool:
        """Add a new participant to the database.

        Args:
            participant_id: Unique identifier for the participant
            name: Name of the participant

        Returns:
            True if the participant was added successfully, False otherwise
        """
        if not self.connection:
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO participants (id, name) VALUES (%s, %s) ON DUPLICATE KEY UPDATE name = VALUES(name)",
                (participant_id, name)
            )
            cursor.close()
            print(f"Participant added/updated: {participant_id} - {name}")
            return True
        except Error as e:
            print(f"Error adding participant: {e}")
            return False

    def update_participant(self, participant_id: str, name: str) -> bool:
        """Update an existing participant's name.

        Args:
            participant_id: Unique identifier for the participant
            name: New name for the participant

        Returns:
            True if the participant was updated successfully, False otherwise
        """
        if not self.connection:
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "UPDATE participants SET name = %s WHERE id = %s",
                (name, participant_id)
            )
            cursor.close()
            print(f"Participant updated: {participant_id} - {name}")
            return True
        except Error as e:
            print(f"Error updating participant: {e}")
            return False

    def delete_participant(self, participant_id: str) -> bool:
        """Delete a participant from the database.

        Args:
            participant_id: Unique identifier for the participant

        Returns:
            True if the participant was deleted successfully, False otherwise
        """
        if not self.connection:
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute("DELETE FROM participants WHERE id = %s", (participant_id,))
            cursor.close()
            print(f"Participant deleted: {participant_id}")
            return True
        except Error as e:
            print(f"Error deleting participant: {e}")
            return False

    def get_participants(self) -> Optional[list]:
        """Retrieve all participants from the database.

        Returns:
            List of participants or None if an error occurs
        """
        if not self.connection:
            print("Database not connected.")
            return None

        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute("SELECT id, name FROM participants ORDER BY name")
            participants = cursor.fetchall()
            cursor.close()

            # Add imageUrl to each participant
            for participant in participants:
                if isinstance(participant, dict):
                    participant["imageUrl"] = f"/api/img/{participant['id']}"

            return participants
        except Error as e:
            print(f"Error retrieving participants: {e}")
            return None

    def get_participant(self, participant_id: str) -> Optional[dict]:
        """Get details of a specific participant.

        Args:
            participant_id: Unique identifier for the participant

        Returns:
            Dictionary with participant details or None if not found
        """
        if not self.connection:
            print("Database not connected.")
            return None

        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute("SELECT id, name FROM participants WHERE id = %s", (participant_id,))
            participant = cursor.fetchone()
            cursor.close()

            if participant:
                if isinstance(participant, dict):
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

    def authenticate_user(self, username: str, password: str) -> Optional[bool]:
        """Authenticate user."""
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return None

        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
            result = cursor.fetchone()
            cursor.close()

            if result:
                stored_hash: str = str(list(result)[0])
                from app.auth_utils import verify_password
                return verify_password(password, stored_hash)
            return False
        except Exception as e:
            print(f"Error authenticating user: {e}")
            return False

    def create_user(self, username, password: str) -> bool:
        """Create a new user in the database."""
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return False

        try:
            from app.auth_utils import get_password_hash
            hashed_password = get_password_hash(password)

            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s)",
                (username, hashed_password)
            )
            self.connection.commit()
            cursor.close()
            print(f"User created: {username}")
            return True
        except Error as e:
            print(f"Error creating user: {e}")
            return False

    def get_users_count(self) -> int:
        """Get the count of users in the database."""
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return 0

        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            result = cursor.fetchone()
            cursor.close()
            if result and len(result) > 0:
                # For regular cursor, result is a tuple
                if isinstance(result, tuple):
                    count_value = result[0]
                    if isinstance(count_value, int):
                        return count_value
                    elif isinstance(count_value, str) and count_value.isdigit():
                        return int(count_value)
                return 0
            else:
                return 0
        except Error as e:
            print(f"Error getting users count: {e}")
            return 0

    #endregion

    #region Settings

    def get_setting(self, key: str, default_value: Any = None) -> Any:
        """Get a setting value by key.

        Args:
            key: The key of the setting
            default_value: Default value to return if the setting is not found

        Returns:
            The value of the setting or default_value if not found
        """
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return default_value

        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute("SELECT value FROM settings WHERE `key` = %s", (key,))
            result = cursor.fetchone()
            cursor.close()
            if result:
                if isinstance(result, dict):
                    return result.get("value", default_value)
                elif isinstance(result, (tuple, list)) and len(result) > 0:
                    return result[0]
            return default_value
        except Error as e:
            print(f"Error getting setting {key}: {e}")
            return default_value

    def set_setting(self, key: str, value: Any) -> bool:
        """Set a setting value by key.

        Args:
            key: The key of the setting
            value: The value to set

        Returns:
            True if the setting was set successfully, False otherwise
        """
        if not self.connection or not self.connection.is_connected():
            print("Database not connected.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO settings (`key`, value) VALUES (%s, %s) ON DUPLICATE KEY UPDATE value = VALUES(value)",
                (key, value)
            )
            self.connection.commit()
            cursor.close()
            print(f"Setting {key} set to {value}")
            return True
        except Error as e:
            print(f"Error setting {key}: {e}")
            return False

    #endregion