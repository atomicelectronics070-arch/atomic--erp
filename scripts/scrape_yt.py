import urllib.request
import re
import json

queries = [
    "QT10-15 block machine",
    "EPS sandwich wall panel machine",
    "QT4-15 paving block machine",
    "QTJ4-35 block machine",
    "automatic interlocking block machine"
]

results = {}

for q in queries:
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        video_ids = re.findall(r'"videoId":"([^"]{11})"', html)
        unique_ids = list(dict.fromkeys(video_ids))[:3]
        results[q] = [f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg" for vid in unique_ids]
    except Exception as e:
        print(f"Error on {q}: {e}")

print(json.dumps(results, indent=2))
