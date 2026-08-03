from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str


class VendorCreate(BaseModel):
    business_name: str
    owner_name: str
    phone: str
    address: str
    email: EmailStr
    password: str


class Login(BaseModel):
    email: EmailStr
    password: str


class VendorResponse(BaseModel):
    vendor_id: int
    business_name: str
    owner_name: str
    phone: str
    address: str

    class Config:
        from_attributes = True


class VendorUpdate(BaseModel):
    business_name: str
    owner_name: str
    phone: str
    address: str

class ProductCreate(BaseModel):
    product_name: str
    description: str
    price: int
    quantity: int
    category: str
    vendor_id: int


class ProductResponse(ProductCreate):
    product_id: int

    class Config:
        from_attributes = True