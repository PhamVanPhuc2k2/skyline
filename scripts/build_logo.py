#!/usr/bin/env python3
"""Tạo bộ file logo AIRLIFE từ bản hướng dẫn thương hiệu _thiet-ke/brand-airlife.pdf. CHẠY TAY khi logo đổi.

    python3 scripts/build_logo.py

Cần `pdftocairo` (poppler-utils); xuất PNG thì cần thêm Google Chrome (không có thì chỉ ra SVG).
Script lấy nguyên vector của logo trong PDF (giữ đúng hình và tỉ lệ trên lưới), bỏ lưới & chú thích,
tô lại bằng đúng mã màu quy định trong bản hướng dẫn:
  - Màu 1  #6C3C8B: đuôi máy bay, chữ AIR, slogan
  - Màu 2  dải #C86E3A → #F8AC3F (điểm giữa ở 1/2 thanh): chữ LIFE (đậm dưới, sáng trên), cánh dưới (đậm phải, sáng trái)
Ghi ra images/brand/:
  airlife-logo.svg / .png              logo đầy đủ có slogan "Đời sống hàng không"
  airlife-logo-no-slogan.svg / .png    bản không slogan (header, chỗ nhỏ)
  airlife-logo-white.svg / .png        bản trên nền tối: phần tím chuyển trắng, giữ dải cam
  airlife-mark.svg / .png              biểu tượng đuôi + cánh (favicon, avatar, app icon)
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_thiet-ke" / "brand-airlife.pdf"
OUT = ROOT / "images" / "brand"

PURPLE = "#6C3C8B"
ORANGE_DARK = "#C86E3A"
ORANGE_LIGHT = "#F8AC3F"
MARGIN = 2.0  # lề trong viewBox (pt), để nét không chạm mép

# Nhận diện từng phần logo theo bbox trên trang PDF (pt). Lưới 1 ô = 1 cm = 28,35 pt.
PARTS = {
    "tail": (161, 103, 342, 218),     # đuôi máy bay (tím)
    "air": (328, 152, 486, 218),      # chữ AIR (tím)
    "slogan": (465, 220, 686, 246),   # Đời sống hàng không (tím)
    "wing": (189, 205, 294, 243),     # cánh dưới (dải cam, trong clipPath)
    "life": (490, 152, 686, 218),     # chữ LIFE (dải cam, trong clipPath)
}


def bbox(d):
    nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", d)]
    return min(nums[0::2]), min(nums[1::2]), max(nums[0::2]), max(nums[1::2])


def inside(b, area, tol=1.5):
    return b[0] >= area[0] - tol and b[1] >= area[1] - tol and b[2] <= area[2] + tol and b[3] <= area[3] + tol


def extract():
    tmp = Path(tempfile.mkdtemp()) / "brand.svg"
    subprocess.run(["pdftocairo", "-svg", str(SRC), str(tmp)], check=True)
    svg = tmp.read_text(encoding="utf-8")
    purple_fill = re.compile(r'fill="rgb\(39\.\d+%, 17\.\d+%, 52\.\d+%\)"')
    found = {}
    # Phần tím: path tô màu tím
    for attrs in re.findall(r"<path([^>]*?)/>", svg):
        if not purple_fill.search(attrs):
            continue
        d = re.search(r' d="([^"]*)"', attrs).group(1)
        for name in ("tail", "air", "slogan"):
            if inside(bbox(d), PARTS[name]):
                found[name] = d
    # Phần dải cam: hình nằm trong clipPath (PDF tô gradient bằng cách cắt hình chữ nhật theo clip)
    for body in re.findall(r"<clipPath[^>]*>(.*?)</clipPath>", svg, re.S):
        for d in re.findall(r' d="([^"]*)"', body):
            for name in ("wing", "life"):
                b = bbox(d)
                # bỏ khung chữ nhật bao (path ngắn 4 điểm), lấy hình thật
                if inside(b, PARTS[name]) and len(d) > 200:
                    found[name] = d
    missing = [n for n in PARTS if n not in found]
    if missing:
        sys.exit(f"Không tìm thấy phần logo: {missing}. Kiểm tra lại PARTS nếu file thiết kế đổi bố cục.")
    return found


def shift(d, ox, oy):
    vals = iter(range(10 ** 9))

    def fix(m):
        v = float(m.group(0)) - (ox if next(vals) % 2 == 0 else oy)
        return f"{v:.2f}".rstrip("0").rstrip(".")
    return re.sub(r"\s+", " ", re.sub(r"-?\d+\.?\d*", fix, d)).strip()


def build(parts, names, purple, title):
    boxes = [bbox(parts[n]) for n in names]
    x1 = min(b[0] for b in boxes) - MARGIN; y1 = min(b[1] for b in boxes) - MARGIN
    x2 = max(b[2] for b in boxes) + MARGIN; y2 = max(b[3] for b in boxes) + MARGIN
    w, h = x2 - x1, y2 - y1
    # Gradient theo toạ độ thật của từng phần (userSpaceOnUse), đúng hướng như bản thiết kế
    wing = bbox(parts["wing"]); life = bbox(parts["life"])
    defs = (
        f'<linearGradient id="al-life" gradientUnits="userSpaceOnUse" x1="0" y1="{life[3] - y1:.2f}" x2="0" y2="{life[1] - y1:.2f}">'
        f'<stop offset="0" stop-color="{ORANGE_DARK}"/><stop offset="1" stop-color="{ORANGE_LIGHT}"/></linearGradient>'
        f'<linearGradient id="al-wing" gradientUnits="userSpaceOnUse" x1="{wing[2] - x1:.2f}" y1="0" x2="{wing[0] - x1:.2f}" y2="0">'
        f'<stop offset="0" stop-color="{ORANGE_DARK}"/><stop offset="1" stop-color="{ORANGE_LIGHT}"/></linearGradient>'
    )
    fills = {"tail": purple, "air": purple, "slogan": purple, "wing": "url(#al-wing)", "life": "url(#al-life)"}
    body = "".join(f'<path fill="{fills[n]}" d="{shift(parts[n], x1, y1)}"/>' for n in names)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
            f"<title>{title}</title><defs>{defs}</defs>{body}</svg>\n"), w, h


def to_png(svg_path, png_path, width, w, h):
    chrome = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
    if not chrome:
        return False
    height = round(width * h / w)
    page = Path(tempfile.mkdtemp()) / "logo.html"
    page.write_text(f'<html><body style="margin:0"><img src="{svg_path.as_uri()}" style="display:block;width:{width}px;height:{height}px"></body></html>')
    subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
                    "--default-background-color=00000000", f"--window-size={width},{height}",
                    f"--screenshot={png_path}", page.as_uri()], check=True, capture_output=True)
    return True


def main():
    if not SRC.exists():
        sys.exit(f"Không thấy {SRC.relative_to(ROOT)}")
    parts = extract()
    OUT.mkdir(parents=True, exist_ok=True)
    full = ["tail", "wing", "air", "life", "slogan"]
    variants = {
        "airlife-logo": (full, PURPLE, 1600),
        "airlife-logo-no-slogan": (["tail", "wing", "air", "life"], PURPLE, 1600),
        "airlife-logo-white": (full, "#FFFFFF", 1600),
        "airlife-mark": (["tail", "wing"], PURPLE, 512),
    }
    for name, (names, purple, png_w) in variants.items():
        svg, w, h = build(parts, names, purple, "AIRLIFE – Đời sống hàng không")
        svg_path = OUT / f"{name}.svg"
        svg_path.write_text(svg, encoding="utf-8")
        png = to_png(svg_path, OUT / f"{name}.png", png_w, w, h)
        print(f"{name}: {w:.1f} × {h:.1f} pt (tỉ lệ {w / h:.3f}){' + PNG ' + str(png_w) + 'px' if png else ''}")


if __name__ == "__main__":
    main()
