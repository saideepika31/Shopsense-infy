from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==========================================
# ADD PRODUCT
# ==========================================

@router.post("/")
def create_product(
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


# ==========================================
# GET PRODUCTS BY VENDOR
# ==========================================

@router.get("/vendor/{vendor_id}")
def get_vendor_products(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    products = db.query(
        models.Product
    ).filter(
        models.Product.vendor_id == vendor_id
    ).all()


    return products


# ==========================================
# DELETE PRODUCT
# ==========================================

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(
        models.Product
    ).filter(
        models.Product.product_id == product_id
    ).first()


    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    db.delete(product)

    db.commit()


    return {
        "message": "Product deleted successfully"
    }