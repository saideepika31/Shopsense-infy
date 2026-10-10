from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..security import create_access_token
from ..database import SessionLocal
from .. import schemas, crud


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# DATABASE
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================
# REGISTER
# =========================

@router.post("/register")
def register(
    vendor: schemas.VendorCreate,
    db: Session = Depends(get_db)
):
    return crud.create_vendor(db, vendor)


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    user: schemas.Login,
    db: Session = Depends(get_db)
):

    # Check email and password
    db_user = crud.login(
        db,
        user.email,
        user.password
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # =========================
    # GET VENDOR ID
    # =========================

    vendor_id = None

    if db_user.role and db_user.role.lower() == "vendor":

        if db_user.vendor:
            vendor_id = db_user.vendor.vendor_id

    # =========================
    # CREATE TOKEN
    # =========================

    token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role,
            "id": db_user.id,
            "vendor_id": vendor_id
        }
    )

    # =========================
    # RESPONSE
    # =========================

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role,
        "id": db_user.id,
        "email": db_user.email,
        "vendor_id": vendor_id
    }