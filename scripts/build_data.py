#!/usr/bin/env python3
"""Tạo js/data.js từ data/content.json. CHẠY TAY khi sửa nội dung.

    python3 scripts/build_data.py

Mockup chưa có API: toàn bộ nội dung (chuyên mục, video/audio, sản phẩm, kênh, bình luận, tin tức)
nằm trong data/content.json. Khi có backend, thay window.DATA bằng dữ liệu gọi từ API.
Chỉ dùng thư viện chuẩn của Python.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_JSON = ROOT / "data" / "content.json"
DATA_JS = ROOT / "js" / "data.js"

HEADER = """/**
 * TỰ ĐỘNG TẠO bởi scripts/build_data.py — không sửa tay file này.
 * Sửa nội dung ở data/content.json rồi chạy lại script.
 */
"""


def check(data):
    """Báo lỗi sớm khi id tham chiếu sai (kênh, sản phẩm, người dùng không tồn tại)."""
    channels = {c["id"] for c in data["channels"]}
    products = {p["id"] for p in data["products"]}
    media = {m["id"] for m in data["media"]}
    users = {u["id"] for u in data["users"]}
    errors = []
    for m in data["media"]:
        if m["channel"] not in channels:
            errors.append(f"media {m['id']}: kênh '{m['channel']}' không tồn tại")
        errors += [f"media {m['id']}: sản phẩm '{p}' không tồn tại" for p in m.get("products", []) if p not in products]
    for p in data["products"]:
        if p["channel"] not in channels:
            errors.append(f"product {p['id']}: kênh '{p['channel']}' không tồn tại")
    for c in data["comments"]:
        if c["user"] not in users:
            errors.append(f"comment: người dùng '{c['user']}' không tồn tại")
        if c["media"] not in media | products:
            errors.append(f"comment: nội dung '{c['media']}' không tồn tại")
    if errors:
        sys.exit("\n".join(errors))


def main():
    data = json.loads(CONTENT_JSON.read_text(encoding="utf-8"))
    check(data)
    DATA_JS.parent.mkdir(parents=True, exist_ok=True)
    DATA_JS.write_text(HEADER + "window.DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Đã ghi {DATA_JS.relative_to(ROOT)}: {len(data['media'])} nội dung, {len(data['products'])} sản phẩm, {len(data['channels'])} kênh")


if __name__ == "__main__":
    main()
