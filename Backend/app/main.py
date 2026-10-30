from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware                                   
from app.api.sinhala_writing.spacing import router as sinhala_spacing_router   
from app.api.sinhala_writing.baseline import router as sinhala_baseline_router  
from app.api.maths_slow.attempts import router as maths_slow_router     

app = FastAPI()


app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(sinhala_spacing_router)        
app.include_router(sinhala_baseline_router)    
app.include_router(maths_slow_router)       
                                       

@app.get("/")
def home():
    return {"message": "Our research backend is running!"}