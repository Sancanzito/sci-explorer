# G:\sci-hub\src\components\graph\backend\main.py
from fastapi import FastAPI, Response
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",  # ← ADD THIS (your current port)
        "http://localhost:3000",
        "http://localhost:8000",
        "https://sancanzito.github.io",
        "https://sci-hub-five.vercel.app",
        "https://sci-hub-backend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Handle preflight requests explicitly
@app.options("/{rest_of_path:path}")
async def preflight_handler():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
            "Access-Control-Allow-Credentials": "true",
        }
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

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "backend": "FastAPI", "version": "1.0.0"}

# Simple test endpoint
@app.get("/api/test")
async def test_endpoint():
    return {"message": "API is working!"}

# Import routes
try:
    from api.routes import router as graph_router
    app.include_router(graph_router, prefix="/api/v1/graph", tags=["graph"])
    logger.info("✅ Graph router loaded successfully")
except ModuleNotFoundError as e:
    logger.warning(f"⚠️ Graph router not loaded: {e}")
    # Add placeholder endpoints
    @app.post("/api/v1/graph/waveform")
    async def placeholder_waveform():
        return {
            "x_values": [0, 1, 2, 3, 4],
            "y_values": [0, 1, 0, 1, 0],
            "chart_image": "",
            "metadata": {"status": "placeholder", "message": "Backend is working!"}
        }
    
    @app.post("/api/v1/graph/matrix")
    async def placeholder_matrix():
        return {
            "matrix": [[1, 0], [0, 1]],
            "heatmap_image": "",
            "metadata": {"status": "placeholder"}
        }
    
    @app.post("/api/v1/graph/statistical")
    async def placeholder_statistical():
        return {
            "data": [1, 2, 3, 4, 5],
            "mean": 3,
            "histogram_image": "",
            "metadata": {"status": "placeholder"}
        }
    
    @app.post("/api/v1/graph/filter")
    async def placeholder_filter():
        return {
            "original_signal": [0, 1, 0, 1, 0],
            "filtered_signal": [0, 0.5, 0, 0.5, 0],
            "filter_image": "",
            "metadata": {"status": "placeholder"}
        }

# Import data routes
# In main.py, the data routes import should be:
try:
    from api.data_routes import router as data_router
    app.include_router(data_router, prefix="/api/v1", tags=["data-analysis"])
    logger.info("✅ Data router loaded successfully")
except ModuleNotFoundError as e:
    logger.warning(f"⚠️ Data router not loaded: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)