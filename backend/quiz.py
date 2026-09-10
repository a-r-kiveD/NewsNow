import os
from dotenv import load_dotenv
from google import genai
from backend.news import get_news
load_dotenv()
import json

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)

def generate_quiz():

    news = get_news()

    prompt = f"""
You are a general knowledge quiz generator.

Below are recent news articles:

{news}

Create 10 multiple-choice questions based ONLY on these news articles.

Return the result as a JSON array.

Each question must have exactly this structure:

{{
    "question": "The question",
    "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
    ],
    "answer": "The correct option"
}}

Rules:
- Create exactly 10 questions.
- Each question must have exactly 4 options.
- The answer must exactly match one of the four options.
- Use ONLY information from the provided news articles.
- Do not add explanations.
- Do not use markdown.
- Return ONLY the JSON array.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return json.loads(response.text)

if __name__ == "__main__":
    quiz = generate_quiz()
    print(quiz)