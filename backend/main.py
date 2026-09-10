from fastapi import FastAPI
from backend.news import get_news
from backend.quiz import generate_quiz

app = FastAPI()


@app.get("/")
def home():
    return {"message": "GK Now API is working!"}


@app.get("/news")
def news():

    return get_news()

@app.get("/quiz")
def quiz():
    return generate_quiz()