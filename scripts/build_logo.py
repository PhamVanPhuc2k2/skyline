#!/usr/bin/env python3
"""Tạo bộ file logo AIRLIFE từ bộ logo _thiet-ke/logo-airlife-4.pdf (Logo Airlife_4.pdf). CHẠY TAY khi logo đổi.

    python3 scripts/build_logo.py

Cần `pdftocairo` (poppler-utils); xuất PNG thì cần thêm Google Chrome (không có thì chỉ ra SVG).
Script lấy nguyên vector của từng logo trong PDF (giữ đúng hình và tỉ lệ trên lưới), bỏ lưới, chú thích, nền
trang, rồi tô lại bằng đúng mã màu quy định trong bản hướng dẫn:
  - Màu 1  #6C3C8B: đuôi máy bay, chữ AIR, slogan
  - Màu 2  dải #C86E3A → #F8AC3F: chữ LIFE (đậm dưới, sáng trên), cánh (đậm phải, sáng trái)
  - Bản "white" (nền tối): tất cả trắng, chữ AIRLIFE.VN trên đuôi được khoét thủng
Bộ logo trong PDF có 3 kiểu (mỗi kiểu dùng cho một ngữ cảnh, xem DEPLOY.md):
  Logo 1  ngang, đầy đủ chữ AIRLIFE (logo chính)      -> airlife-logo*
  Logo 2  đuôi máy bay, chữ AIRLIFE.VN dọc (có/không slogan)   -> airlife-logo2*, airlife-mark
  Logo 3  đuôi máy bay, chữ AIRLIFE.VN ngang (có/không slogan) -> airlife-logo3*
Ghi ra images/brand/ (mỗi logo có .svg và .png nếu có Chrome).
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_thiet-ke" / "logo-airlife-4.pdf"
OUT = ROOT / "images" / "brand"

PURPLE = "#6C3C8B"
ORANGE_DARK = "#C86E3A"
ORANGE_LIGHT = "#F8AC3F"
MARGIN = 2.0  # lề trong viewBox (pt), để nét không chạm mép

# Từng trang của PDF -> các phần của logo, nhận diện theo bbox (pt) trên trang.
# tail = đuôi (tím), text = chữ AIRLIFE.VN trên đuôi (trắng), wing = cánh (dải cam),
# air / life = chữ AIR (tím) / LIFE (dải cam), slogan = Tăng giá trị cuộc sống (tím)
PAGES = {
    "logo1": (2, {
        "tail": (78.3, 204.8, 312.9, 353.0), "text": (98.9, 216.5, 166.8, 321.8),
        "wing": (115.4, 339.2, 250.4, 385.5), "air": (296.8, 268.8, 501.7, 353.0),
        "life": (509.4, 269.7, 763.4, 353.0), "slogan": (466.7, 357.6, 763.4, 390.1)}),
    "logo2-slogan": (5, {
        "tail": (188.1, 167.9, 516.7, 377.1), "text": (211.0, 181.9, 316.9, 346.0),
        "wing": (235.9, 357.8, 427.0, 427.0), "slogan": (367.2, 391.3, 653.7, 422.7)}),
    "logo2": (6, {
        "tail": (256.6, 167.9, 585.2, 377.1), "text": (279.5, 181.9, 385.4, 346.0),
        "wing": (304.4, 357.8, 495.5, 427.0)}),
    "logo3-slogan": (9, {
        "tail": (200.0, 160.6, 547.2, 381.6), "text": (309.9, 328.1, 450.3, 345.7),
        "wing": (250.5, 361.2, 452.4, 434.3), "slogan": (389.4, 390.5, 641.7, 418.1)}),
    "logo3": (10, {
        "tail": (247.3, 160.6, 594.5, 381.6), "text": (357.1, 328.1, 497.5, 345.7),
        "wing": (297.7, 361.2, 499.7, 434.3)}),
}

# Tên file -> (trang, các phần, kiểu màu, độ rộng PNG)
VARIANTS = {
    "airlife-logo": ("logo1", ["tail", "text", "wing", "air", "life", "slogan"], "color", 1600),
    # Logo 1 không có bản "Off Slogan" trong hướng dẫn; bỏ slogan cho chỗ nhỏ (header) vì chữ slogan không đọc được ở cỡ nhỏ
    "airlife-logo-no-slogan": ("logo1", ["tail", "text", "wing", "air", "life"], "color", 1600),
    # Logo trắng cho nền tối (theo file Excel yêu cầu): toàn bộ màu trắng, kể cả LIFE và cánh; không slogan
    "airlife-logo-white": ("logo1", ["tail", "text", "wing", "air", "life"], "white", 1600),
    "airlife-logo-white-slogan": ("logo1", ["tail", "text", "wing", "air", "life", "slogan"], "white", 1600),
    "airlife-logo2": ("logo2", ["tail", "text", "wing"], "color", 600),
    "airlife-logo2-slogan": ("logo2-slogan", ["tail", "text", "wing", "slogan"], "color", 1000),
    "airlife-logo3": ("logo3", ["tail", "text", "wing"], "color", 600),
    "airlife-logo3-slogan": ("logo3-slogan", ["tail", "text", "wing", "slogan"], "color", 1000),
    # Biểu tượng đuôi máy bay (Logo 2, Off Slogan): đặt trước tiêu đề chuyên mục, favicon
    "airlife-mark": ("logo2", ["tail", "text", "wing"], "color", 512),
}


def bbox(d):
    nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", d)]
    return min(nums[0::2]), min(nums[1::2]), max(nums[0::2]), max(nums[1::2])


def near(b, ref, tol=1.5):
    return all(abs(x - y) <= tol for x, y in zip(b, ref))


def load_page(n):
    tmp = Path(tempfile.mkdtemp()) / f"p{n}.svg"
    subprocess.run(["pdftocairo", "-svg", "-f", str(n), "-l", str(n), str(SRC), str(tmp)], check=True)
    svg = tmp.read_text(encoding="utf-8")
    body = svg[svg.index("</defs>"):]
    items = []
    # Phần tô màu phẳng
    for attrs in re.findall(r"<path([^>]*?)/>", body):
        fill = re.search(r'fill="([^"]*)"', attrs)
        d = re.search(r' d="([^"]*)"', attrs).group(1)
        if fill and not fill.group(1).startswith("url"):
            rule = re.search(r'fill-rule="([^"]*)"', attrs)
            items.append({"d": d, "rule": rule.group(1) if rule else "nonzero", "bbox": bbox(d), "grad": None})
    # Phần dải màu: PDF tô gradient bằng hình chữ nhật cắt theo clipPath (clip trong = hình thật)
    clips = {m.group(1): re.findall(r' d="([^"]*)"', m.group(2)) for m in re.finditer(r'<clipPath id="([^"]+)">(.*?)</clipPath>', svg, re.S)}
    for outer, inner, grad in re.findall(r'<g clip-path="url\(#([^)]+)\)">\s*<g clip-path="url\(#([^)]+)\)">\s*<path[^>]*fill="url\(#([^)]+)\)"', body):
        gm = re.search(r'<linearGradient id="%s"([^>]*)>' % re.escape(grad), svg)
        a = gm.group(1)
        val = lambda k: float(re.search(k + r'="([^"]*)"', a).group(1))
        t = [float(v) for v in re.search(r"matrix\(([^)]*)\)", a).group(1).split(",")]
        p = lambda x, y: (t[0] * x + t[4], t[3] * y + t[5])
        d = clips[inner][0]
        items.append({"d": d, "rule": "nonzero", "bbox": bbox(d),
                      "grad": (p(val("x1"), val("y1")), p(val("x2"), val("y2")))})
    return items


def pick(items, refs):
    found = {}
    for name, ref in refs.items():
        hit = [i for i in items if near(i["bbox"], ref)]
        if not hit:
            sys.exit(f"Không tìm thấy phần '{name}' của logo (bbox {ref}). Kiểm tra lại PAGES nếu file thiết kế đổi bố cục.")
        found[name] = hit[0]
    return found


def shift(d, ox, oy):
    vals = iter(range(10 ** 9))

    def fix(m):
        v = float(m.group(0)) - (ox if next(vals) % 2 == 0 else oy)
        return f"{v:.2f}".rstrip("0").rstrip(".")
    return re.sub(r"\s+", " ", re.sub(r"-?\d+\.?\d*", fix, d)).strip()


def build(parts, names, mode, title):
    boxes = [parts[n]["bbox"] for n in names]
    x1 = min(b[0] for b in boxes) - MARGIN; y1 = min(b[1] for b in boxes) - MARGIN
    x2 = max(b[2] for b in boxes) + MARGIN; y2 = max(b[3] for b in boxes) + MARGIN
    w, h = x2 - x1, y2 - y1
    flat = PURPLE if mode == "color" else "#FFFFFF"
    defs, body = "", ""
    for n in names:
        p = parts[n]
        if n == "text" and mode == "white":
            continue  # chữ trên đuôi được khoét thủng ở phần đuôi (xem dưới)
        if p["grad"] and mode != "white":
            (ax, ay), (bx, by) = p["grad"]
            gid = f"al-{n}"
            defs += (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{ax - x1:.2f}" y1="{ay - y1:.2f}" x2="{bx - x1:.2f}" y2="{by - y1:.2f}">'
                     f'<stop offset="0" stop-color="{ORANGE_DARK}"/><stop offset="1" stop-color="{ORANGE_LIGHT}"/></linearGradient>')
            fill, rule = f"url(#{gid})", "nonzero"
        elif n == "text":
            fill, rule = "#FFFFFF", p["rule"]
        else:
            fill, rule = flat, p["rule"]
        d = shift(p["d"], x1, y1)
        if n == "tail" and mode == "white" and "text" in names:
            # Bản trắng: chữ AIRLIFE.VN khoét thủng đuôi (nhìn thấy nền), không phủ chữ trắng lên đuôi trắng
            d += " " + shift(parts["text"]["d"], x1, y1)
            rule = "evenodd"
        body += f'<path fill="{fill}" fill-rule="{rule}" d="{d}"/>'
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
           f"<title>{title}</title><defs>{defs}</defs>{body}</svg>\n")
    return svg, w, h


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
    OUT.mkdir(parents=True, exist_ok=True)
    pages = {}
    for key, (num, refs) in PAGES.items():
        pages[key] = pick(load_page(num), refs)
    for name, (key, names, mode, png_w) in VARIANTS.items():
        slogan = "Tăng giá trị cuộc sống" if "slogan" in names else "AIRLIFE"
        svg, w, h = build(pages[key], names, mode, f"AIRLIFE – {slogan}" if slogan != "AIRLIFE" else "AIRLIFE")
        svg_path = OUT / f"{name}.svg"
        svg_path.write_text(svg, encoding="utf-8")
        png = to_png(svg_path, OUT / f"{name}.png", png_w, w, h)
        print(f"{name}: {w:.1f} × {h:.1f} pt (tỉ lệ {w / h:.3f}){' + PNG ' + str(png_w) + 'px' if png else ''}")


if __name__ == "__main__":
    main()
