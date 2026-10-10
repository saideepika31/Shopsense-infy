from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import crud, schemas
from .. import crud, schemas, models


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Create Transaction
@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):

    # Check customer
    customer = crud.get_customer(
        db,
        transaction.customer_id
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # Check product
    product = db.query(models.Product).filter(
    models.Product.product_id == transaction.product_id
).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Check vendor
    vendor = crud.get_vendor(
        db,
        transaction.vendor_id
    )

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return crud.create_transaction(
        db,
        transaction
    )


# Get All Transactions
@router.get(
    "/",
    response_model=list[schemas.TransactionResponse]
)
def get_transactions(
    db: Session = Depends(get_db)
):

    return crud.get_transactions(db)


# Get Transaction by ID
@router.get(
    "/{transaction_id}",
    response_model=schemas.TransactionResponse
)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = crud.get_transaction(
        db,
        transaction_id
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return transaction