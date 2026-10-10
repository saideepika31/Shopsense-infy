from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import SessionLocal
from ..models import Product, Transaction, Customer

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


# =========================================================
# 1. CUSTOMER SEGMENTATION
# =========================================================

@router.get("/customer-segments")
def customer_segments(
    db: Session = Depends(get_db)
):

    customers = db.query(Customer).all()

    result = []

    for customer in customers:

        total_spent = db.query(
            func.coalesce(func.sum(Transaction.total_amount), 0)
        ).filter(
            Transaction.customer_id == customer.customer_id
        ).scalar()

        if total_spent >= 10000:
            segment = "High Value"

        elif total_spent >= 5000:
            segment = "Medium Value"

        else:
            segment = "Low Value"

        result.append({
            "customer_id": customer.customer_id,
            "customer_name": customer.name,
            "total_spent": total_spent,
            "segment": segment
        })

    return result


# =========================================================
# 2. TOP SELLING PRODUCTS
# =========================================================

@router.get("/top-selling/{vendor_id}")
def top_selling_products(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    results = (
        db.query(
            Product.product_id,
            Product.product_name,
            Product.category,
            func.sum(Transaction.quantity).label("total_sold")
        )
        .join(
            Transaction,
            Transaction.product_id == Product.product_id
        )
        .filter(
            Transaction.vendor_id == vendor_id
        )
        .group_by(
            Product.product_id,
            Product.product_name,
            Product.category
        )
        .order_by(
            func.sum(Transaction.quantity).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "product_id": row.product_id,
            "product_name": row.product_name,
            "category": row.category,
            "total_sold": row.total_sold
        }
        for row in results
    ]


# =========================================================
# 3. HISTORICAL DATA VALIDATION
# =========================================================

@router.get("/historical-validation/{vendor_id}")
def historical_validation(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    historical_sales = db.query(
        func.coalesce(func.sum(Transaction.quantity), 0)
    ).filter(
        Transaction.vendor_id == vendor_id
    ).scalar()

    historical_revenue = db.query(
        func.coalesce(func.sum(Transaction.total_amount), 0)
    ).filter(
        Transaction.vendor_id == vendor_id
    ).scalar()

    transaction_count = db.query(
        Transaction
    ).filter(
        Transaction.vendor_id == vendor_id
    ).count()

    return {
        "vendor_id": vendor_id,
        "historical_sales": historical_sales,
        "historical_revenue": historical_revenue,
        "transaction_count": transaction_count,
        "validation_status": (
            "Historical data available"
            if transaction_count > 0
            else "No historical data available"
        )
    }


# =========================================================
# 4. VENDOR ANALYTICS
# =========================================================

@router.get("/{vendor_id}")
def vendor_analytics(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    total_products = db.query(Product).filter(
        Product.vendor_id == vendor_id
    ).count()

    total_sales = db.query(
        func.coalesce(func.sum(Transaction.quantity), 0)
    ).filter(
        Transaction.vendor_id == vendor_id
    ).scalar()

    total_revenue = db.query(
        func.coalesce(func.sum(Transaction.total_amount), 0)
    ).filter(
        Transaction.vendor_id == vendor_id
    ).scalar()

    return {
        "vendor_id": vendor_id,
        "total_products": total_products,
        "total_sales": total_sales,
        "total_revenue": total_revenue
    }