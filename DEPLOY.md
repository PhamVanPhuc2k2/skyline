# SKYLINE: mockup giao diện mới cho skyline.vn

Web **tĩnh** (HTML/CSS/JS), không cần Node, PHP hay database. Đây là bản mockup để khách duyệt bố cục;
nội dung là dữ liệu mẫu trong `data/content.json`, ảnh minh họa lấy từ picsum.photos (cần internet).

## 1. Các trang

| File | Trang |
|---|---|
| `index.html` | Trang chủ (bố cục theo bản vẽ tay: 3 ô trái, khối nổi bật, cột bình luận Hay/Nhiều, hàng 4 thẻ, hàng 3 khối) |
| `chuyen-muc.html?c=xem` / `nghe` / `mua-sam` | 3 chuyên mục, đầu trang có khối nổi bật lớn giống trang chủ |
| `xem.html?id=...` | Xem video / nghe audio, sản phẩm gắn trong video, bình luận, danh sách tiếp theo |
| `san-pham.html?id=...` | Chi tiết sản phẩm, chọn nơi nhận hàng (cửa ra máy bay / sân bay đến / tận nhà) |
| `kenh.html?id=...` | Kênh nhà sáng tạo / doanh nghiệp: video, nghe, cửa hàng, giới thiệu |
| `line-up-moi.html` | Line-up phim mới theo tháng (giữ từ site cũ) |
| `tin-tuc.html`, `bai-viet.html?id=...` | Tin tức |
| `lien-he.html` | Liên hệ & hợp tác |
| `tim-kiem.html?q=...` | Tìm kiếm |

Header, sidebar, thanh tab mobile, footer và mini player dùng chung, do `js/layout.js` vẽ.
Nội dung từng trang do `js/main.js` vẽ, chọn theo `<body data-page="...">`.

## 2. Chạy thử trên máy

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## 3. Đưa lên server

```
/var/www/skyline/
├── *.html            10 trang
├── css/style.css
├── js/data.js, js/layout.js, js/main.js
└── images/favicon.svg
```

Không đưa lên: `scss/` (mã nguồn CSS), `data/` (nguồn nội dung), `scripts/`.

## 4. Thao tác thường gặp

**Sửa nội dung mẫu** (phim, podcast, sản phẩm, kênh, bình luận, tin): sửa `data/content.json`,
rồi chạy `python3 scripts/build_data.py`. Không sửa tay `js/data.js`.

**Sửa giao diện**: sửa SCSS rồi build lại CSS
(`npx sass --no-source-map scss/style.scss css/style.css`), tăng số `?v=` trong các file HTML.
