from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import crud

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{vendor_id}")
def analytics(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    return crud.get_vendor_analytics(
        db,
        vendor_id
    )