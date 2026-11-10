import os

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://newsdata.io/api/1/latest"


class NewsServiceError(Exception):
    pass


class NewsConfigurationError(NewsServiceError):
    pass


def get_news():
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        raise NewsConfigurationError("NEWS_API_KEY is not configured.")

    try:
        response = requests.get(
            API_URL,
            params={
                "apikey": api_key,
                "country": "in",
                "language": "en",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as error:
        raise NewsServiceError("Could not retrieve news from the news provider.") from error
    except ValueError as error:
        raise NewsServiceError("The news provider returned invalid JSON.") from error

    if not isinstance(data, dict):
        raise NewsServiceError("The news provider returned an invalid response.")

    articles = data.get("results", [])
    if not isinstance(articles, list):
        raise NewsServiceError("The news provider returned an invalid article list.")

    return [
        {
            "title": article.get("title"),
            "description": article.get("description"),
            "source": article.get("source_name"),
            "published_at": article.get("pubDate"),
            "url": article.get("link"),
        }
        for article in articles[:10]
        if isinstance(article, dict)
    ]
