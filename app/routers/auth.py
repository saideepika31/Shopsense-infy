from ..security import create_access_token
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import schemas, crud

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(vendor: schemas.VendorCreate,
             db: Session = Depends(get_db)):

    return crud.create_vendor(db, vendor)


@router.post("/login")
def login(user: schemas.Login,
          db: Session = Depends(get_db)):

    db_user = crud.login(db, user.email, user.password)

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    token = create_access_token(
    data={
        "sub": db_user.email,
        "role": db_user.role,
        "id": db_user.id
    }
)

    return {
    "access_token": token,
    "token_type": "bearer",
    "role": db_user.role
}