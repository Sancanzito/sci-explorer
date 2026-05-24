# backend/run.py
import uvicorn
import os
import sys

# Add the parent directory (src/components/graph) to sys.path
# so 'backend' can be imported as a top-level module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app", # Use the package dot-notation
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )