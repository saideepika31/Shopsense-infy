from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from ..database import SessionLocal
from .. import models
import csv
import io


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/vendor/{vendor_id}/monthly-sales")
def get_monthly_sales(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            extract("month", models.Transaction.transaction_date).label("month"),
            func.sum(models.Transaction.quantity).label("sales"),
            func.sum(models.Transaction.total_amount).label("revenue")
        )
        .filter(
            models.Transaction.vendor_id == vendor_id
        )
        .group_by(
            extract("month", models.Transaction.transaction_date)
        )
        .order_by(
            extract("month", models.Transaction.transaction_date)
        )
        .all()
    )

    return [
        {
            "month": int(row.month),
            "sales": int(row.sales or 0),
            "revenue": int(row.revenue or 0)
        }
        for row in results
    ]

@router.get("/vendor/{vendor_id}/top-products")
def get_top_products(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            models.Product.product_name,
            func.sum(models.Transaction.quantity).label("sales")
        )
        .join(
            models.Transaction,
            models.Product.product_id == models.Transaction.product_id
        )
        .filter(
            models.Transaction.vendor_id == vendor_id
        )
        .group_by(
            models.Product.product_id,
            models.Product.product_name
        )
        .order_by(
            func.sum(models.Transaction.quantity).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "product_name": row.product_name,
            "sales": int(row.sales or 0)
        }
        for row in results
    ]

@router.get("/vendor/{vendor_id}/benchmark")
def get_vendor_benchmark(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    # Revenue of this vendor
    vendor_revenue = (
        db.query(
            func.sum(models.Transaction.total_amount)
        )
        .filter(
            models.Transaction.vendor_id == vendor_id
        )
        .scalar()
    )

    # Average revenue across all vendors
    vendor_revenues = (
        db.query(
            models.Transaction.vendor_id,
            func.sum(models.Transaction.total_amount).label("revenue")
        )
        .group_by(
            models.Transaction.vendor_id
        )
        .all()
    )

    if vendor_revenue is None:
        vendor_revenue = 0

    if vendor_revenues:
        marketplace_average = sum(
            row.revenue for row in vendor_revenues
        ) / len(vendor_revenues)
    else:
        marketplace_average = 0

    # Compare vendor with marketplace average
    if marketplace_average > 0:
        difference_percentage = (
            (vendor_revenue - marketplace_average)
            / marketplace_average
        ) * 100
    else:
        difference_percentage = 0

    return {
        "vendor_id": vendor_id,
        "vendor_revenue": vendor_revenue,
        "marketplace_average": round(marketplace_average, 2),
        "difference_percentage": round(difference_percentage, 2)
    }

@router.get("/vendor/{vendor_id}/csv")
def export_vendor_csv(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            models.Product.product_name,
            func.sum(models.Transaction.quantity).label("quantity_sold"),
            func.sum(models.Transaction.total_amount).label("revenue")
        )
        .join(
            models.Transaction,
            models.Product.product_id == models.Transaction.product_id
        )
        .filter(
            models.Transaction.vendor_id == vendor_id
        )
        .group_by(
            models.Product.product_id,
            models.Product.product_name
        )
        .all()
    )

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Product",
        "Quantity Sold",
        "Revenue"
    ])

    for row in results:
        writer.writerow([
            row.product_name,
            row.quantity_sold,
            row.revenue
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=vendor_{vendor_id}_report.csv"
        }
    )