# G:\sci-hub\src\components\graph\backend\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting scientific visualization backend...")
    yield
    logger.info("Shutting down backend...")

app = FastAPI(
    title="Scientific Visualization API",
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

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Scientific Visualization Backend",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "api": "/api/v1/graph/waveform"
        }
    }

# Health check endpoint (must be BEFORE router to ensure it's found)
@app.get("/health")
async def health_check():
    return {"status": "healthy", "backend": "FastAPI", "version": "1.0.0"}

# Simple test endpoint
@app.get("/api/test")
async def test_endpoint():
    return {"message": "API is working!"}

# Try to import routes, but handle gracefully if they don't exist
try:
    from api.routes import router as graph_router
    app.include_router(graph_router, prefix="/api/v1/graph", tags=["graph"])
    logger.info("✅ Graph router loaded successfully")
except ModuleNotFoundError as e:
    logger.warning(f"⚠️ Graph router not loaded: {e}")
    # Add a placeholder endpoint
    @app.post("/api/v1/graph/waveform")
    async def placeholder_waveform():
        return {
            "x_values": [0, 1, 2, 3, 4],
            "y_values": [0, 1, 0, 1, 0],
            "chart_image": "",
            "metadata": {"status": "placeholder"}
        }