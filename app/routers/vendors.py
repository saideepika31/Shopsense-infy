from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas


router = APIRouter(
    prefix="/vendor",
    tags=["Vendor"]
)


# =========================================================
# DATABASE
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# GET VENDOR PROFILE
# =========================================================

@router.get("/profile/{vendor_id}")
def get_vendor_profile(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    vendor = db.query(models.Vendor).filter(
        models.Vendor.vendor_id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return vendor


# =========================================================
# UPDATE VENDOR PROFILE
# =========================================================

@router.put("/profile/{vendor_id}")
def update_vendor_profile(
    vendor_id: int,
    vendor_data: schemas.VendorUpdate,
    db: Session = Depends(get_db)
):

    vendor = db.query(models.Vendor).filter(
        models.Vendor.vendor_id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    vendor.business_name = vendor_data.business_name
    vendor.owner_name = vendor_data.owner_name
    vendor.phone = vendor_data.phone
    vendor.address = vendor_data.address

    db.commit()
    db.refresh(vendor)

    return vendor


# =========================================================
# ADD PRODUCT
# =========================================================

@router.post("/product")
def add_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):

    vendor = db.query(models.Vendor).filter(
        models.Vendor.vendor_id == product.vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    new_product = models.Product(
        product_name=product.product_name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        category=product.category,
        vendor_id=product.vendor_id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# =========================================================
# GET ALL PRODUCTS
# =========================================================

@router.get("/products")
def get_products(
    db: Session = Depends(get_db)
):

    products = db.query(models.Product).all()

    return products


# =========================================================
# GET PRODUCTS OF ONE VENDOR
# =========================================================

@router.get("/products/{vendor_id}")
def get_vendor_products(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    vendor = db.query(models.Vendor).filter(
        models.Vendor.vendor_id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    products = db.query(models.Product).filter(
        models.Product.vendor_id == vendor_id
    ).all()

    return products