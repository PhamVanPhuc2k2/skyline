/**
 * Khung chung cho mọi trang: header, menu ngang (chuyên mục), menu dọc, thanh tab mobile,
 * footer, mini player, giỏ hàng.
 * Mỗi trang HTML chỉ cần các ô trống #site-header, #sidebar, #page, #site-footer và
 * <body data-page="...">; layout.js vẽ khung, main.js vẽ nội dung trang.
 */
(function () {
    var D = window.DATA;

    /* ---------------- Helper dùng chung (main.js dùng qua window.SL) ---------------- */

    function esc(str) {
        return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // 1840000 -> "1,8 Tr"; 54200 -> "54,2 N"
    function compact(n) {
        if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".", ",").replace(",0", "") + " Tr";
        if (n >= 1e3) return (n / 1e3).toFixed(1).replace(".", ",").replace(",0", "") + " N";
        return String(n);
    }

    function price(n) {
        return n.toLocaleString("vi-VN") + "₫";
    }

    // Ảnh minh họa cho mockup (picsum, cố định theo seed). Có ảnh thật thì thay ở đây.
    function img(seed, w, h) {
        return "https://picsum.photos/seed/skyline-" + encodeURIComponent(seed) + "/" + w + "/" + h;
    }

    function byId(list, id) {
        for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
        return null;
    }

    function initials(name) {
        var parts = name.split(" ").filter(Boolean);
        return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name[0]).toUpperCase();
    }

    // Màu avatar cố định theo tên (không cần ảnh đại diện thật)
    var AVATAR_COLORS = ["#3b82f6", "#6366f1", "#0ea5e9", "#14b8a6", "#f97316", "#ec4899", "#8b5cf6", "#10b981"];
    function avatar(name, size) {
        var sum = 0;
        for (var i = 0; i < name.length; i++) sum += name.charCodeAt(i);
        return '<span class="avatar' + (size ? " avatar--" + size : "") + '" style="background:' + AVATAR_COLORS[sum % AVATAR_COLORS.length] + '">' + esc(initials(name)) + "</span>";
    }

    function param(name) {
        return new URLSearchParams(location.search).get(name);
    }

    function link(type, id) {
        return {
            media: "xem.html?id=",
            product: "san-pham.html?id=",
            channel: "kenh.html?id=",
            category: "chuyen-muc.html?c=",
            news: "bai-viet.html?id="
        }[type] + encodeURIComponent(id);
    }

    /* ---------------- Icon (SVG nét, 24x24) ---------------- */

    var ICON_PATHS = {
        menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
        play: '<path d="M7 4v16l13-8z"/>',
        pause: '<path d="M7 4h4v16H7zM13 4h4v16h-4z"/>',
        headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
        bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
        sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
        film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
        news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
        plane: '<path d="M10.5 21 12 18l1.5 3M12 18V4a1.5 1.5 0 0 0-3 0v5L3 13v2l6-2v5"/><path d="M12 4a1.5 1.5 0 0 1 3 0v5l6 4v2l-6-2"/>',
        store: '<path d="M4 9h16l-1-5H5z"/><path d="M5 9v11h14V9"/><path d="M10 20v-6h4v6"/>',
        phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1"/>',
        bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
        cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h12L22 7H6"/>',
        upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        like: '<path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 20H7"/>',
        comment: '<path d="M4 5h16v11H9l-5 4z"/>',
        share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/>',
        save: '<path d="M6 3h12v18l-6-4-6 4z"/>',
        star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.9 1-6.2L3 9.7l6.2-.9z"/>',
        check: '<path d="m5 12 5 5 9-10"/>',
        close: '<path d="M6 6l12 12M18 6 6 18"/>',
        next: '<path d="M6 4v16l10-8zM18 4v16"/>',
        prev: '<path d="M18 4v16L8 12zM6 4v16"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        fire: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
        map: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
        chevron: '<path d="m9 6 6 6-6 6"/>',
        caret: '<path d="m7 10 5 5 5-5"/>',
        verified: '<path d="m12 2 2.4 2 3.1-.3.9 3 2.6 1.8-1 3 1 3-2.6 1.8-.9 3-3.1-.3L12 22l-2.4-2-3.1.3-.9-3L3 15.5l1-3-1-3 2.6-1.8.9-3 3.1.3z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
        briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
        radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 19 5"/><circle cx="12" cy="12" r="1"/>',
        chat: '<path d="M4 5h16v10H10l-4 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
        ticket: '<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 0 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
        wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
        cloud: '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
        rain: '<path d="M7 15a4 4 0 0 1-.5-8A6 6 0 0 1 18 6a4.5 4.5 0 0 1-.5 9z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
        luggage: '<rect x="6" y="7" width="12" height="13" rx="2"/><path d="M9 7V4h6v3M9 11v6M15 11v6M8 20v1M16 20v1"/>',
        library: '<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/><path d="m9 11 5 3-5 3z"/>',
        compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
        poll: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
        edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
        seat: '<path d="M6 4v9a2 2 0 0 0 2 2h8l2 5M8 15l-2 5M18 11h-6"/>',
        gate: '<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 21v-6h6v6"/>',
        crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
        logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
        settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/>'
    };

    function icon(name, cls) {
        return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICON_PATHS[name] || "") + "</svg>";
    }

    /* ---------------- Menu ngang: 5 chuyên mục + tiểu mục ---------------- */

    function sub(label, href, desc) {
        return { label: label, href: href, desc: desc };
    }
    function q(base, key, value) {
        return base + "?" + key + "=" + encodeURIComponent(value);
    }

    var TOPNAV = [
        { key: "tien-ich", label: "Tiện ích", icon: "radar", href: "tien-ich.html", subs: [
            sub("Ra tàu bay", "tien-ich.html?tab=ra-tau-bay", "Check-in, giờ lên tàu, hành lý"),
            sub("Flightradar", "tien-ich.html?tab=flightradar", "Theo dõi chuyến bay trực tiếp"),
            sub("Thời tiết điểm đến", "tien-ich.html?tab=thoi-tiet", "Dự báo tại sân bay đến"),
            sub("Wi-Fi trên máy bay", "tien-ich.html?tab=wifi", "Gói kết nối theo chặng bay"),
            sub("Phòng chờ & fast-track", "tien-ich.html?tab=phong-cho", "Đặt trước dịch vụ sân bay")
        ] },
        { key: "tin-tuc", label: "Tin tức", icon: "news", href: "tin-tuc.html", subs: [
            sub("Khám phá", q("tin-tuc.html", "f", "Khám phá"), "Điểm đến, sân bay, văn hóa"),
            sub("Sự kiện", q("tin-tuc.html", "f", "Sự kiện"), "Tin hoạt động SKYLINE"),
            sub("Mẹo bay", q("tin-tuc.html", "f", "Mẹo bay"), "Bay thông minh, thoải mái"),
            sub("Line-up phim", q("tin-tuc.html", "f", "Line-up phim"), "Phim mới trên chuyến bay")
        ] },
        { key: "kinh-doanh", label: "Kinh doanh", icon: "briefcase", href: "chuyen-muc.html?c=kinh-doanh", subs: [
            sub("Vé bay", "chuyen-muc.html?c=kinh-doanh&f=" + encodeURIComponent("Vé bay"), "Giá tốt cho chặng tiếp theo"),
            sub("Miễn thuế", "chuyen-muc.html?c=kinh-doanh&f=" + encodeURIComponent("Miễn thuế"), "Nhận tại cửa ra máy bay"),
            sub("Mua sắm", "chuyen-muc.html?c=kinh-doanh&f=" + encodeURIComponent("Mua sắm"), "Đồ du lịch, quà tặng"),
            sub("Đặc sản", "chuyen-muc.html?c=kinh-doanh&f=" + encodeURIComponent("Đặc sản"), "Quà vùng miền chính gốc"),
            sub("Dịch vụ sân bay", "chuyen-muc.html?c=kinh-doanh&f=" + encodeURIComponent("Dịch vụ sân bay"), "Phòng chờ, fast-track, đưa đón")
        ] },
        { key: "y-kien", label: "Ý kiến", icon: "chat", href: "y-kien.html", subs: [
            sub("Trải nghiệm", "y-kien.html?tab=trai-nghiem", "Chia sẻ chuyến bay của bạn"),
            sub("Khảo sát", "y-kien.html?tab=khao-sat", "Bình chọn, xem kết quả"),
            sub("Góp ý", "y-kien.html?tab=gop-y", "Gửi phản hồi cho SKYLINE")
        ] },
        { key: "tour-bay", label: "Tour bay", icon: "globe", href: "chuyen-muc.html?c=tour-bay", subs: [
            sub("Trong nước", "chuyen-muc.html?c=tour-bay&f=" + encodeURIComponent("Trong nước"), "Phú Quốc, Đà Lạt, Phong Nha…"),
            sub("Quốc tế", "chuyen-muc.html?c=tour-bay&f=" + encodeURIComponent("Quốc tế"), "Nhật Bản, Hàn Quốc…"),
            sub("Combo bay + khách sạn", "chuyen-muc.html?c=tour-bay&f=" + encodeURIComponent("Combo bay + khách sạn"), "Trọn gói, tự do lịch trình")
        ] }
    ];

    // Menu dọc (kiểu YouTube)
    var SIDENAV = [
        { key: "home", label: "Home", icon: "home", href: "index.html" },
        { key: "xem", label: "Xem", icon: "play", href: "chuyen-muc.html?c=xem" },
        { key: "nghe", label: "Nghe", icon: "headphones", href: "chuyen-muc.html?c=nghe" },
        { key: "moi-tai", label: "Mới tải", icon: "sparkle", href: "moi-tai.html" },
        { key: "ban", label: "Bạn", icon: "user", href: "ban.html" },
        { key: "suu-tap", label: "Sưu tập", icon: "library", href: "suu-tap.html" }
    ];

    // Mục đang mở trên 2 menu, theo data-page và tham số URL
    function activeKeys() {
        var page = document.body.getAttribute("data-page");
        var c = param("c");
        var side = { home: "home", "new": "moi-tai", me: "ban", collection: "suu-tap" }[page] || "";
        var top = { utility: "tien-ich", news: "tin-tuc", article: "tin-tuc", opinion: "y-kien" }[page] || "";
        if (page === "category") {
            if (c === "xem" || c === "nghe" || !c) side = c || "xem";
            else top = c;
        }
        if (page === "watch") {
            var m = byId(D.media, param("id"));
            if (m) side = m.cat;
        }
        if (page === "product") {
            var p = byId(D.products, param("id"));
            if (p) top = p.section;
        }
        return { side: side, top: top };
    }

    /* ---------------- Header ---------------- */

    function renderHeader() {
        var me = D.me;
        return '<div class="header__left">' +
                '<button class="icon-btn header__toggle" type="button" aria-label="Mở menu" data-action="toggle-sidebar">' + icon("menu") + "</button>" +
                '<a class="logo" href="index.html">' +
                    '<span class="logo__mark">' + icon("plane") + "</span>" +
                    '<span class="logo__text">SKYLINE</span>' +
                "</a>" +
            "</div>" +
            '<form class="search" action="tim-kiem.html" role="search">' +
                '<input class="search__input" type="search" name="q" value="' + esc(param("q") || "") + '" placeholder="Tìm phim, podcast, vé bay, tour, kênh…" aria-label="Tìm kiếm">' +
                '<button class="search__btn" type="submit" aria-label="Tìm">' + icon("search") + "</button>" +
            "</form>" +
            '<div class="header__right">' +
                '<a class="icon-btn header__search-mobile" href="tim-kiem.html" aria-label="Tìm kiếm">' + icon("search") + "</a>" +
                '<a class="btn btn--ghost header__sell" href="kenh.html?id=dac-san-3-mien&tab=shop">' + icon("upload") + "<span>Đăng bán</span></a>" +
                '<div class="lang"><a class="active" href="#">VN</a><a href="#">EN</a></div>' +
                '<button class="icon-btn" type="button" aria-label="Thông báo">' + icon("bell") + '<span class="dot"></span></button>' +
                '<a class="icon-btn" href="ban.html#orders" aria-label="Giỏ hàng">' + icon("cart") + '<span class="badge" data-cart-count hidden>0</span></a>' +
                '<a class="header__me" href="ban.html" aria-label="Trang của bạn">' + avatar(me.name, "sm") + "</a>" +
            "</div>";
    }

    function renderTopnav(active) {
        return '<div class="topnav__track">' + TOPNAV.map(function (t) {
            return '<div class="topnav__item' + (t.key === active ? " active" : "") + '">' +
                '<a class="topnav__link" href="' + t.href + '">' + icon(t.icon) + "<span>" + t.label + "</span>" + icon("caret", "topnav__caret") + "</a>" +
                '<div class="topnav__menu">' + t.subs.map(function (s) {
                    return '<a href="' + s.href + '"><strong>' + esc(s.label) + "</strong><small>" + esc(s.desc) + "</small></a>";
                }).join("") + "</div>" +
            "</div>";
        }).join("") + "</div>";
    }

    /* ---------------- Sidebar ---------------- */

    function renderSidebar(active) {
        var following = D.me.following.map(function (id) { return byId(D.channels, id); });
        return '<div class="nav-group">' + SIDENAV.map(function (it) {
                return '<a class="nav-item' + (it.key === active ? " active" : "") + '" href="' + it.href + '">' +
                    icon(it.icon) + '<span class="nav-item__label">' + esc(it.label) + "</span></a>";
            }).join("") + "</div>" +
            '<div class="nav-group nav-group--full"><div class="nav-group__title">Kênh đang theo dõi</div>' +
                following.map(function (c) {
                    return '<a class="nav-item nav-item--channel" href="' + link("channel", c.id) + '">' + avatar(c.name, "xs") + '<span class="nav-item__label">' + esc(c.name) + "</span></a>";
                }).join("") +
            "</div>" +
            '<div class="nav-group nav-group--full"><div class="nav-group__title">Chuyên mục</div>' +
                TOPNAV.map(function (t) {
                    return '<a class="nav-item" href="' + t.href + '">' + icon(t.icon) + '<span class="nav-item__label">' + t.label + "</span></a>";
                }).join("") +
            "</div>" +
            '<div class="nav-group nav-group--full">' +
                '<a class="nav-item" href="kenh.html?id=duty-free-sg">' + icon("store") + '<span class="nav-item__label">Kênh doanh nghiệp</span></a>' +
                '<a class="nav-item" href="lien-he.html">' + icon("phone") + '<span class="nav-item__label">Liên hệ</span></a>' +
            "</div>" +
            '<div class="sidebar__foot nav-group--full">© 2026 Skyline Media<br>Mockup giao diện SKYLINE</div>';
    }

    // Thanh tab dưới cùng trên mobile (kiểu app): 5 mục đầu của menu dọc
    function renderTabbar(active) {
        return SIDENAV.slice(0, 5).map(function (t) {
            return '<a class="tabbar__item' + (t.key === active ? " active" : "") + '" href="' + t.href + '">' + icon(t.icon) + "<span>" + t.label + "</span></a>";
        }).join("");
    }

    /* ---------------- Footer ---------------- */

    function renderFooter() {
        var s = D.site;
        return '<div class="footer__grid">' +
                '<div class="footer__brand">' +
                    '<a class="logo" href="index.html"><span class="logo__mark">' + icon("plane") + '</span><span class="logo__text">SKYLINE</span></a>' +
                    "<p>" + esc(s.tagline) + ". Vận hành bởi " + esc(s.company) + ".</p>" +
                "</div>" +
                '<div class="footer__col"><h4>Chuyên mục</h4>' +
                    TOPNAV.map(function (t) { return '<a href="' + t.href + '">' + t.label + "</a>"; }).join("") +
                "</div>" +
                '<div class="footer__col"><h4>Giải trí</h4>' +
                    SIDENAV.slice(1, 4).map(function (t) { return '<a href="' + t.href + '">' + t.label + "</a>"; }).join("") +
                    '<a href="kenh.html?id=duty-free-sg">Mở gian hàng</a><a href="bai-viet.html?id=n07">Hướng dẫn đăng bán</a>' +
                "</div>" +
                '<div class="footer__col footer__contact"><h4>Liên hệ</h4>' +
                    "<p>" + icon("map") + esc(s.address) + "</p>" +
                    '<p><a href="tel:+842839333249">' + icon("phone") + esc(s.phone) + "</a></p>" +
                    '<p><a href="mailto:' + esc(s.email) + '">' + icon("mail") + esc(s.email) + "</a></p>" +
                "</div>" +
            "</div>" +
            '<div class="footer__bottom">@2026 SKYLINE MEDIA. All rights reserved.</div>';
    }

    /* ---------------- Mini player (giữ bài đang nghe khi chuyển trang) ---------------- */

    var PLAYER_KEY = "skyline-now-playing";

    function storage(get, value) {
        try {
            if (get) return sessionStorage.getItem(PLAYER_KEY);
            if (value) sessionStorage.setItem(PLAYER_KEY, value); else sessionStorage.removeItem(PLAYER_KEY);
        } catch (e) {}
        return null;
    }

    function play(id) {
        var m = byId(D.media, id);
        if (!m) return;
        storage(false, id);
        var bar = document.getElementById("mini-player");
        var ch = byId(D.channels, m.channel);
        bar.innerHTML =
            '<a class="mini-player__info" href="' + link("media", m.id) + '">' +
                '<img src="' + img(m.id, 120, 120) + '" alt="">' +
                '<span><strong>' + esc(m.title) + "</strong><small>" + esc(ch.name) + "</small></span>" +
            "</a>" +
            '<div class="mini-player__controls">' +
                '<button class="icon-btn" type="button" aria-label="Bài trước">' + icon("prev") + "</button>" +
                '<button class="icon-btn icon-btn--primary" type="button" data-action="toggle-play" aria-label="Tạm dừng">' + icon("pause") + "</button>" +
                '<button class="icon-btn" type="button" aria-label="Bài sau">' + icon("next") + "</button>" +
            "</div>" +
            '<div class="mini-player__progress"><span></span></div>' +
            '<span class="mini-player__time">' + esc(m.duration) + "</span>" +
            '<button class="icon-btn" type="button" data-action="close-player" aria-label="Đóng">' + icon("close") + "</button>";
        bar.hidden = false;
        bar.classList.add("is-playing");
        document.body.classList.add("has-player");
    }

    /* ---------------- Giỏ hàng (đếm số, lưu trên trình duyệt) ---------------- */

    var CART_KEY = "skyline-cart";

    function cartCount(add) {
        var n = 0;
        try { n = parseInt(localStorage.getItem(CART_KEY), 10) || 0; } catch (e) {}
        if (add) {
            n += add;
            try { localStorage.setItem(CART_KEY, n); } catch (e) {}
        }
        document.querySelectorAll("[data-cart-count]").forEach(function (el) {
            el.textContent = n;
            el.hidden = n === 0;
        });
    }

    function toast(msg) {
        var el = document.getElementById("toast");
        el.innerHTML = icon("check") + "<span>" + esc(msg) + "</span>";
        el.classList.add("show");
        clearTimeout(toast.timer);
        toast.timer = setTimeout(function () { el.classList.remove("show"); }, 2200);
    }

    /* ---------------- Sự kiện chung ---------------- */

    function bindEvents() {
        document.addEventListener("click", function (e) {
            var el = e.target.closest("[data-action], [data-play], [data-cart], [data-follow]");
            if (!el) return;

            if (el.hasAttribute("data-play")) {
                e.preventDefault();
                play(el.getAttribute("data-play"));
                return;
            }
            if (el.hasAttribute("data-cart")) {
                e.preventDefault();
                var p = byId(D.products, el.getAttribute("data-cart"));
                cartCount(1);
                toast("Đã thêm “" + (p ? p.name : "sản phẩm") + "” vào giỏ");
                return;
            }
            if (el.hasAttribute("data-follow")) {
                e.preventDefault();
                var on = el.classList.toggle("is-on");
                el.textContent = on ? "Đang theo dõi" : "Theo dõi";
                return;
            }

            var action = el.getAttribute("data-action");
            if (action === "toggle-sidebar") {
                // Màn rộng: thu gọn/mở rộng tại chỗ. ≤1280px (cùng mốc $bp-xl): mở dạng ngăn kéo
                document.body.classList.toggle(window.innerWidth <= 1280 ? "sidebar-open" : "sidebar-mini");
            } else if (action === "close-sidebar") {
                document.body.classList.remove("sidebar-open");
            } else if (action === "toggle-play") {
                var bar = document.getElementById("mini-player");
                var playing = bar.classList.toggle("is-playing");
                el.innerHTML = icon(playing ? "pause" : "play");
            } else if (action === "close-player") {
                storage(false, null);
                document.getElementById("mini-player").hidden = true;
                document.body.classList.remove("has-player");
            }
        });
    }

    function append(tag, cls, html) {
        var el = document.createElement(tag);
        el.className = cls;
        if (html) el.innerHTML = html;
        document.body.appendChild(el);
        return el;
    }

    function init() {
        var active = activeKeys();
        var header = document.getElementById("site-header");
        header.innerHTML = renderHeader();

        var topnav = document.createElement("nav");
        topnav.className = "topnav";
        topnav.setAttribute("aria-label", "Chuyên mục");
        topnav.innerHTML = renderTopnav(active.top);
        header.parentNode.insertBefore(topnav, header.nextSibling);

        document.getElementById("sidebar").innerHTML = renderSidebar(active.side);
        document.getElementById("site-footer").innerHTML = renderFooter();

        append("nav", "tabbar", renderTabbar(active.side));
        append("div", "sidebar-backdrop").setAttribute("data-action", "close-sidebar");
        append("div", "mini-player").id = "mini-player";
        document.getElementById("mini-player").hidden = true;
        var t = append("div", "toast");
        t.id = "toast";
        t.setAttribute("role", "status");

        bindEvents();
        cartCount(0);
        var playing = storage(true);
        if (playing) play(playing);
    }

    window.SL = {
        data: D,
        esc: esc,
        compact: compact,
        price: price,
        img: img,
        byId: byId,
        avatar: avatar,
        param: param,
        link: link,
        icon: icon,
        toast: toast,
        play: play
    };

    init();
})();
