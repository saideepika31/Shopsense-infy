from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)

    vendor = relationship("Vendor", back_populates="user", uselist=False)


class Vendor(Base):
    __tablename__ = "vendors"

    vendor_id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(100), nullable=False)
    owner_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    address = Column(String(255))

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="vendor")

    # Vendor can have many products
    products = relationship("Product", back_populates="vendor")

    # Vendor can have many transactions
    transactions = relationship("Transaction", back_populates="vendor")


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(100), nullable=False)

    description = Column(String(300))

    price = Column(Integer)

    quantity = Column(Integer)

    category = Column(String(100))

    vendor_id = Column(Integer, ForeignKey("vendors.vendor_id"))

    vendor = relationship("Vendor", back_populates="products")

    # Product can appear in many transactions
    transactions = relationship("Transaction", back_populates="product")


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    phone = Column(String(20))

    # Customer can have many transactions
    transactions = relationship("Transaction", back_populates="customer")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.customer_id"),
        nullable=False
    )

    product_id = Column(
        Integer,
        ForeignKey("products.product_id"),
        nullable=False
    )

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.vendor_id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    total_amount = Column(Integer, nullable=False)

    transaction_date = Column(
        DateTime,
        default=datetime.utcnow
    )

    customer = relationship("Customer", back_populates="transactions")

    product = relationship("Product", back_populates="transactions")

    vendor = relationship("Vendor", back_populates="transactions")