import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

engine = create_engine(
    f"mysql+pymysql://root:{DATABASE_PASSWORD}@mysql/voting_db",
    pool_size=30,
    max_overflow=5
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()