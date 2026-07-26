import json
import urllib.request
import urllib.parse
import re
import os
import time

data_path = os.path.join(os.getcwd(), 'src', 'data', 'enrichedLaptops.json')

with open(data_path, 'r', encoding='utf-8') as f:
    laptops = json.load(f)

print(f"Loaded {len(laptops)} laptops. Scraping real YouTube thumbnail images...")

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
updated_count = 0

for i, laptop in enumerate(laptops):
    clean_title = re.sub(r'[^\w\s]', '', laptop['cleanName'])
    query = f"{clean_title} laptop review"
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8')
        video_ids = re.findall(r'"videoId":"([^"]{11})"', html)
        unique_ids = list(dict.fromkeys(video_ids))[:4]
        
        if unique_ids:
            real_images = [f"https://img.youtube.com/vi/{vid}/hqdefault.jpg" for vid in unique_ids]
            laptop['images'] = real_images
            updated_count += 1
            print(f"[{i+1}/{len(laptops)}] OK: {laptop['slug'][:30]} -> {len(real_images)} images")
        else:
            print(f"[{i+1}/{len(laptops)}] WARNING: No video found for {laptop['slug'][:30]}")
    except Exception as e:
        print(f"[{i+1}/{len(laptops)}] ERROR for {laptop['slug'][:30]}: {e}")
    
    time.sleep(0.05)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(laptops, f, indent=2, ensure_ascii=False)

print(f"\nDone! Updated {updated_count}/{len(laptops)} laptops with real images!")
