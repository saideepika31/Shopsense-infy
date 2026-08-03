from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models
from .routers import auth
from .routers import vendors
from .routers import analytics

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopSense API")

# ----------- CORS ----------------
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------

app.include_router(auth.router)
app.include_router(vendors.router)
app.include_router(analytics.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to ShopSense"
    }