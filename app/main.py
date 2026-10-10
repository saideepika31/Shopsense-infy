from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models

from .routers import auth
from .routers import vendors
from .routers import analytics
from .routers import customers
from .routers import transaction
from .routers.products import router as products_router
from .routers import inventory
from .routers import ai
from .routers import reports
from .routers import ai_analytics

models.Base.metadata.create_all(bind=engine)


app = FastAPI(title="ShopSense API")


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(vendors.router)
app.include_router(analytics.router)
app.include_router(customers.router)
app.include_router(transaction.router)
app.include_router(products_router)
app.include_router(inventory.router)
app.include_router(ai.router)
app.include_router(reports.router)
app.include_router(ai_analytics.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to ShopSense API"
    }