from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.news import (
    NewsConfigurationError,
    NewsServiceError,
    get_news,
)
from backend.quiz import (
    QuizConfigurationError,
    QuizGenerationError,
    generate_quiz,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "GK Now API is working!"}


@app.get("/news")
def news():
    try:
        return get_news()
    except NewsConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except NewsServiceError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

@app.get("/quiz")
def quiz():
    try:
        return generate_quiz()
    except (NewsConfigurationError, QuizConfigurationError) as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except (NewsServiceError, QuizGenerationError) as error:
        raise HTTPException(status_code=502, detail=str(error)) from error