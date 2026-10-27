#!/usr/bin/env python3
"""Tách bộ icon Player từ file thiết kế _thiet-ke/Player.pdf (xuất từ Player.ai). CHẠY TAY khi designer sửa icon.

    python3 scripts/build_icons.py

Cần `pdftocairo` (gói poppler-utils). Script đọc vector trong PDF, gom các path theo vùng của từng icon
và ghi ra:
  - images/icons/<tên>.svg   từng icon riêng (để designer / dev xem lại)
  - js/icons.js              window.PLAYER_ICONS = {tên: {vb, paths}}, layout.js dùng để vẽ icon
Icon tô bằng currentColor: màu lấy theo CSS (trạng thái on/off đổi bằng màu, hình giữ nguyên).
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_thiet-ke" / "Player.pdf"
OUT_DIR = ROOT / "images" / "icons"
ICONS_JS = ROOT / "js" / "icons.js"

# Tên icon -> vùng chứa nó trên artboard (x1, y1, x2, y2, đơn vị pt của PDF).
# Với cặp on/off giống hình nhau, chỉ lấy bản "on" (màu trắng).
REGIONS = {
    "home": (180, 170, 390, 420),        # Nút Home (tháp không lưu)
    "rewind": (520, 160, 770, 430),      # Nút tua ngược 10 giây
    "forward": (785, 160, 1030, 430),    # Nút tua 10 giây
    "screen": (1355, 180, 1585, 420),    # Thanh hình (bật/tắt hình)
    "sound": (1110, 560, 1365, 795),     # Thanh âm thanh (bật/tắt tiếng)
    "pause": (200, 560, 370, 775),       # Nút tạm dừng
    "play": (485, 560, 715, 775),        # Nút Play
    "plane-thumb": (650, 1095, 690, 1130),  # Đầu máy bay trên thanh Player
}
PAD = 0.04  # lề quanh icon trong viewBox


def pdf_to_svg():
    tmp = Path(tempfile.mkdtemp()) / "player.svg"
    subprocess.run(["pdftocairo", "-svg", str(SRC), str(tmp)], check=True)
    return tmp.read_text(encoding="utf-8")


def paths_of(svg):
    """Các path vẽ (bỏ glyph chữ trong <defs> và nền đen), kèm bbox và màu."""
    body = svg[svg.index("</defs>"):]
    out = []
    for attrs in re.findall(r"<path([^>]*?)/>", body):
        d = re.search(r' d="([^"]*)"', attrs).group(1)
        nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", d)]
        xs, ys = nums[0::2], nums[1::2]
        rule = re.search(r'fill-rule="([^"]*)"', attrs)
        out.append({
            "d": d,
            "rule": rule.group(1) if rule else "nonzero",
            "white": 'fill="rgb(100%, 100%, 100%)"' in attrs,
            "bbox": (min(xs), min(ys), max(xs), max(ys)),
        })
    return out


def shorten(d, ox, oy):
    """Dời gốc toạ độ về góc viewBox và làm tròn 2 chữ số để file nhỏ hơn."""
    vals = iter(range(10 ** 9))

    def fix(m):
        i = next(vals)
        v = float(m.group(0)) - (ox if i % 2 == 0 else oy)
        return f"{v:.2f}".rstrip("0").rstrip(".")
    # Lệnh path của cairo chỉ có M/L/C/Z với toạ độ tuyệt đối theo cặp x y
    return re.sub(r"\s+", " ", re.sub(r"-?\d+\.?\d*", fix, d)).strip()


def main():
    if not SRC.exists():
        sys.exit(f"Không thấy {SRC.relative_to(ROOT)}")
    paths = paths_of(pdf_to_svg())
    icons = {}
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, (x1, y1, x2, y2) in REGIONS.items():
        group = [p for p in paths if p["white"] and x1 <= p["bbox"][0] and p["bbox"][2] <= x2 and y1 <= p["bbox"][1] and p["bbox"][3] <= y2]
        if not group:
            sys.exit(f"Icon '{name}': không tìm thấy path trong vùng {REGIONS[name]}")
        bx1 = min(p["bbox"][0] for p in group); by1 = min(p["bbox"][1] for p in group)
        bx2 = max(p["bbox"][2] for p in group); by2 = max(p["bbox"][3] for p in group)
        # viewBox vuông, icon nằm giữa
        size = max(bx2 - bx1, by2 - by1) * (1 + 2 * PAD)
        ox = (bx1 + bx2) / 2 - size / 2
        oy = (by1 + by2) / 2 - size / 2
        vb = f"0 0 {size:.2f} {size:.2f}"
        items = [{"d": shorten(p["d"], ox, oy), "rule": p["rule"]} for p in group]
        icons[name] = {"vb": vb, "paths": items}
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="currentColor">' + "".join(
            f'<path fill-rule="{p["rule"]}" d="{p["d"]}"/>' for p in items) + "</svg>\n"
        (OUT_DIR / f"{name}.svg").write_text(svg, encoding="utf-8")

    ICONS_JS.write_text(
        "/**\n * TỰ ĐỘNG TẠO bởi scripts/build_icons.py từ _thiet-ke/Player.pdf — không sửa tay file này.\n */\n"
        "window.PLAYER_ICONS = " + json.dumps(icons, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"Đã tách {len(icons)} icon: {', '.join(icons)} -> images/icons/, js/icons.js ({ICONS_JS.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
