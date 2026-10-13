import os
import shutil

src_brain = r"C:\Users\SANTIAGO\.gemini\antigravity\brain\9ce93935-4804-41b7-a54b-256f7ab20e4e"
dest_public = r"C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp\public\documentos"
dest_photos = os.path.join(dest_public, "fotos")

os.makedirs(dest_photos, exist_ok=True)

# 1. Copiar PDFs
pdf1_src = os.path.join(src_brain, "INFORME_TECNICO_DOMUM_DITEC_2026.pdf")
pdf1_dest = os.path.join(dest_public, "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf")
if os.path.exists(pdf1_src):
    shutil.copyfile(pdf1_src, pdf1_dest)
    print("Copied pdf1:", pdf1_dest)

pdf2_candidates = [
    os.path.join(src_brain, ".user_uploaded", "media_1791844440808.pdf"),
    os.path.join(src_brain, "PLAN DE PROPUESTAS.pdf")
]
for p in pdf2_candidates:
    if os.path.exists(p):
        pdf2_dest = os.path.join(dest_public, "PLAN_DE_PROPUESTAS_DITEC.pdf")
        shutil.copyfile(p, pdf2_dest)
        print("Copied pdf2:", pdf2_dest)
        break

# 2. Copiar fotos
frames_dir = os.path.join(src_brain, "frames")
for frame in ["v1_frame01.jpg", "v4_frame01.jpg", "v7_frame01.jpg", "v8_frame01.jpg"]:
    fsrc = os.path.join(frames_dir, frame)
    if os.path.exists(fsrc):
        shutil.copyfile(fsrc, os.path.join(dest_photos, frame))
        print("Copied frame:", frame)

pdf_imgs_dir = os.path.join(src_brain, "pdf_images")
for img, orig in [
    ("photomontage_1.png", "page_1_img_1.png"),
    ("photomontage_2.jpeg", "page_1_img_2.jpeg"),
    ("photomontage_3.jpeg", "page_1_img_3.jpeg"),
    ("photomontage_4.jpeg", "page_1_img_4.jpeg")
]:
    isrc = os.path.join(pdf_imgs_dir, orig)
    if os.path.exists(isrc):
        shutil.copyfile(isrc, os.path.join(dest_photos, img))
        print("Copied photo:", img)

print("Setup completed successfully.")
