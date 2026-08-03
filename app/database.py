from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
DB_URL = "mysql+pymysql://root:Deepik%4031@localhost:3306/shopsense"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()