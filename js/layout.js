/**
 * Khung chung cho mọi trang: header, sidebar, thanh tab mobile, footer, mini player, giỏ hàng.
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
    var AVATAR_COLORS = ["#0b6bcb", "#e8590c", "#2b8a3e", "#ae3ec9", "#1098ad", "#d6336c", "#5f3dc4", "#f08c00"];
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
        sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
        film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
        tv: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="m8 2 4 4 4-4"/>',
        news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
        plane: '<path d="M10.5 21 12 18l1.5 3M12 18V4a1.5 1.5 0 0 0-3 0v5L3 13v2l6-2v5"/><path d="M12 4a1.5 1.5 0 0 1 3 0v5l6 4v2l-6-2"/>',
        store: '<path d="M4 9h16l-1-5H5z"/><path d="M5 9v11h14V9"/><path d="M10 20v-6h4v6"/>',
        phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1"/>',
        bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
        cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h12L22 7H6"/>',
        upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
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
        verified: '<path d="m12 2 2.4 2 3.1-.3.9 3 2.6 1.8-1 3 1 3-2.6 1.8-.9 3-3.1-.3L12 22l-2.4-2-3.1.3-.9-3L3 15.5l1-3-1-3 2.6-1.8.9-3 3.1.3z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'
    };

    function icon(name, cls) {
        return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICON_PATHS[name] || "") + "</svg>";
    }

    /* ---------------- Header ---------------- */

    function renderHeader() {
        var q = param("q") || "";
        return '<div class="header__left">' +
                '<button class="icon-btn header__toggle" type="button" aria-label="Mở menu" data-action="toggle-sidebar">' + icon("menu") + "</button>" +
                '<a class="logo" href="index.html">' +
                    '<span class="logo__mark">' + icon("plane") + "</span>" +
                    '<span class="logo__text">SKYLINE</span>' +
                "</a>" +
            "</div>" +
            '<form class="search" action="tim-kiem.html" role="search">' +
                '<input class="search__input" type="search" name="q" value="' + esc(q) + '" placeholder="Tìm phim, podcast, sản phẩm, kênh…" aria-label="Tìm kiếm">' +
                '<button class="search__btn" type="submit" aria-label="Tìm">' + icon("search") + "</button>" +
            "</form>" +
            '<div class="header__right">' +
                '<a class="icon-btn header__search-mobile" href="tim-kiem.html" aria-label="Tìm kiếm">' + icon("search") + "</a>" +
                '<a class="btn btn--ghost header__sell" href="kenh.html?id=dac-san-3-mien&tab=shop">' + icon("upload") + "<span>Đăng bán</span></a>" +
                '<div class="lang"><a class="active" href="#">VN</a><a href="#">EN</a></div>' +
                '<button class="icon-btn" type="button" aria-label="Thông báo">' + icon("bell") + '<span class="dot"></span></button>' +
                '<a class="icon-btn" href="san-pham.html?id=p01#cart" aria-label="Giỏ hàng">' + icon("cart") + '<span class="badge" data-cart-count hidden>0</span></a>' +
                '<a class="btn btn--primary header__login" href="#">' + icon("user") + "<span>Đăng nhập</span></a>" +
            "</div>";
    }

    /* ---------------- Sidebar ---------------- */

    var NAV = [
        { items: [
            { key: "home", label: "Trang chủ", icon: "home", href: "index.html" },
            { key: "line-up", label: "Line-up mới", icon: "sparkle", href: "line-up-moi.html" }
        ] },
        { title: "Chuyên mục", items: [
            { key: "cat-xem", label: "Xem", icon: "play", href: "chuyen-muc.html?c=xem" },
            { key: "cat-nghe", label: "Nghe", icon: "headphones", href: "chuyen-muc.html?c=nghe" },
            { key: "cat-mua-sam", label: "Mua sắm", icon: "bag", href: "chuyen-muc.html?c=mua-sam" }
        ] },
        { title: "Khám phá", full: true, items: [
            { key: "f-pnn", label: "Phim nước ngoài", icon: "film", href: "chuyen-muc.html?c=xem&f=Phim%20n%C6%B0%E1%BB%9Bc%20ngo%C3%A0i" },
            { key: "f-snn", label: "Series nước ngoài", icon: "tv", href: "chuyen-muc.html?c=xem&f=Series%20n%C6%B0%E1%BB%9Bc%20ngo%C3%A0i" },
            { key: "f-pv", label: "Phim Việt", icon: "film", href: "chuyen-muc.html?c=xem&f=Phim%20Vi%E1%BB%87t" },
            { key: "f-sv", label: "Series Việt", icon: "tv", href: "chuyen-muc.html?c=xem&f=Series%20Vi%E1%BB%87t" }
        ] },
        { title: "Kênh nổi bật", full: true, channels: true },
        { items: [
            { key: "news", label: "Tin tức", icon: "news", href: "tin-tuc.html" },
            { key: "business", label: "Kênh doanh nghiệp", icon: "store", href: "kenh.html?id=duty-free-sg" },
            { key: "contact", label: "Liên hệ", icon: "phone", href: "lien-he.html" }
        ] }
    ];

    // Mục đang mở: theo data-page, riêng chuyên mục theo ?c= và bộ lọc ?f=
    function activeKey() {
        var page = document.body.getAttribute("data-page");
        if (page === "category") {
            var f = param("f");
            if (f) {
                for (var i = 0; i < NAV[2].items.length; i++) {
                    if (NAV[2].items[i].href.indexOf(encodeURIComponent(f)) > -1) return NAV[2].items[i].key;
                }
            }
            return "cat-" + (param("c") || "xem");
        }
        return page;
    }

    function renderSidebar() {
        var active = activeKey();
        return NAV.map(function (group) {
            var items;
            if (group.channels) {
                items = D.channels.slice(0, 5).map(function (c) {
                    return '<a class="nav-item nav-item--channel' + (active === "channel" && param("id") === c.id ? " active" : "") + '" href="' + link("channel", c.id) + '">' +
                        avatar(c.name, "xs") + '<span class="nav-item__label">' + esc(c.name) + "</span></a>";
                }).join("");
            } else {
                items = group.items.map(function (it) {
                    return '<a class="nav-item' + (it.key === active ? " active" : "") + '" href="' + it.href + '">' +
                        icon(it.icon) + '<span class="nav-item__label">' + esc(it.label) + "</span></a>";
                }).join("");
            }
            return '<div class="nav-group' + (group.full ? " nav-group--full" : "") + '">' +
                (group.title ? '<div class="nav-group__title">' + esc(group.title) + "</div>" : "") + items + "</div>";
        }).join("") +
        '<div class="sidebar__foot nav-group--full">© 2026 Skyline Media<br>Mockup giao diện SKYLINE</div>';
    }

    // Thanh tab dưới cùng trên mobile (kiểu app)
    function renderTabbar() {
        var active = activeKey();
        var tabs = [
            { key: "home", label: "Trang chủ", icon: "home", href: "index.html" },
            { key: "cat-xem", label: "Xem", icon: "play", href: "chuyen-muc.html?c=xem" },
            { key: "cat-nghe", label: "Nghe", icon: "headphones", href: "chuyen-muc.html?c=nghe" },
            { key: "cat-mua-sam", label: "Mua sắm", icon: "bag", href: "chuyen-muc.html?c=mua-sam" },
            { key: "line-up", label: "Mới", icon: "sparkle", href: "line-up-moi.html" }
        ];
        return tabs.map(function (t) {
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
                    D.categories.map(function (c) { return '<a href="' + link("category", c.id) + '">' + esc(c.name) + "</a>"; }).join("") +
                    '<a href="line-up-moi.html">Line-up mới</a><a href="tin-tuc.html">Tin tức</a>' +
                "</div>" +
                '<div class="footer__col"><h4>Doanh nghiệp</h4>' +
                    '<a href="kenh.html?id=duty-free-sg">Mở gian hàng</a><a href="bai-viet.html?id=n06">Hướng dẫn đăng bán</a><a href="lien-he.html">Quảng cáo trên chuyến bay</a>' +
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

    function init() {
        document.getElementById("site-header").innerHTML = renderHeader();
        document.getElementById("sidebar").innerHTML = renderSidebar();
        document.getElementById("site-footer").innerHTML = renderFooter();

        var tabbar = document.createElement("nav");
        tabbar.className = "tabbar";
        tabbar.innerHTML = renderTabbar();
        document.body.appendChild(tabbar);

        var backdrop = document.createElement("div");
        backdrop.className = "sidebar-backdrop";
        backdrop.setAttribute("data-action", "close-sidebar");
        document.body.appendChild(backdrop);

        var bar = document.createElement("div");
        bar.id = "mini-player";
        bar.className = "mini-player";
        bar.hidden = true;
        document.body.appendChild(bar);

        var t = document.createElement("div");
        t.id = "toast";
        t.className = "toast";
        t.setAttribute("role", "status");
        document.body.appendChild(t);

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
        toast: toast
    };

    init();
})();
