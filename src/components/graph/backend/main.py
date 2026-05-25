# G:\sci-hub\src\components\graph\backend\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Fixed imports - removed 'backend.' prefix
from api.routes import router as graph_router
from core.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting scientific visualization backend...")
    yield
    logger.info("Shutting down backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-performance scientific computing backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://sancanzito.github.io",
        "https://sci-hub-backend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router with the specified prefix
app.include_router(graph_router, prefix="/api/v1/graph", tags=["graph"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "backend": "FastAPI"}