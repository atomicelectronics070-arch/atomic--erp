import urllib.request

video_ids = [
  "FF4xQtiZwW8", "T1-ynGKZ4kc", "zCCFfAm8lQ0",
  "OJqefg29FXM", "Toh8YRAVGUI", "KCKPUBH-VnU",
  "nSSJ6muIZpU", "BYt2PtAAqP4", "KITFoIeZrds",
  "a7e015jy6n8", "DWB3FnAKZDw", "3zFd9MJLeVU",
  "pvCESlKTO4E", "4t3lmAPhuNE", "C_HzenCejLU"
]

for vid in video_ids:
    url_max = f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg"
    url_hq = f"https://img.youtube.com/vi/{vid}/hqdefault.jpg"
    
    status_max = "UNKNOWN"
    try:
        req = urllib.request.Request(url_max, method='HEAD')
        resp = urllib.request.urlopen(req)
        status_max = resp.status
    except Exception as e:
        status_max = str(e)

    status_hq = "UNKNOWN"
    try:
        req = urllib.request.Request(url_hq, method='HEAD')
        resp = urllib.request.urlopen(req)
        status_hq = resp.status
    except Exception as e:
        status_hq = str(e)
        
    print(f"Vid: {vid} | maxres: {status_max} | hq: {status_hq}")
