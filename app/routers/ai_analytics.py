from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import SessionLocal
from ..models import Transaction, Product


router = APIRouter(
    prefix="/ai",
    tags=["AI Analyst"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/analyst/{vendor_id}")
def ai_analyst(
    vendor_id: int,
    question: str,
    db: Session = Depends(get_db)
):

    question = question.lower()

    # -----------------------------------------
    # TOTAL REVENUE
    # -----------------------------------------

    if "revenue" in question:

        revenue = db.query(
            func.coalesce(
                func.sum(Transaction.total_amount),
                0
            )
        ).filter(
            Transaction.vendor_id == vendor_id
        ).scalar()

        return {
            "question": question,
            "answer": f"Your total revenue is ₹{revenue}.",
            "data": revenue
        }


    # -----------------------------------------
    # TOTAL SALES
    # -----------------------------------------

    if "sales" in question:

        sales = db.query(
            func.coalesce(
                func.sum(Transaction.quantity),
                0
            )
        ).filter(
            Transaction.vendor_id == vendor_id
        ).scalar()

        return {
            "question": question,
            "answer": f"Your total sales quantity is {sales} units.",
            "data": sales
        }


    # -----------------------------------------
    # BEST SELLING PRODUCT
    # -----------------------------------------

    if (
        "best selling" in question
        or "top product" in question
        or "most sold" in question
    ):

        result = (
            db.query(
                Product.product_name,
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
                Product.product_name
            )
            .order_by(
                func.sum(Transaction.quantity).desc()
            )
            .first()
        )

        if not result:
            return {
                "question": question,
                "answer": "There is not enough sales data to determine the best-selling product."
            }

        return {
            "question": question,
            "answer": (
                f"Your best-selling product is "
                f"{result.product_name} with "
                f"{result.total_sold} units sold."
            ),
            "product": result.product_name,
            "units_sold": result.total_sold
        }


    # -----------------------------------------
    # UNKNOWN QUESTION
    # -----------------------------------------

    return {
        "question": question,
        "answer": (
            "I can currently answer questions about "
            "total revenue, total sales, and best-selling products."
        )
    }