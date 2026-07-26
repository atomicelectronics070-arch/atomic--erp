import json

clean_brand_images = {
    "msi": [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000"
    ],
    "asus": [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000"
    ],
    "lenovo": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000"
    ],
    "acer": [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000"
    ],
    "hp": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000"
    ],
    "apple": [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000"
    ],
    "default": [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000"
    ]
}

file_path = r"C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp\src\data\enrichedLaptops.json"

with open(file_path, "r", encoding="utf-8") as f:
    laptops = json.load(f)

for laptop in laptops:
    name_lower = laptop.get("name", "").lower()
    matched_brand = "default"
    for brand in clean_brand_images:
        if brand in name_lower:
            matched_brand = brand
            break
    laptop["images"] = clean_brand_images[matched_brand]

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(laptops, f, indent=2, ensure_ascii=False)

print(f"Updated {len(laptops)} laptops with clean high-resolution studio photos!")
