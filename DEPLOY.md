# SKYLINE: mockup giao diện mới cho skyline.vn

Web **tĩnh** (HTML/CSS/JS), không cần Node, PHP hay database. Đây là bản mockup để khách duyệt bố cục;
nội dung là dữ liệu mẫu trong `data/content.json`, ảnh minh họa lấy từ picsum.photos (cần internet).

## 1. Các trang

**Menu dọc** (kiểu YouTube): Home · Xem · Nghe · Mới tải · Bạn · Sưu tập.
**Menu ngang** (chuyên mục, rê chuột xổ tiểu mục): Tiện ích · Tin tức · Kinh doanh · Ý kiến · Tour bay.

| File | Trang |
|---|---|
| `index.html` | Home (bố cục theo bản vẽ tay: 3 ô trái, khối nổi bật, cột bình luận Hay/Nhiều, hàng 4 thẻ, hàng 3 khối) |
| `chuyen-muc.html?c=xem` / `nghe` | Xem, Nghe (menu dọc) |
| `chuyen-muc.html?c=kinh-doanh` / `tour-bay` | Kinh doanh (vé bay, miễn thuế, mua sắm, đặc sản, dịch vụ sân bay), Tour bay. Lọc tiểu mục bằng `&f=` |
| `tien-ich.html?tab=...` | Tiện ích: ra tàu bay, Flightradar, thời tiết điểm đến, Wi-Fi, phòng chờ & fast-track |
| `y-kien.html?tab=...` | Ý kiến: trải nghiệm, khảo sát, góp ý |
| `tin-tuc.html?f=...`, `bai-viet.html?id=...` | Tin tức (Khám phá, Sự kiện, Mẹo bay, Line-up phim…) |
| `moi-tai.html` | Mới tải (gồm tab Line-up phim tháng, giữ từ site cũ) |
| `ban.html` | Bạn: hồ sơ, chuyến bay sắp tới, đơn hàng, tiếp tục xem, kênh theo dõi |
| `suu-tap.html` | Sưu tập: playlist, đã lưu, yêu thích, đã xem |
| `xem.html?id=...` | Xem video / nghe audio, sản phẩm gắn trong video, bình luận |
| `san-pham.html?id=...` | Sản phẩm, vé bay, tour (vé/tour có chọn ngày, số khách) |
| `kenh.html?id=...` | Kênh nhà sáng tạo / doanh nghiệp |
| `lien-he.html`, `tim-kiem.html?q=...` | Liên hệ, tìm kiếm |

Header, 2 menu, thanh tab mobile, footer và mini player dùng chung, do `js/layout.js` vẽ
(danh sách mục menu ở `TOPNAV` và `SIDENAV`). Nội dung từng trang do `js/main.js` vẽ, chọn theo `<body data-page="...">`.
Bảng màu ở `scss/_variables.scss`.

## 2. Chạy thử trên máy

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## 3. Đưa lên server

```
/var/www/skyline/
├── *.html            14 trang
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
