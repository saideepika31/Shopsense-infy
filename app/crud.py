from .utils import hash_password, verify_password
from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy import func



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


def create_product(db: Session, product: schemas.ProductCreate):

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



def get_vendor_analytics(db: Session, vendor_id: int):

    total_products = db.query(models.Product).filter(
        models.Product.vendor_id == vendor_id
    ).count()

    total_revenue = db.query(
        func.sum(models.Product.price * models.Product.quantity)
    ).filter(
        models.Product.vendor_id == vendor_id
    ).scalar()

    if total_revenue is None:
        total_revenue = 0

    return {
        "total_products": total_products,
        "revenue": total_revenue
    }