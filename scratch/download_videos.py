import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import yt_dlp

desktop_path = r"C:\Users\SANTIAGO\Desktop\videos maquinas de bloques"
os.makedirs(desktop_path, exist_ok=True)

# Remove partial file if any
part_file = os.path.join(desktop_path, "QT4-15_Automatica_PLC_Siemens.f136.mp4.part")
if os.path.exists(part_file):
    try: os.remove(part_file)
    except: pass

url = "https://www.youtube.com/watch?v=n-WJp91t4E4"
output_template = os.path.join(desktop_path, "QT4-15_Automatica_PLC_Siemens.%(ext)s")

ydl_opts = {
    'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    'outtmpl': output_template,
    'quiet': False,
    'no_warnings': True
}

print("[DESCARGANDO] QT4-15 con enlace alternativo...")
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    print("[COMPLETADO] QT4-15_Automatica_PLC_Siemens.mp4")
except Exception as e:
    print(f"[ERROR] {e}")

print("=== FINALIZADO ===")
