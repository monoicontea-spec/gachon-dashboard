from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "dept-logo-source.png"
OUT = ROOT / "public" / "dept-logo.png"

TOP_TEXT = "GACHON UNIVERSITY DEPT. of INDUSTRIAL DESIGN"
BOTTOM_TEXT = "SIMPLICITY & FUNCTIONALITY DESIGN"


def load_font(size: int) -> ImageFont.ImageFont:
    for path in (
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ):
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def clear_ring(img: Image.Image, inner: float, outer: float) -> None:
    px = img.load()
    cx = img.width / 2
    cy = img.height / 2
    for y in range(img.height):
        for x in range(img.width):
            d = math.hypot(x - cx, y - cy)
            if inner <= d <= outer:
                px[x, y] = (0, 0, 0, 255)


def draw_white_circle(img: Image.Image, radius: float, width: int = 3) -> None:
    draw = ImageDraw.Draw(img)
    cx = img.width / 2
    cy = img.height / 2
    bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
    draw.ellipse(bbox, outline=(255, 255, 255, 255), width=width)


def draw_arc_text(
    img: Image.Image,
    text: str,
    *,
    radius: float,
    font: ImageFont.ImageFont,
    start_deg: float,
    end_deg: float,
    bottom: bool = False,
) -> None:
    cx = img.width / 2
    cy = img.height / 2
    n = len(text)
    if n <= 1:
        return

    for i, ch in enumerate(text):
        if ch == " ":
            continue

        t = i / (n - 1)
        angle_deg = start_deg + (end_deg - start_deg) * t
        angle = math.radians(angle_deg)
        x = cx + radius * math.cos(angle)
        y = cy - radius * math.sin(angle)
        rotation = angle_deg + 90 if bottom else angle_deg - 90

        bbox = font.getbbox(ch)
        w = max(bbox[2] - bbox[0], 1)
        h = max(bbox[3] - bbox[1], 1)
        pad = 8
        canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
        ImageDraw.Draw(canvas).text(
            (pad - bbox[0], pad - bbox[1]),
            ch,
            font=font,
            fill=(255, 255, 255, 255),
        )
        rotated = canvas.rotate(rotation, resample=Image.Resampling.BICUBIC, expand=True)
        img.alpha_composite(
            rotated,
            (int(round(x - rotated.width / 2)), int(round(y - rotated.height / 2))),
        )


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    out = src.copy()

    # Fully erase original ring lettering + old generated leftovers.
    clear_ring(out, 198.0, 285.0)

    # Restore thin white divider circle around monogram.
    draw_white_circle(out, radius=209.0, width=4)

    font = load_font(15)
    draw_arc_text(out, TOP_TEXT, radius=247.0, font=font, start_deg=150, end_deg=30)
    draw_arc_text(
        out,
        BOTTOM_TEXT,
        radius=247.0,
        font=font,
        start_deg=-150,
        end_deg=-30,
        bottom=True,
    )

    out.save(OUT, format="PNG")
    print(f"Saved {OUT}")


if __name__ == "__main__":
    main()
