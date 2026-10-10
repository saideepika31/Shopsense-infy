from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import crud, schemas


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Create Customer
@router.post("/", response_model=schemas.CustomerResponse)
def create_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db)
):

    existing_customer = crud.get_customer_by_email(
        db,
        customer.email
    )

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Customer with this email already exists"
        )

    return crud.create_customer(
        db,
        customer
    )


# Get All Customers
@router.get("/", response_model=list[schemas.CustomerResponse])
def get_customers(
    db: Session = Depends(get_db)
):

    return crud.get_customers(db)


# Get Customer by ID
@router.get("/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = crud.get_customer(
        db,
        customer_id
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer