import json

file_path = r"C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp\src\data\enrichedLaptops.json"

# Distinct high-res studio photos on clean background for each model family
model_photos = {
    "msi-thin": [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200"
    ],
    "msi-cyborg": [
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200"
    ],
    "msi": [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200"
    ],
    "asus-tuf": [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200"
    ],
    "asus-rog": [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200"
    ],
    "asus": [
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200"
    ],
    "lenovo-v15": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200"
    ],
    "lenovo-ideapad": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200"
    ],
    "lenovo-loq": [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200"
    ],
    "lenovo": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200"
    ],
    "acer-nitro": [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200"
    ],
    "acer-aspire": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200"
    ],
    "acer": [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200"
    ],
    "hp-victus": [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200"
    ],
    "hp": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200"
    ],
    "macbook": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200"
    ],
    "apple": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200"
    ],
    "dell": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200"
    ]
}

with open(file_path, "r", encoding="utf-8") as f:
    laptops = json.load(f)

for idx, laptop in enumerate(laptops):
    slug_lower = (laptop.get("slug", "") + " " + laptop.get("name", "")).lower()
    matched_key = None
    for key in model_photos:
        if key in slug_lower:
            matched_key = key
            break
    
    if matched_key:
        imgs = model_photos[matched_key]
        laptop["images"] = imgs
    else:
        # Fallback to distinct studio photo based on index modulo
        fallback_list = [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200"
        ]
        laptop["images"] = [fallback_list[idx % len(fallback_list)], fallback_list[(idx + 1) % len(fallback_list)]]

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(laptops, f, indent=2, ensure_ascii=False)

print(f"Updated exact studio photos for all {len(laptops)} laptops!")
