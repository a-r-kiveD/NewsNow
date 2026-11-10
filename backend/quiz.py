import json
import os

from dotenv import load_dotenv
from google import genai

from backend.news import get_news

load_dotenv()


class QuizConfigurationError(Exception):
    pass


class QuizGenerationError(Exception):
    pass


def generate_quiz():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise QuizConfigurationError("GEMINI_API_KEY is not configured.")

    articles = get_news()
    if not articles:
        raise QuizGenerationError("There are no news articles available for a quiz.")

    prompt = f"""
You are a general knowledge quiz generator.

Below are recent news articles:

{json.dumps(articles, ensure_ascii=False)}

Create 10 multiple-choice questions based ONLY on these news articles.
Return ONLY a JSON array with this structure for each question:
{{
    "question": "The question",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The correct option"
}}

Each question must have exactly four options, and the answer must exactly
match one of them. Do not add explanations or markdown.
"""

    with genai.Client(api_key=api_key) as client:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
        )

    try:
        quiz = json.loads(response.text or "")
    except (json.JSONDecodeError, TypeError) as error:
        raise QuizGenerationError("The quiz provider returned invalid JSON.") from error

    if not isinstance(quiz, list) or len(quiz) != 10:
        raise QuizGenerationError("The quiz provider did not return 10 questions.")

    for question in quiz:
        if (
            not isinstance(question, dict)
            or not isinstance(question.get("question"), str)
            or not isinstance(question.get("options"), list)
            or len(question["options"]) != 4
            or not isinstance(question.get("answer"), str)
            or question["answer"] not in question["options"]
        ):
            raise QuizGenerationError("The quiz provider returned an invalid question.")

    return quiz
