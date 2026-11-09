# AIRLIFE – Tăng giá trị cuộc sống: mockup giao diện mới (thay cho skyline.vn)

Web **tĩnh** (HTML/CSS/JS), không cần Node, PHP hay database. Đây là bản mockup để khách duyệt bố cục;
nội dung là dữ liệu mẫu trong `data/content.json`, ảnh minh họa lấy từ picsum.photos (cần internet).

## 1. Các trang

**Menu dọc** (kiểu YouTube): Home · Xem · Nghe · Mới tải · Bạn · Sưu tập.
**Menu ngang** (chuyên mục, rê chuột xổ tiểu mục), theo kết cấu khách gửi:
Tiện ích (Thông tin chuyến bay · Giám sát chuyến bay · Sơ đồ hướng dẫn · Thời tiết sân bay) ·
Tin tức (An ninh · Vũ trụ · UAV · Không quân) · Kinh doanh (Vé bay · Tài chính · Phi hàng không) ·
Ý kiến (Trải nghiệm · Khảo sát) · Tour bay (Điểm đến · Dịch vụ · Ăn chơi · Mua sắm) ·
Sách nói (Cẩm nang · Kỹ năng sống · Tâm linh). Danh sách nằm ở `TOPNAV` trong `js/layout.js`.

| File | Trang |
|---|---|
| `index.html` | Home (bố cục theo bản vẽ tay: 3 ô trái, khối nổi bật, cột bình luận Hay/Nhiều, hàng 4 thẻ, hàng 3 khối) |
| `chuyen-muc.html?c=xem` / `nghe` | Xem, Nghe (menu dọc) |
| `chuyen-muc.html?c=kinh-doanh` / `tour-bay` / `sach-noi` | Kinh doanh, Tour bay, Sách nói. Lọc tiểu mục bằng `&f=` |
| `tien-ich.html` | Tiện ích, một trang 4 khối: `#giam-sat` (bản đồ trực tiếp kiểu Flightradar24), `#thong-tin` (ảnh ngang theo cảng hàng không; `?ap=HAN` mở bảng chuyến đi/đến, `?ap=khac` các cảng khác), `#so-do` (sơ đồ nhà ga & tàu bay), `#thoi-tiet` |
| `y-kien.html?tab=...` | Ý kiến: trải nghiệm, khảo sát |
| `tin-tuc.html?f=...`, `bai-viet.html?id=...` | Tin tức (An ninh, Vũ trụ, UAV, Không quân) |
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

**Logo AIRLIFE & màu thương hiệu**: lấy từ bộ logo `_thiet-ke/logo-airlife-4.pdf` (file `Logo Airlife_4.pdf` của khách,
thay cho bản hướng dẫn 1 trang trước đó). Chạy `python3 scripts/build_logo.py` để tạo lại bộ file trong `images/brand/`
(SVG + PNG, đúng hình & tỉ lệ trong PDF, tô lại bằng mã màu quy định: tím #6C3C8B, dải cam #C86E3A → #F8AC3F).
Slogan: **"Tăng giá trị cuộc sống"**. Bộ logo có 3 kiểu, mỗi kiểu dùng cho một ngữ cảnh:

| Kiểu | File | Dùng ở đâu |
|---|---|---|
| Logo 1 (chính, ngang, chữ AIRLIFE) | `airlife-logo`, `airlife-logo-white` (nền tối) | **Header** dùng `airlife-logo-header` (Logo 1 có slogan; riêng chữ slogan phóng to 1,6 lần theo yêu cầu khách để đọc được ở cỡ header). **Chân trang** dùng `airlife-logo-white` (trắng toàn bộ, kể cả LIFE và cánh, chữ AIRLIFE.VN khoét thủng; bản có slogan: `airlife-logo-white-slogan`). `airlife-logo-no-slogan` dùng ở chỗ nhỏ như thẻ lên máy bay |
| Logo 2 (đuôi máy bay, chữ AIRLIFE.VN dọc) | `airlife-logo2`, `airlife-logo2-slogan`, `airlife-mark` | Chỗ vuông / hẹp: favicon, avatar, icon app, **biểu tượng trước tên chuyên mục** |
| Logo 3 (đuôi máy bay, chữ AIRLIFE.VN ngang) | `airlife-logo3`, `airlife-logo3-slogan` | Chỗ vuông / hẹp khi cần đọc được chữ AIRLIFE.VN (cỡ lớn hơn Logo 2) |

Màu chữ theo logo: **chuyên mục = tím (Màu 1)**, **tiểu mục = cam (Màu 2)**, định nghĩa ở `$tier-main` / `$tier-sub` trong
`scss/_variables.scss`. Bảng màu site cũng theo 2 màu này. Tên chuyên mục đặt cạnh logo dựng như logo chính
(`.lockup` trong `scss/_components.scss`): chữ nằm trên đường chân đuôi máy bay.

**Icon & thanh Player**: Home, Play, Tạm dừng, Tua ngược/tua 10s, Thanh hình, Thanh âm thanh lấy từ `_thiet-ke/Player.pdf`
(bản gốc `Player.ai`); máy bay ở đầu thanh lấy từ `_thiet-ke/thanh-player.ai` (file `Thanh Player.ai`). Khi designer sửa: xuất lại file
vào `_thiet-ke/`, chạy `python3 scripts/build_icons.py` (cần `pdftocairo`), script ghi `js/icons.js` và `images/icons/*.svg`.
Thanh Player vẽ bằng CSS (`.runway` trong `scss/_layout.scss`) theo số đo trong `thanh-player.ai`: đường băng, hàng vạch + hàng chấm đèn hai bên,
phần đã chạy trắng, máy bay ở đầu; chưa chạy thì vạch/chấm xám, đang chạy thì vạch trắng và chấm đèn thành **điểm sáng lung linh** (lõi trắng, quầng sáng, 8 tia, theo ảnh mẫu của khách, hai hàng sáng đều). Điểm sáng vẽ vector ở `images/runway-spark.svg` (sửa trực tiếp file này nếu muốn đổi hình); không lấy ảnh bitmap từ file `.ai` vì thu nhỏ sẽ bị nhoè.
Icon thanh hình (trình phát video) / thanh âm thanh (trình phát audio, mini player) là chỉ báo trạng thái: xám khi chưa chạy, trắng khi đang chạy.
Các icon còn lại (tìm kiếm, giỏ hàng, chuông…) là icon nét trong `js/layout.js` vì bộ thiết kế chưa có.

**Bản đồ giám sát chuyến bay** dùng thư viện Leaflet 1.9.4 (nạp từ unpkg, chỉ ở `tien-ich.html`) và nền bản đồ Esri World Topo
(không cần API key, phải giữ dòng ghi nguồn "Tiles © Esri"). Máy bay trên bản đồ là dữ liệu minh hoạ; khi làm thật cần nguồn dữ liệu
chuyến bay trực tiếp (ADS-B / nhà cung cấp dữ liệu bay). **Ảnh sân bay** lấy từ Wikimedia Commons (trường `photo` trong
`data/content.json` > `airports`), cần ghi nguồn tác giả theo giấy phép của từng ảnh hoặc thay bằng ảnh có bản quyền khi lên thật.

## 2. Chạy thử trên máy

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## 3. Đưa lên server

```
/var/www/airlife/
├── *.html            14 trang
├── css/style.css
├── js/data.js, js/icons.js, js/layout.js, js/main.js
└── images/favicon.svg, images/runway-spark.svg, images/brand/*.svg
```

Không đưa lên: `scss/` (mã nguồn CSS), `data/` (nguồn nội dung), `scripts/`, `_thiet-ke/` (file thiết kế).

## 4. Thao tác thường gặp

**Sửa nội dung mẫu** (phim, podcast, sản phẩm, kênh, bình luận, tin): sửa `data/content.json`,
rồi chạy `python3 scripts/build_data.py`. Không sửa tay `js/data.js`.

**Sửa giao diện**: sửa SCSS rồi build lại CSS
(`npx sass --no-source-map scss/style.scss css/style.css`), tăng số `?v=` trong các file HTML.
