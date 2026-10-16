from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Our research backend is running!"}