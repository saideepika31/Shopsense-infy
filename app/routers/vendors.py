from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import crud, schemas

router = APIRouter(
    prefix="/vendor",
    tags=["Vendor"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/profile/{vendor_id}")
def get_profile(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    vendor = crud.get_vendor(db, vendor_id)

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return vendor


@router.put("/profile/{vendor_id}")
def update_profile(
    vendor_id: int,
    vendor: schemas.VendorUpdate,
    db: Session = Depends(get_db)
):

    updated = crud.update_vendor(
        db,
        vendor_id,
        vendor
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return updated

@router.post("/product")
def add_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):

    return crud.create_product(db, product)


@router.get("/products")
def view_products(
    db: Session = Depends(get_db)
):

    return crud.get_products(db)