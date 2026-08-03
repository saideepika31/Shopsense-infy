from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
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


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(100), nullable=False)

    description = Column(String(300))

    price = Column(Integer)

    quantity = Column(Integer)

    category = Column(String(100))

    vendor_id = Column(Integer, ForeignKey("vendors.vendor_id"))

    vendor = relationship("Vendor")