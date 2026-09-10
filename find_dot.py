import os
from PIL import Image

bg_dir = r"g:\SIH\zencoders-prob43-sih26\src\assets\auth-bg"
for f in os.listdir(bg_dir):
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        p = os.path.join(bg_dir, f)
        img = Image.open(p).convert('RGB')
        w, h = img.size
        green_coords = []
        for y in range(h):
            for x in range(w):
                r, g, b = img.getpixel((x, y))
                # Teal / emerald dot like RGB(0, 160, 120) or similar
                if g > 120 and (g - r > 50) and (g - b > -30) and r < 80:
                    green_coords.append((x, y, (r, g, b)))
        if green_coords:
            print(f"{f}: found {len(green_coords)} green-ish pixels. Examples: {green_coords[:10]}")
