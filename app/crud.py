from .utils import hash_password, verify_password
from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy import func


# =========================================================
# VENDOR
# =========================================================

def create_vendor(db: Session, vendor: schemas.VendorCreate):

    db_user = models.User(
        email=vendor.email,
        password=hash_password(vendor.password),
        role="Vendor"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db_vendor = models.Vendor(
        business_name=vendor.business_name,
        owner_name=vendor.owner_name,
        phone=vendor.phone,
        address=vendor.address,
        user_id=db_user.id
    )

    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)

    return db_vendor


def login(db: Session, email: str, password: str):

    db_user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not db_user:
        return None

    if not verify_password(password, db_user.password):
        return None

    return db_user


def get_vendor(db: Session, vendor_id: int):

    return db.query(models.Vendor).filter(
        models.Vendor.vendor_id == vendor_id
    ).first()


def update_vendor(
    db: Session,
    vendor_id: int,
    vendor: schemas.VendorUpdate
):

    db_vendor = db.query(models.Vendor).filter(
        models.Vendor.vendor_id == vendor_id
    ).first()

    if not db_vendor:
        return None

    db_vendor.business_name = vendor.business_name
    db_vendor.owner_name = vendor.owner_name
    db_vendor.phone = vendor.phone
    db_vendor.address = vendor.address

    db.commit()
    db.refresh(db_vendor)

    return db_vendor


# =========================================================
# PRODUCT
# =========================================================

def create_product(
    db: Session,
    product: schemas.ProductCreate
):

    db_product = models.Product(
        product_name=product.product_name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        category=product.category,
        vendor_id=product.vendor_id
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


def get_products(db: Session):

    return db.query(models.Product).all()


# =========================================================
# VENDOR ANALYTICS
# =========================================================

def get_vendor_analytics(
    db: Session,
    vendor_id: int
):

    total_products = db.query(models.Product).filter(
        models.Product.vendor_id == vendor_id
    ).count()

    total_sales = db.query(
        func.sum(models.Transaction.quantity)
    ).filter(
        models.Transaction.vendor_id == vendor_id
    ).scalar()

    total_revenue = db.query(
        func.sum(models.Transaction.total_amount)
    ).filter(
        models.Transaction.vendor_id == vendor_id
    ).scalar()

    if total_sales is None:
        total_sales = 0

    if total_revenue is None:
        total_revenue = 0

    return {
        "total_products": total_products,
        "total_sales": total_sales,
        "revenue": total_revenue
    }

# =========================================================
# CUSTOMER
# =========================================================

def create_customer(
    db: Session,
    customer: schemas.CustomerCreate
):

    db_customer = models.Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


def get_customers(db: Session):

    return db.query(models.Customer).all()


def get_customer(
    db: Session,
    customer_id: int
):

    return db.query(models.Customer).filter(
        models.Customer.customer_id == customer_id
    ).first()


# =========================================================
# TRANSACTION
# =========================================================

def create_transaction(
    db: Session,
    transaction: schemas.TransactionCreate
):

    db_transaction = models.Transaction(
        customer_id=transaction.customer_id,
        product_id=transaction.product_id,
        vendor_id=transaction.vendor_id,
        quantity=transaction.quantity,
        total_amount=transaction.total_amount
    )

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return db_transaction


def get_transactions(db: Session):

    return db.query(models.Transaction).all()


def get_transaction(
    db: Session,
    transaction_id: int
):

    return db.query(models.Transaction).filter(
        models.Transaction.transaction_id == transaction_id
    ).first()


def get_customer_by_email(
    db: Session,
    email: str
):

    return db.query(models.Customer).filter(
        models.Customer.email == email
    ).first()


def get_customer_segments(db: Session):

    results = (
        db.query(
            models.Customer.customer_id,
            models.Customer.name,
            func.sum(models.Transaction.total_amount).label("total_spent")
        )
        .join(
            models.Transaction,
            models.Customer.customer_id == models.Transaction.customer_id
        )
        .group_by(
            models.Customer.customer_id,
            models.Customer.name
        )
        .all()
    )

    segments = []

    for customer in results:

        if customer.total_spent >= 10000:
            segment = "High"
        elif customer.total_spent >= 5000:
            segment = "Medium"
        else:
            segment = "Low"

        segments.append({
            "customer_id": customer.customer_id,
            "name": customer.name,
            "total_spent": customer.total_spent,
            "segment": segment
        })

    return segments