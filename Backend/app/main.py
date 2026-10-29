from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware                                    # ADD
from app.api.sinhala_writing.spacing import router as sinhala_spacing_router         # ADD

app = FastAPI()

# ADD (only once for the whole backend; skip if a teammate already added CORS)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(sinhala_spacing_router)                                            # ADD

@app.get("/")
def home():
    return {"message": "Our research backend is running!"}