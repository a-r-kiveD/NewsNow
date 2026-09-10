import os
import requests
from dotenv import load_dotenv
load_dotenv()
API_KEY=os.getenv("NEWS_API_KEY")
API_KEY = os.getenv("NEWS_API_KEY")

print("API KEY LOADED:", API_KEY is not None)
API_URL="https://newsdata.io/api/1/latest"
def get_news():
    params={
        "apikey":API_KEY,
        "country":"in",
        "language":"en"
    }
    response=requests.get(API_URL,params=params,timeout=10)
    data=response.json()
    data=response.json()

    
    
    articles=data.get("results",[])[:10]
    
    print("ARTICLES TYPE:", type(articles))
    print("NUMBER OF ARTICLES:", len(articles))

    clean_articles=[]

    for article in articles:
        print("ARTICLE TYPE:" ,type(article))
        if isinstance(article, dict):
            clean_articles.append({
                "title":article.get("title"),
                "description":article.get("description"),
                "source":article.get("source_name"),
                "published_at": article.get("pubDate"),
                "url": article.get("link")
            })
    return clean_articles



