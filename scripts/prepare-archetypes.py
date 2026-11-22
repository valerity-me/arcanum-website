"""Prepare the 12 archetype pictures for the site.

Source: tarot_app/assets/archetypes/<key>.webp (1024x1536, grey).
Output: public/archetypes/<key>.webp (720x1080, toned violet, about 80-120 KB).

Toning is baked in instead of using CSS mix-blend-mode: twelve layers that move
with parallax and clip-path would be repainted with live blending on every frame.
It is the same look as in the app: brightness decides how much violet shows on
the page colour, so black becomes the page background (#0B0A0F) and white becomes
violet-soft (#9A6BF2). Because the darkest tone equals the page colour, the card
edges disappear into the page and no frame or glow is needed.

Usage: python scripts/prepare-archetypes.py <source_dir>
"""
import os
import sys
from PIL import Image

if len(sys.argv) < 2:
    sys.exit("Usage: python scripts/prepare-archetypes.py <source_dir>")
SRC = sys.argv[1]
MAX_BYTES = 120 * 1024
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "archetypes")
KEYS = "innocent everyman hero caregiver explorer outlaw lover creator jester sage magician ruler".split()
SIZE = (720, 1080)
INK = (0x0B, 0x0A, 0x0F)       # page background
VIOLET = (0x9A, 0x6B, 0xF2)    # violet-soft, the brightest tone

os.makedirs(OUT, exist_ok=True)

# 256-entry lookup: grey level -> duotone colour
lut_r = [round(INK[0] + (VIOLET[0] - INK[0]) * i / 255) for i in range(256)]
lut_g = [round(INK[1] + (VIOLET[1] - INK[1]) * i / 255) for i in range(256)]
lut_b = [round(INK[2] + (VIOLET[2] - INK[2]) * i / 255) for i in range(256)]

for key in KEYS:
    grey = Image.open(f"{SRC}/{key}.webp").convert("L").resize(SIZE, Image.LANCZOS)
    r, g, b = grey.point(lut_r), grey.point(lut_g), grey.point(lut_b)
    toned = Image.merge("RGB", (r, g, b))
    path = os.path.join(OUT, f"{key}.webp")
    # step the quality down until the file fits the budget (floor 60)
    for q in range(80, 59, -4):
        toned.save(path, "WEBP", quality=q, method=6)
        if os.path.getsize(path) <= MAX_BYTES:
            break
    print(f"{key:9s} q{q} {os.path.getsize(path) / 1024:6.1f} KB")
