from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.analyze import router as analyze_router

app = FastAPI(title="Email Classifier API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajuste para o front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui o router
app.include_router(analyze_router, prefix="/api")
