import sys
import os

# Add the 'backend' directory to sys.path so that 'app' can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Event Report Generator")

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
