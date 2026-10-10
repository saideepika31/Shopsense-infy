from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================================
# CURRENT STOCK LEVELS
# ==========================================

@router.get("/{vendor_id}")
def get_inventory(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    products = db.query(models.Product).filter(
        models.Product.vendor_id == vendor_id
    ).all()

    return [
        {
            "product_id": product.product_id,
            "product_name": product.product_name,
            "category": product.category,
            "quantity": product.quantity,
            "status": (
                "Low Stock"
                if product.quantity <= 5
                else "In Stock"
            )
        }
        for product in products
    ]


# ==========================================
# LOW STOCK ALERTS
# ==========================================

@router.get("/{vendor_id}/low-stock")
def get_low_stock(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    products = db.query(models.Product).filter(
        models.Product.vendor_id == vendor_id,
        models.Product.quantity <= 5
    ).all()

    return [
        {
            "product_id": product.product_id,
            "product_name": product.product_name,
            "quantity": product.quantity,
            "threshold": 5,
            "alert": "Low Stock"
        }
        for product in products
    ]