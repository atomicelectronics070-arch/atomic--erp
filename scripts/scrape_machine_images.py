import requests
from bs4 import BeautifulSoup
import json
import urllib.parse
import sys

def search_images(query):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        images = []
        for a in soup.find_all('a', class_='image'):
            img = a.find('img')
            if img and 'src' in img.attrs:
                src = img['src']
                if src.startswith('//'):
                    src = 'https:' + src
                images.append(src)
                if len(images) >= 5:
                    break
        return images
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

if __name__ == "__main__":
    queries = [
        "concrete block making plant factory QT10-15",
        "EPS sandwich wall panel machine",
        "automatic paving block making machine",
        "QTJ4-35 block machine",
        "fully automatic interlocking block making machine plant"
    ]
    
    results = {}
    for q in queries:
        results[q] = search_images(q)
        
    print(json.dumps(results, indent=2))
