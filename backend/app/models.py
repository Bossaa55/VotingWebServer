
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Participant(Base):
    __tablename__ = 'participants'

    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)

    def __repr__(self):
        return f"<Participant(id={self.id}, name={self.name})>"

class Vote(Base):
    __tablename__ = 'votes'

    session_id = Column(String(255), primary_key=True, nullable=False)
    participant_id = Column(Integer, ForeignKey('participants.id'), nullable=False)

    participant = relationship("Participant")

    def __repr__(self):
        return f"<Vote(session_id={self.session_id}, participant_id={self.participant_id})>"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username})>"

class Setting(Base):
    __tablename__ = 'settings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(255), unique=True, nullable=False)
    value = Column(String(255), nullable=False)

    def __repr__(self):
        return f"<Setting(key={self.key}, value={self.value})>"

class VoteCount(Base):
    __tablename__ = 'vote_counts'

    id = Column(String(255), primary_key=True, nullable=False)
    name = Column(String(255), nullable=False)
    votes = Column(Integer, default=0)

    def __repr__(self):
        return f"<VoteCount(id={self.id}, name={self.name}, votes={self.votes})>"