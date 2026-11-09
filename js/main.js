/**
 * Nội dung từng trang, chọn theo <body data-page="...">.
 * Dữ liệu: window.DATA (js/data.js). Helper & icon: window.SL (js/layout.js).
 */
(function () {
    var SL = window.SL;
    var D = SL.data;
    var esc = SL.esc, icon = SL.icon, img = SL.img, link = SL.link, byId = SL.byId, avatar = SL.avatar;
    var page = document.getElementById("page");

    /* ================= Thành phần dùng chung ================= */

    function channelOf(item) {
        return byId(D.channels, item.channel);
    }

    function meta(m) {
        return esc(channelOf(m).name) + " · " + SL.compact(m.views) + " lượt " + (m.kind === "audio" ? "nghe" : "xem") + " · " + esc(m.date);
    }

    function verified(c) {
        return c.verified ? '<span class="verified" title="Đã xác minh">' + icon("verified") + "</span>" : "";
    }

    // Biểu tượng logo AIRLIFE đặt trước tiêu đề mỗi chuyên mục / khối nội dung (yêu cầu của khách)
    function brandMark() {
        return '<img class="title-mark" src="./images/brand/airlife-mark.svg" alt="" aria-hidden="true">';
    }

    // Logo + tên chuyên mục: chữ phải đặt trong span để CSS canh chân chữ theo đường chân đuôi máy bay
    function lockup(title) {
        return brandMark() + '<span class="lockup__text">' + title + "</span>";
    }

    function sectionHead(title, href, more) {
        return '<div class="section-head"><h2>' + lockup(title) + "</h2>" +
            (href ? '<a class="section-head__more" href="' + href + '">' + (more || "Xem tất cả") + icon("chevron") + "</a>" : "") + "</div>";
    }

    function pageHead(title, desc) {
        return '<header class="page-head"><img class="page-head__mark" src="./images/brand/airlife-mark.svg" alt="" aria-hidden="true">' +
            "<div><h1>" + esc(title) + "</h1><p>" + esc(desc) + "</p></div></header>";
    }

    // Tít nằm trong ảnh (khách chọn): cùng một kiểu lớp phủ cho mọi thẻ có ảnh, dòng nhỏ phía trên là chuyên mục / tiểu mục
    function caption(kicker, title) {
        return '<span class="caption">' + (kicker ? "<small>" + kicker + "</small>" : "") + "<strong>" + title + "</strong></span>";
    }

    // Thẻ video/audio dạng lưới: video 16:9, audio vuông có nút phát nền.
    // progress (0–1): thanh "đã xem tới đâu" cho mục Tiếp tục xem
    function mediaCard(m, progress) {
        var ch = channelOf(m);
        var audio = m.kind === "audio";
        return '<article class="media-card' + (audio ? " media-card--audio" : "") + '" data-filter="' + esc(m.group + "|" + m.genre + "|" + m.kind) + '">' +
            '<a class="thumb ' + (audio ? "thumb--square" : "thumb--video") + '" href="' + link("media", m.id) + '">' +
                '<img src="' + img(m.id, audio ? 400 : 640, audio ? 400 : 360) + '" alt="" loading="lazy">' +
                '<span class="thumb__time">' + esc(m.duration) + "</span>" +
                (m.products && m.products.length ? '<span class="thumb__tag">' + icon("bag") + m.products.length + " sản phẩm</span>" : "") +
                caption(esc(m.group), esc(m.title)) +
                (typeof progress === "number" ? '<span class="thumb__progress"><span style="width:' + Math.round(progress * 100) + '%"></span></span>' : "") +
            "</a>" +
            (audio ? '<button class="play-fab" type="button" data-play="' + m.id + '" aria-label="Nghe ' + esc(m.title) + '">' + icon("play") + "</button>" : "") +
            '<div class="media-card__body">' +
                '<a href="' + link("channel", ch.id) + '">' + avatar(ch.name, "sm") + "</a>" +
                '<p class="media-card__meta">' + meta(m) + "</p>" +
            "</div>" +
        "</article>";
    }

    // Thẻ ngang nhỏ: ảnh trái, chữ phải (danh sách "Tiếp theo", "Nghe nhiều")
    function mediaRow(m, rank) {
        var audio = m.kind === "audio";
        return '<a class="media-row" href="' + link("media", m.id) + '">' +
            (rank ? '<span class="media-row__rank">' + rank + "</span>" : "") +
            '<span class="thumb ' + (audio ? "thumb--square" : "thumb--video") + '">' +
                '<img src="' + img(m.id, audio ? 160 : 320, audio ? 160 : 180) + '" alt="" loading="lazy">' +
                '<span class="thumb__time">' + esc(m.duration) + "</span>" +
            "</span>" +
            '<span class="media-row__body">' +
                "<strong>" + esc(m.title) + "</strong>" +
                "<small>" + esc(channelOf(m).name) + "</small>" +
                "<small>" + SL.compact(m.views) + " lượt " + (audio ? "nghe" : "xem") + "</small>" +
            "</span>" +
        "</a>";
    }

    // Ô ảnh có chữ đè (cột 3 ô bên trái khối nổi bật)
    function tile(item, type) {
        var isProduct = type === "product";
        var sub = isProduct ? esc(item.cat) + " · " + SL.price(item.price) : esc(item.group) + " · " + esc(item.duration);
        return '<a class="tile" href="' + link(isProduct ? "product" : "media", item.id) + '">' +
            '<img src="' + img(item.id, 480, 270) + '" alt="" loading="lazy">' +
            caption(sub, esc(isProduct ? item.name : item.title)) +
            (isProduct ? "" : '<span class="tile__play">' + icon("play") + "</span>") +
        "</a>";
    }

    function discount(p) {
        return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    }

    function stars(rating) {
        return '<span class="stars">' + icon("star") + rating.toFixed(1).replace(".", ",") + "</span>";
    }

    // Vé bay & tour đặt chỗ, không "thêm vào giỏ" như hàng hóa
    function isBooking(p) {
        return p.cat === "Vé bay" || p.cat === "Tài chính" || p.section === "tour-bay";
    }

    // Nút hành động của thẻ đặt chỗ: vé / tour "Đặt ngay", dịch vụ tài chính "Đăng ký"
    function bookingAction(p) {
        if (p.cat === "Tài chính") return icon("check") + "Đăng ký";
        return icon(p.cat === "Vé bay" ? "ticket" : "globe") + "Đặt ngay";
    }

    function productCard(p) {
        var off = discount(p);
        return '<article class="product-card" data-filter="' + esc(p.cat) + '">' +
            '<a class="thumb thumb--square" href="' + link("product", p.id) + '">' +
                '<img src="' + img(p.id, 400, 400) + '" alt="" loading="lazy">' +
                (off ? '<span class="sale-tag">-' + off + "%</span>" : "") +
                caption(esc(p.cat), esc(p.name)) +
            "</a>" +
            '<div class="product-card__body">' +
                '<div class="price">' + (p.section === "tour-bay" ? "<small>Từ</small>" : "") + "<strong>" + SL.price(p.price) + "</strong>" + (p.oldPrice ? "<del>" + SL.price(p.oldPrice) + "</del>" : "") + "</div>" +
                '<div class="product-card__meta">' + stars(p.rating) + "<span>" + (isBooking(p) ? "Đã đặt " : "Đã bán ") + SL.compact(p.sold) + "</span></div>" +
                (isBooking(p)
                    ? '<a class="btn btn--primary btn--block btn--sm" href="' + link("product", p.id) + '">' + bookingAction(p) + "</a>"
                    : '<button class="btn btn--accent btn--block btn--sm" type="button" data-cart="' + p.id + '">' + icon("cart") + "Thêm vào giỏ</button>") +
            "</div>" +
        "</article>";
    }

    // Tên nội dung mà bình luận nhắm tới (video/audio hoặc sản phẩm)
    function commentTarget(c) {
        var m = byId(D.media, c.media);
        if (m) return { title: m.title, href: link("media", m.id) };
        var p = byId(D.products, c.media);
        return { title: p.name, href: link("product", p.id) };
    }

    function commentItem(c, showTarget) {
        var u = byId(D.users, c.user);
        var t = commentTarget(c);
        return '<li class="comment">' +
            avatar(u.name, "sm") +
            '<div class="comment__body">' +
                '<div class="comment__head"><strong>' + esc(u.name) + "</strong><small>" + esc(c.time) + "</small></div>" +
                '<p class="comment__text">' + esc(c.text) + "</p>" +
                (showTarget ? '<a class="comment__target" href="' + t.href + '">' + icon("comment") + esc(t.title) + "</a>" : "") +
                '<div class="comment__actions">' +
                    '<button type="button">' + icon("like") + SL.compact(c.likes) + "</button>" +
                    '<button type="button">' + icon("comment") + c.replies + " trả lời</button>" +
                "</div>" +
            "</div>" +
        "</li>";
    }

    // Cột "Bình luận nổi bật" có 2 tab Hay / Nhiều (theo bản vẽ)
    function commentPanel(list, title) {
        var hay = list.slice().sort(function (a, b) { return b.likes - a.likes; });
        var nhieu = list.slice().sort(function (a, b) { return b.replies - a.replies; });
        return '<aside class="panel comment-panel">' +
            '<div class="panel__head"><h2>' + lockup(title || "Bình luận") + "</h2>" +
                '<div class="seg" role="tablist">' +
                    '<button class="active" type="button" data-tab="hay">Hay</button>' +
                    '<button type="button" data-tab="nhieu">Nhiều</button>' +
                "</div>" +
            "</div>" +
            '<ul class="comment-list" data-pane="hay">' + hay.map(function (c) { return commentItem(c, true); }).join("") + "</ul>" +
            '<ul class="comment-list" data-pane="nhieu" hidden>' + nhieu.map(function (c) { return commentItem(c, true); }).join("") + "</ul>" +
        "</aside>";
    }

    // Khối nổi bật lớn (ảnh to + chữ đè + nút)
    function hero(item, opts) {
        opts = opts || {};
        var isProduct = opts.product;
        var title = isProduct ? item.name : item.title;
        var kicker = opts.kicker || (isProduct ? item.cat : item.group + " · " + item.genre);
        var href = link(isProduct ? "product" : "media", item.id);
        var actions = isProduct
            ? '<a class="btn btn--primary" href="' + href + '">' + icon(isBooking(item) ? "ticket" : "bag") + (isBooking(item) ? "Đặt ngay · " : "Mua ngay · ") + SL.price(item.price) + "</a>" +
              '<a class="btn btn--glass" href="' + href + '">Chi tiết</a>'
            : item.kind === "audio"
                ? '<button class="btn btn--primary" type="button" data-play="' + item.id + '">' + icon("headphones") + "Nghe ngay</button>" +
                  '<a class="btn btn--glass" href="' + href + '">Chi tiết</a>'
                : '<a class="btn btn--primary" href="' + href + '">' + icon("play") + "Xem ngay</a>" +
                  '<button class="btn btn--glass" type="button">' + icon("save") + "Lưu</button>";
        return '<section class="hero">' +
            '<img class="hero__img" src="' + img(opts.cover || item.id, 1280, 720) + '" alt="">' +
            '<div class="hero__content">' +
                '<span class="pill">' + esc(opts.badge || "Nổi bật") + "</span>" +
                '<p class="hero__kicker">' + esc(kicker) + "</p>" +
                '<h1 class="hero__title">' + esc(title) + "</h1>" +
                '<p class="hero__desc">' + esc(item.desc) + "</p>" +
                '<div class="hero__actions">' + actions + "</div>" +
            "</div>" +
        "</section>";
    }

    // Bố cục đầu trang theo bản vẽ: 3 ô trái | khối lớn giữa | cột bình luận phải; hàng 4 thẻ bên dưới
    function topGrid(o) {
        return '<div class="top-grid">' +
            '<div class="top-grid__stack">' + o.stack + "</div>" +
            '<div class="top-grid__hero">' + o.hero + "</div>" +
            '<div class="top-grid__aside">' + o.aside + "</div>" +
            '<div class="top-grid__row">' + o.row + "</div>" +
        "</div>";
    }

    function chips(list, active, attr) {
        attr = attr || "data-chip";
        return '<div class="chips" role="tablist">' + list.map(function (f) {
            return '<button type="button" class="chip' + (f === active ? " active" : "") + '" ' + attr + '="' + esc(f) + '">' + esc(f) + "</button>";
        }).join("") + "</div>";
    }

    // Tab có nội dung: tabs = [{id, label, count?, html}]
    function tabbed(tabs, current) {
        if (!tabs.some(function (t) { return t.id === current; })) current = tabs[0].id;
        return '<nav class="tabs" role="tablist">' + tabs.map(function (t) {
                return '<button type="button" class="tabs__item' + (t.id === current ? " active" : "") + '" data-tab="' + t.id + '">' +
                    (t.icon ? icon(t.icon) : "") + t.label + (t.count ? " <small>" + t.count + "</small>" : "") + "</button>";
            }).join("") + "</nav>" +
            tabs.map(function (t) {
                return '<div class="tab-pane" data-pane="' + t.id + '"' + (t.id === current ? "" : " hidden") + ">" + t.html + "</div>";
            }).join("");
    }

    function shelf(title, href, items) {
        return '<section class="section">' + sectionHead(title, href) + '<div class="shelf">' + items + "</div></section>";
    }

    function emptyState(text) {
        return '<div class="empty">' + icon("search") + "<p>" + esc(text) + "</p></div>";
    }

    function notFound() {
        page.innerHTML = '<div class="container">' + emptyState("Không tìm thấy nội dung. Có thể đường dẫn đã thay đổi.") +
            '<p class="center"><a class="btn btn--primary" href="index.html">Về trang chủ</a></p></div>';
    }

    function channelCard(c, following) {
        return '<article class="channel-card">' +
            '<a href="' + link("channel", c.id) + '">' + avatar(c.name, "lg") + "</a>" +
            '<h3><a href="' + link("channel", c.id) + '">' + esc(c.name) + "</a>" + verified(c) + "</h3>" +
            "<small>" + esc(c.type) + " · " + SL.compact(c.followers) + " theo dõi</small>" +
            (following
                ? '<button class="btn btn--outline btn--sm is-on" type="button" data-follow>Đang theo dõi</button>'
                : '<button class="btn btn--outline btn--sm" type="button" data-follow>Theo dõi</button>') +
        "</article>";
    }

    function newsCard(n) {
        return '<article class="news-card" data-filter="' + esc(n.cat) + '">' +
            '<a class="thumb thumb--video" href="' + link("news", n.id) + '"><img src="' + img(n.id, 640, 360) + '" alt="" loading="lazy">' +
                caption(esc(n.cat) + " · " + esc(n.date), esc(n.title)) + "</a>" +
            "<p>" + esc(n.excerpt) + "</p>" +
        "</article>";
    }

    function airport(code) {
        return D.airports[code] || { city: code };
    }

    // Thẻ lên máy bay (boarding pass) của chuyến bay sắp tới
    function boardingPass(f) {
        var a = airport(f.from), b = airport(f.to);
        return '<div class="pass">' +
            '<div class="pass__main">' +
                '<div class="pass__top"><img class="pass__logo" src="./images/brand/airlife-logo-no-slogan.svg" alt="AIRLIFE" width="96" height="26"><span class="pill pill--soft">' + esc(f.cabin) + "</span></div>" +
                '<div class="pass__route">' +
                    "<div><strong>" + f.from + "</strong><small>" + esc(a.city) + "</small><b>" + f.dep + "</b></div>" +
                    '<span class="pass__line">' + icon("plane") + "</span>" +
                    "<div><strong>" + f.to + "</strong><small>" + esc(b.city) + "</small><b>" + f.arr + "</b></div>" +
                "</div>" +
                '<div class="pass__info">' +
                    "<div><small>Chuyến bay</small><b>" + esc(f.code) + "</b></div>" +
                    "<div><small>Ngày</small><b>" + esc(f.date) + "</b></div>" +
                    "<div><small>Cửa ra</small><b>" + esc(f.gate) + "</b></div>" +
                    "<div><small>Ghế</small><b>" + esc(f.seat) + "</b></div>" +
                    "<div><small>Lên tàu</small><b>" + esc(f.boarding) + "</b></div>" +
                "</div>" +
            "</div>" +
            '<div class="pass__stub"><span class="pass__qr" aria-hidden="true"></span><small>Quét tại cửa ra</small></div>' +
        "</div>";
    }

    /* ================= Trang chủ ================= */

    function utilityBlock() {
        var live = D.flights.filter(function (f) { return f.status === "Đang bay"; }).slice(0, 3);
        return '<div class="panel utility">' +
            '<div class="panel__head"><h2>' + lockup("Tiện ích") + '</h2><a class="link" href="tien-ich.html">Tất cả</a></div>' +
            '<form class="flight-form" action="tien-ich.html">' +
                '<input type="text" name="q" placeholder="Tìm, giám sát live" aria-label="Tìm chuyến bay, sân bay">' +
                '<button class="btn btn--primary btn--sm" type="submit">Tra cứu</button>' +
            "</form>" +
            '<div class="flight-mini">' + live.map(flightRow).join("") + "</div>" +
            '<div class="utility__grid">' +
                '<a class="utility__item" href="tien-ich.html#thong-tin">' + icon("luggage") + "<span>Thông tin chuyến bay</span></a>" +
                '<a class="utility__item" href="tien-ich.html#giam-sat">' + icon("radar") + "<span>Giám sát chuyến bay</span></a>" +
                '<a class="utility__item" href="tien-ich.html#so-do">' + icon("map") + "<span>Sơ đồ hướng dẫn</span></a>" +
                '<a class="utility__item" href="tien-ich.html#thoi-tiet">' + icon("sun") + "<span>Thời tiết sân bay</span></a>" +
            "</div>" +
        "</div>";
    }

    function renderHome() {
        var videos = D.media.filter(function (m) { return m.kind === "video"; });
        var audios = D.media.filter(function (m) { return m.kind === "audio"; });
        var featured = videos.filter(function (m) { return m.featured; })[0] || videos[0];
        var rest = videos.filter(function (m) { return m !== featured; });
        var topAudio = audios.slice().sort(function (a, b) { return b.views - a.views; });
        var deals = [byId(D.products, "p09"), byId(D.products, "p02"), byId(D.products, "p01")];
        var tours = D.products.filter(function (p) { return p.section === "tour-bay"; });

        page.innerHTML =
            '<div class="container">' +
                topGrid({
                    stack: rest.slice(0, 3).map(function (m) { return tile(m); }).join(""),
                    hero: hero(featured),
                    aside: commentPanel(D.comments),
                    row: rest.slice(3, 7).map(function (m) { return mediaCard(m); }).join("")
                }) +

                // Hàng dưới cùng theo bản vẽ: 3 khối rộng hẹp khác nhau
                '<div class="bottom-grid">' +
                    '<div class="panel">' +
                        '<div class="panel__head"><h2>' + lockup("Nghe") + '</h2><a class="link" href="chuyen-muc.html?c=nghe">Tất cả</a></div>' +
                        '<div class="rank-list">' + topAudio.slice(0, 4).map(function (m, i) { return mediaRow(m, i + 1); }).join("") + "</div>" +
                    "</div>" +
                    '<div class="panel">' +
                        '<div class="panel__head"><h2>' + lockup("Kinh doanh") + '</h2><a class="link" href="chuyen-muc.html?c=kinh-doanh">Xem tất cả</a></div>' +
                        '<div class="product-grid product-grid--3">' + deals.map(productCard).join("") + "</div>" +
                    "</div>" +
                    utilityBlock() +
                "</div>" +

                shelf("Tour bay", "chuyen-muc.html?c=tour-bay", tours.map(productCard).join("")) +
                shelf("Mới tải", "moi-tai.html", D.media.slice().reverse().slice(0, 8).map(function (m) { return mediaCard(m); }).join("")) +

                '<div class="split">' +
                    '<section class="section">' + sectionHead("Tin tức", "tin-tuc.html") +
                        '<div class="news-grid news-grid--2">' + D.news.slice(0, 2).map(newsCard).join("") + "</div>" +
                    "</section>" +
                    '<section class="section">' + sectionHead("Ý kiến", "y-kien.html?tab=khao-sat", "Tham gia") +
                        surveyCard(D.surveys[0]) +
                    "</section>" +
                "</div>" +

                '<section class="section">' + sectionHead("Kênh nổi bật") +
                    '<div class="channel-grid">' + D.channels.map(channelCard).join("") + "</div>" +
                "</section>" +
            "</div>";
    }

    /* ================= Chuyên mục (Xem / Nghe / Kinh doanh / Tour bay) ================= */

    function renderCategory() {
        var cat = byId(D.categories, SL.param("c")) || D.categories[0];
        var activeFilter = SL.param("f") || "Tất cả";
        var isShop = cat.id === "kinh-doanh" || cat.id === "tour-bay";
        document.title = cat.name + " | AIRLIFE";

        var top, grid;
        if (isShop) {
            var products = D.products.filter(function (p) { return p.section === cat.id; })
                .sort(function (a, b) { return discount(b) - discount(a); });
            var ids = products.map(function (p) { return p.id; });
            var reviews = D.comments.filter(function (c) { return ids.indexOf(c.media) > -1; });
            top = topGrid({
                stack: products.slice(1, 4).map(function (p) { return tile(p, "product"); }).join(""),
                hero: hero(products[0], { product: true, badge: "Ưu đãi lớn nhất", cover: cat.cover }),
                aside: commentPanel(reviews.concat(D.comments.filter(function (c) { return reviews.indexOf(c) < 0; })).slice(0, 8), "Khách bay nói gì"),
                row: products.slice(4, 8).map(productCard).join("")
            });
            grid = '<div class="product-grid">' + products.map(productCard).join("") + "</div>";
        } else {
            // Sách nói: gom các audio thuộc nhóm Sách nói (vẫn hiện trong mục Nghe)
            var items = D.media.filter(function (m) { return cat.id === "sach-noi" ? m.group === "Sách nói" : m.cat === cat.id; });
            var featured = items.filter(function (m) { return m.featured; })[0] || items[0];
            var rest = items.filter(function (m) { return m !== featured; });
            var mids = items.map(function (m) { return m.id; });
            top = topGrid({
                stack: rest.slice(0, 3).map(function (m) { return tile(m); }).join(""),
                hero: hero(featured, { cover: cat.cover }),
                aside: commentPanel(D.comments.filter(function (c) { return mids.indexOf(c.media) > -1; }).concat(D.comments).slice(0, 8)),
                row: rest.slice(3, 7).map(function (m) { return mediaCard(m); }).join("")
            });
            grid = '<div class="media-grid">' + items.map(function (m) { return mediaCard(m); }).join("") + "</div>";
        }

        page.innerHTML =
            '<div class="container">' +
                pageHead(cat.name, cat.title + ". " + cat.desc) +
                top +
                '<section class="section" id="all">' +
                    sectionHead("Tất cả trong " + esc(cat.name)) +
                    chips(cat.filters, activeFilter) +
                    '<div data-filter-target>' + grid + "</div>" +
                    '<div data-empty hidden>' + emptyState("Chưa có nội dung trong mục này.") + "</div>" +
                "</section>" +
            "</div>";

        applyFilter(activeFilter);
        if (SL.param("f")) document.getElementById("all").scrollIntoView();
    }

    // Lọc thẻ trong lưới theo chip (so với data-filter: các giá trị cách nhau bằng "|")
    function applyFilter(value) {
        var cards = page.querySelectorAll("[data-filter-target] [data-filter]");
        var shown = 0;
        cards.forEach(function (card) {
            var ok = value === "Tất cả" || card.getAttribute("data-filter").split("|").indexOf(value) > -1;
            card.hidden = !ok;
            if (ok) shown++;
        });
        page.querySelectorAll("[data-chip]").forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-chip") === value); });
        var empty = page.querySelector("[data-empty]");
        if (empty) empty.hidden = shown > 0;
    }

    /* ================= Trang xem / nghe ================= */

    function renderWatch() {
        var m = byId(D.media, SL.param("id"));
        if (!m) return notFound();
        var ch = channelOf(m);
        var audio = m.kind === "audio";
        var products = (m.products || []).map(function (id) { return byId(D.products, id); });
        var next = D.media.filter(function (x) { return x.cat === m.cat && x.id !== m.id; });
        var comments = D.comments.filter(function (c) { return c.media === m.id; })
            .concat(D.comments.filter(function (c) { return c.media !== m.id; }).slice(0, 4));
        document.title = m.title + " | AIRLIFE";

        var player = audio
            ? '<div class="audio-player">' +
                '<img class="audio-player__cover" src="' + img(m.id, 480, 480) + '" alt="">' +
                '<div class="audio-player__main">' +
                    '<span class="pill">' + esc(m.group) + "</span>" +
                    "<h2>" + esc(m.title) + "</h2>" +
                    "<p>" + esc(ch.name) + "</p>" +
                    '<div class="wave" aria-hidden="true">' + new Array(49).join("<span></span>") + "</div>" +
                    SL.runway(0, false) +
                    '<div class="audio-player__time"><span>00:00</span><span>' + esc(m.duration) + "</span></div>" +
                    '<div class="audio-player__controls">' +
                        '<button class="icon-btn" type="button" aria-label="Tua lại 10 giây">' + icon("rewind") + "</button>" +
                        '<button class="icon-btn icon-btn--primary icon-btn--lg" type="button" data-play="' + m.id + '" data-audio-play aria-label="Phát">' + icon("play") + "</button>" +
                        '<button class="icon-btn" type="button" aria-label="Tua tới 10 giây">' + icon("forward") + "</button>" +
                        '<span class="audio-player__spacer"></span>' +
                        SL.stateIcon("sound") +
                    "</div>" +
                    '<p class="hint">Bấm phát để nghe trong nền, nhạc vẫn chạy khi bạn chuyển sang trang khác.</p>' +
                "</div>" +
              "</div>"
            : '<div class="video-player">' +
                '<img src="' + img(m.id, 1280, 720) + '" alt="">' +
                '<button class="video-player__play" type="button" data-video-play aria-label="Phát">' + icon("play") + "</button>" +
                '<div class="video-player__bar">' +
                    SL.runway(0, false) +
                    '<div class="video-player__controls">' +
                        '<button class="icon-btn" type="button" data-video-play aria-label="Phát">' + icon("play") + "</button>" +
                        '<button class="icon-btn" type="button" aria-label="Tua lại 10 giây">' + icon("rewind") + "</button>" +
                        '<button class="icon-btn" type="button" aria-label="Tua tới 10 giây">' + icon("forward") + "</button>" +
                        "<small>00:00 / " + esc(m.duration) + "</small>" +
                        '<span class="video-player__spacer"></span>' +
                        SL.stateIcon("screen") +
                    "</div>" +
                "</div>" +
              "</div>";

        page.innerHTML =
            '<div class="container watch">' +
                '<div class="watch__main">' +
                    player +
                    '<h1 class="watch__title">' + esc(m.title) + "</h1>" +
                    '<div class="watch__bar">' +
                        '<div class="owner">' +
                            '<a href="' + link("channel", ch.id) + '">' + avatar(ch.name) + "</a>" +
                            '<div><a class="owner__name" href="' + link("channel", ch.id) + '">' + esc(ch.name) + "</a>" + verified(ch) +
                                "<small>" + SL.compact(ch.followers) + " người theo dõi</small></div>" +
                            '<button class="btn btn--primary btn--sm" type="button" data-follow>Theo dõi</button>' +
                        "</div>" +
                        '<div class="actions">' +
                            '<button class="btn btn--soft btn--sm" type="button">' + icon("like") + SL.compact(Math.round(m.views / 40)) + "</button>" +
                            '<button class="btn btn--soft btn--sm" type="button">' + icon("share") + "Chia sẻ</button>" +
                            '<button class="btn btn--soft btn--sm" type="button">' + icon("save") + "Lưu</button>" +
                        "</div>" +
                    "</div>" +
                    mediaText(m) +

                    (products.length
                        ? '<section class="section section--tight">' + sectionHead("Sản phẩm trong " + (audio ? "tập này" : "video")) +
                            '<div class="product-strip">' + products.map(productMini).join("") + "</div></section>"
                        : "") +

                    '<section class="section section--tight">' + sectionHead(comments.length + " bình luận") +
                        commentForm() +
                        '<ul class="comment-list">' + comments.map(function (c) { return commentItem(c, false); }).join("") + "</ul>" +
                    "</section>" +
                "</div>" +
                '<aside class="watch__side">' +
                    '<h2 class="side-title">Tiếp theo</h2>' +
                    '<div class="next-list">' + next.map(function (x) { return mediaRow(x); }).join("") + "</div>" +
                "</aside>" +
            "</div>";
    }

    // Bản chép lời: lấy trong dữ liệu (data/content.json > transcripts); chưa có thì dựng bản minh hoạ từ mô tả
    function transcriptOf(m) {
        if (D.transcripts && D.transcripts[m.id]) return D.transcripts[m.id];
        var audio = m.kind === "audio";
        return [
            ["00:00", (audio ? "Chào mừng bạn đến với " : "") + m.title + "."],
            ["00:35", m.desc],
            ["02:10", "Nội dung bản chép lời minh hoạ cho mockup: khi triển khai, phần này lấy từ phụ đề hoặc file text đi kèm video/audio."],
            ["05:40", "Người xem có thể đọc theo, bấm vào mốc thời gian để tua đến đoạn tương ứng, hoặc tải về file .txt."]
        ];
    }

    // Phần văn bản đi kèm video/audio, theo kiểu YouTube: số liệu, mô tả, "Thành phần nội dung" > Bản chép lời
    function mediaText(m) {
        var audio = m.kind === "audio";
        var lines = transcriptOf(m);
        return '<section class="media-text">' +
            '<div class="media-text__stats">' +
                "<div><b>" + SL.compact(Math.round(m.views / 40)) + "</b><small>Lượt thích</small></div>" +
                "<div><b>" + SL.compact(m.views) + "</b><small>" + (audio ? "Lượt nghe" : "Lượt xem") + "</small></div>" +
                "<div><b>" + esc(m.date) + "</b><small>Ngày đăng</small></div>" +
            "</div>" +
            '<div class="desc-box"><strong>' + esc(m.title) + " · " + esc(m.group) + (m.genre !== m.group ? " · " + esc(m.genre) : "") + "</strong><p>" + esc(m.desc) + "</p></div>" +
            '<h3 class="media-text__title">Thành phần nội dung</h3>' +
            '<div class="transcript-card">' +
                '<span class="transcript-card__icon">' + icon("news") + "</span>" +
                "<div><strong>Bản chép lời</strong><small>Theo dõi nội dung bằng văn bản" + (audio ? ", không cần tai nghe" : "") + "</small></div>" +
                '<button class="btn btn--soft btn--sm" type="button" data-action="toggle-transcript">Hiện bản chép lời</button>' +
                '<button class="btn btn--outline btn--sm" type="button" data-action="download-transcript" data-id="' + m.id + '">' + icon("upload", "icon--down") + "Tải .txt</button>" +
            "</div>" +
            '<ol class="transcript" hidden>' + lines.map(function (l) {
                return '<li><button type="button" class="transcript__time" data-seek="' + esc(l[0]) + '">' + esc(l[0]) + "</button><p>" + esc(l[1]) + "</p></li>";
            }).join("") + "</ol>" +
        "</section>";
    }

    function productMini(p) {
        return '<div class="product-mini">' +
            '<a href="' + link("product", p.id) + '"><img src="' + img(p.id, 160, 160) + '" alt=""></a>' +
            "<div>" +
                '<a class="product-mini__name" href="' + link("product", p.id) + '">' + esc(p.name) + "</a>" +
                '<div class="price"><strong>' + SL.price(p.price) + "</strong></div>" +
                (isBooking(p)
                    ? '<a class="btn btn--primary btn--sm" href="' + link("product", p.id) + '">' + icon("ticket") + "Đặt</a>"
                    : '<button class="btn btn--accent btn--sm" type="button" data-cart="' + p.id + '">' + icon("cart") + "Thêm</button>") +
            "</div>" +
        "</div>";
    }

    function commentForm() {
        return '<form class="comment-form" onsubmit="return false">' +
            avatar(D.me.name, "sm") +
            '<input type="text" placeholder="Viết bình luận…" aria-label="Viết bình luận">' +
            '<button class="btn btn--primary btn--sm" type="submit">Gửi</button>' +
        "</form>";
    }

    /* ================= Trang sản phẩm / vé / tour ================= */

    function renderProduct() {
        var p = byId(D.products, SL.param("id"));
        if (!p) return notFound();
        var ch = channelOf(p);
        var off = discount(p);
        var cat = byId(D.categories, p.section);
        var booking = isBooking(p);
        var inMedia = D.media.filter(function (m) { return (m.products || []).indexOf(p.id) > -1; });
        var reviews = D.comments.filter(function (c) { return c.media === p.id; }).concat(D.comments.slice(0, 3));
        var related = D.products.filter(function (x) { return x.id !== p.id && x.section === p.section; }).slice(0, 4);
        document.title = p.name + " | AIRLIFE";

        var options = booking
            ? '<div class="field-row">' +
                '<label class="field"><span>' + ({ "Vé bay": "Ngày bay", "Tài chính": "Ngày bắt đầu" }[p.cat] || "Ngày khởi hành") + '</span><input type="date" value="2026-11-14"></label>' +
                '<label class="field"><span>Số khách</span><select><option>1 người lớn</option><option selected>2 người lớn</option><option>2 người lớn, 1 trẻ em</option><option>Gia đình 4 người</option></select></label>' +
              "</div>" +
              '<fieldset class="options"><legend>Hạng dịch vụ</legend>' +
                option("Tiêu chuẩn", "Giá như trên", true) +
                option(p.cat === "Vé bay" ? "Thương gia" : "Cao cấp", p.cat === "Vé bay" ? "Phòng chờ, 40kg hành lý" : "Khách sạn 5 sao, xe riêng") +
              "</fieldset>"
            : '<fieldset class="options"><legend>Nhận hàng</legend>' +
                option("Nhận tại cửa ra máy bay", "Đặt trước 3 giờ khi bay", true) +
                option("Giao tại sân bay đến", "Nhân viên chờ ở sảnh đến") +
                option("Giao tận nhà", "2–3 ngày, miễn phí từ 300.000₫") +
              "</fieldset>" +
              '<div class="qty"><span>Số lượng</span><div class="qty__box"><button type="button" data-qty="-1">−</button><input type="text" value="1" aria-label="Số lượng" data-qty-input><button type="button" data-qty="1">+</button></div></div>';

        page.innerHTML =
            '<div class="container">' +
                '<nav class="breadcrumb"><a href="index.html">Home</a>' + icon("chevron") +
                    '<a href="' + link("category", cat.id) + '">' + esc(cat.name) + "</a>" + icon("chevron") +
                    '<a href="' + link("category", cat.id) + "&f=" + encodeURIComponent(p.cat) + '">' + esc(p.cat) + "</a></nav>" +
                '<div class="product">' +
                    '<div class="gallery">' +
                        '<div class="gallery__main"><img src="' + img(p.id, 800, 800) + '" alt="" data-gallery-main></div>' +
                        '<div class="gallery__thumbs">' + [p.id, p.id + "-2", p.id + "-3", p.id + "-4"].map(function (s, i) {
                            return '<button type="button" class="' + (i ? "" : "active") + '" data-gallery="' + img(s, 800, 800) + '"><img src="' + img(s, 160, 160) + '" alt=""></button>';
                        }).join("") + "</div>" +
                    "</div>" +
                    '<div class="product__info">' +
                        '<span class="pill pill--soft">' + esc(p.cat) + "</span>" +
                        "<h1>" + esc(p.name) + "</h1>" +
                        '<div class="product__stats">' + stars(p.rating) + "<span>" + reviews.length + " đánh giá</span><span>" + (booking ? "Đã đặt " : "Đã bán ") + p.sold.toLocaleString("vi-VN") + "</span></div>" +
                        '<div class="price price--lg">' + (booking ? "<small>" + (p.cat === "Vé bay" ? "Giá/khách" : "Từ") + "</small>" : "") + "<strong>" + SL.price(p.price) + "</strong>" +
                            (p.oldPrice ? "<del>" + SL.price(p.oldPrice) + '</del><span class="sale-tag sale-tag--inline">-' + off + "%</span>" : "") + "</div>" +
                        options +
                        '<div class="product__buy">' +
                            (booking
                                ? '<button class="btn btn--outline btn--lg" type="button">' + icon("save") + "Lưu</button>" +
                                  '<button class="btn btn--primary btn--lg" type="button" data-cart="' + p.id + '">' + bookingAction(p) + "</button>"
                                : '<button class="btn btn--outline btn--lg" type="button" data-cart="' + p.id + '">' + icon("cart") + "Thêm vào giỏ</button>" +
                                  '<button class="btn btn--primary btn--lg" type="button" data-cart="' + p.id + '">Mua ngay</button>') +
                        "</div>" +
                        '<div class="seller">' +
                            '<a href="' + link("channel", ch.id) + '">' + avatar(ch.name) + "</a>" +
                            '<div><a class="owner__name" href="' + link("channel", ch.id) + '">' + esc(ch.name) + "</a>" + verified(ch) + "<small>" + esc(ch.type) + " · " + SL.compact(ch.followers) + " theo dõi</small></div>" +
                            '<a class="btn btn--soft btn--sm" href="' + link("channel", ch.id) + '&tab=shop">Xem gian hàng</a>' +
                        "</div>" +
                    "</div>" +
                "</div>" +

                '<div class="product-detail">' +
                    '<section class="panel">' +
                        "<h2>" + (booking ? "Chi tiết" : "Mô tả sản phẩm") + "</h2><p>" + esc(p.desc) + "</p>" +
                        "<p>" + (booking
                            ? "Đặt bởi " + esc(ch.name) + " trên AIRLIFE. Xác nhận qua email và tin nhắn trong 15 phút; đổi hoặc hủy theo điều kiện của từng hạng dịch vụ."
                            : "Sản phẩm được bán bởi " + esc(ch.name) + " trên AIRLIFE. Đặt hàng ngay trong chuyến bay qua màn hình ghế ngồi hoặc điện thoại kết nối Wi-Fi trên máy bay; thanh toán bằng thẻ, ví điện tử hoặc khi nhận hàng.") + "</p>" +
                        '<h2 class="mt">Đánh giá từ khách bay</h2>' +
                        '<ul class="comment-list">' + reviews.map(function (c) { return commentItem(c, false); }).join("") + "</ul>" +
                    "</section>" +
                    (inMedia.length
                        ? '<aside><h2 class="side-title">Xuất hiện trong</h2><div class="next-list">' + inMedia.map(function (m) { return mediaRow(m); }).join("") + "</div></aside>"
                        : "") +
                "</div>" +

                '<section class="section">' + sectionHead("Có thể bạn cũng thích", link("category", cat.id)) +
                    '<div class="product-grid">' + related.map(productCard).join("") + "</div></section>" +
            "</div>";
    }

    function option(title, sub, checked) {
        return '<label class="option"><input type="radio" name="opt"' + (checked ? " checked" : "") + "><span><strong>" + title + "</strong><small>" + sub + "</small></span></label>";
    }

    /* ================= Trang kênh ================= */

    function renderChannel() {
        var ch = byId(D.channels, SL.param("id"));
        if (!ch) return notFound();
        var media = D.media.filter(function (m) { return m.channel === ch.id; });
        var videos = media.filter(function (m) { return m.kind === "video"; });
        var audios = media.filter(function (m) { return m.kind === "audio"; });
        var products = D.products.filter(function (p) { return p.channel === ch.id; });
        var none = emptyState("Kênh chưa đăng nội dung ở mục này.");
        function grid(list) { return list.length ? '<div class="media-grid">' + list.map(function (m) { return mediaCard(m); }).join("") + "</div>" : none; }
        document.title = ch.name + " | AIRLIFE";

        page.innerHTML =
            '<div class="channel">' +
                '<div class="channel__cover"><img src="' + img(ch.id + "-cover", 1600, 400) + '" alt=""></div>' +
                '<div class="container">' +
                    '<div class="channel__head">' +
                        avatar(ch.name, "xl") +
                        '<div class="channel__info">' +
                            "<h1>" + esc(ch.name) + verified(ch) + "</h1>" +
                            "<p>" + esc(ch.type) + " · " + SL.compact(ch.followers) + " người theo dõi · " + media.length + " nội dung · " + products.length + " sản phẩm</p>" +
                            '<p class="muted">' + esc(ch.desc) + "</p>" +
                        "</div>" +
                        '<div class="channel__actions">' +
                            '<button class="btn btn--primary" type="button" data-follow>Theo dõi</button>' +
                            '<button class="btn btn--soft" type="button">' + icon("comment") + "Nhắn tin</button>" +
                        "</div>" +
                    "</div>" +
                    tabbed([
                        { id: "home", label: "Trang chủ", html: (media.length ? grid(media.slice(0, 8)) : "") +
                            (products.length ? '<section class="section">' + sectionHead("Sản phẩm của kênh") + '<div class="product-grid">' + products.map(productCard).join("") + "</div></section>" : "") || none },
                        { id: "video", label: "Video", count: videos.length, html: grid(videos) },
                        { id: "audio", label: "Nghe", count: audios.length, html: grid(audios) },
                        { id: "shop", label: "Cửa hàng", count: products.length, html: products.length ? '<div class="product-grid">' + products.map(productCard).join("") + "</div>" : none },
                        { id: "about", label: "Giới thiệu", html: '<div class="panel about"><h2>Giới thiệu</h2><p>' + esc(ch.desc) + "</p>" +
                            "<ul><li>" + icon("store") + esc(ch.type) + "</li><li>" + icon("user") + ch.followers.toLocaleString("vi-VN") + " người theo dõi</li><li>" + icon("clock") + "Tham gia 03/2026</li></ul></div>" }
                    ], SL.param("tab")) +
                "</div>" +
            "</div>";
    }

    /* ================= Mới tải ================= */

    function renderNew() {
        // Mockup: coi thứ tự ngược trong dữ liệu là "mới tải lên gần nhất"
        var latest = D.media.slice().reverse();
        function grid(list) { return '<div class="media-grid">' + list.map(function (m) { return mediaCard(m); }).join("") + "</div>"; }
        page.innerHTML =
            '<div class="container">' +
                pageHead("Mới tải", "Video, podcast và phim vừa được cập nhật lên AIRLIFE.") +
                tabbed([
                    { id: "all", label: "Tất cả", html: grid(latest) },
                    { id: "video", label: "Video", html: grid(latest.filter(function (m) { return m.kind === "video"; })) },
                    { id: "audio", label: "Nghe", html: grid(latest.filter(function (m) { return m.kind === "audio"; })) },
                    { id: "line-up", label: "Line-up phim tháng 11", html: '<div class="poster-grid">' + D.media.filter(function (m) { return m.lineup; }).map(posterCard).join("") + "</div>" }
                ], SL.param("tab")) +
            "</div>";
    }

    function posterCard(m, i) {
        return '<a class="poster" href="' + link("media", m.id) + '">' +
            '<span class="poster__img"><img src="' + img(m.id + "-poster", 400, 600) + '" alt="" loading="lazy">' +
                (i < 4 ? '<span class="pill pill--new">Mới</span>' : "") +
                caption(esc(m.group) + " · " + esc(m.genre), esc(m.title)) +
            "</span>" +
        "</a>";
    }

    /* ================= Tiện ích ================= */

    function flightRow(f) {
        var tone = f.status === "Đang bay" ? "live" : f.status.indexOf("Trễ") === 0 ? "warn" : f.status === "Đã hạ cánh" ? "done" : "ok";
        return '<div class="flight-row">' +
            '<strong class="flight-row__code">' + esc(f.code) + "</strong>" +
            '<span class="flight-row__route">' + f.from + " " + icon("plane") + " " + f.to + "</span>" +
            '<span class="flight-row__time">' + f.dep + " – " + f.arr + "</span>" +
            '<span class="status status--' + tone + '">' + esc(f.status) + "</span>" +
        "</div>";
    }

    /* ---------- Giám sát chuyến bay: bản đồ trực tiếp kiểu Flightradar24 (Leaflet + bản đồ CARTO/OSM) ---------- */

    // Số ngẫu nhiên có hạt giống: mỗi lần mở trang máy bay ở cùng vị trí (mockup ổn định)
    function seeded(seed) {
        return function () {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    var PLANE_SVG = '<svg viewBox="0 0 24 24"><path d="M12 1.5c.9 0 1.3.9 1.3 1.8V9l8 4.6v2.2l-8-2.4v5l2.6 1.9v1.6L12 21l-3.9.9v-1.6l2.6-1.9v-5l-8 2.4v-2.2l8-4.6V3.3c0-.9.4-1.8 1.3-1.8z"/></svg>';

    function liveMap() {
        return '<div class="live-map">' +
            '<div id="live-map" class="live-map__canvas" role="application" aria-label="Bản đồ giám sát chuyến bay trực tiếp"></div>' +
            '<form class="live-map__search" data-live-search>' +
                icon("search") + '<input type="search" name="q" placeholder="Tìm, giám sát live" aria-label="Tìm chuyến bay, sân bay" value="' + esc(SL.param("q") || "") + '">' +
            "</form>" +
            '<span class="live-map__badge"><i></i>LIVE</span>' +
        "</div>";
    }

    function initLiveMap() {
        var el = document.getElementById("live-map");
        if (!el) return;
        if (!window.L) {
            el.innerHTML = '<div class="live-map__fallback">Không tải được bản đồ (cần kết nối Internet).</div>';
            return;
        }
        var L = window.L;
        var map = L.map(el, { zoomControl: false, worldCopyJump: true }).setView([13.2, 106.6], 6);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        // Bản đồ địa hình Esri (không cần API key), gần giống nền bản đồ của Flightradar24
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 12,
            attribution: "Tiles &copy; Esri"
        }).addTo(map);

        // Sân bay: ghim xanh có hình tháp không lưu (icon Home của bộ Player)
        Object.keys(D.airports).forEach(function (code) {
            var a = D.airports[code];
            if (a.lat == null) return;
            L.marker([a.lat, a.lon], { icon: L.divIcon({ className: "ap-pin", html: icon("home"), iconSize: [26, 32], iconAnchor: [13, 32], popupAnchor: [0, -30] }) })
                .addTo(map).bindPopup("<strong>" + esc(a.name) + " (" + code + ")</strong><br>" + esc(a.city) + ' · <a href="tien-ich.html?ap=' + code + '#ap-board">Bảng chuyến bay</a>');
        });

        // Máy bay: các chuyến trong dữ liệu (đặt theo % hành trình) + máy bay minh hoạ quanh khu vực
        var rnd = seeded(20261109);
        var codes = Object.keys(D.airports);
        var prefixes = ["VN", "VJ", "QH", "VU", "TG", "SQ", "CX", "KE", "MH"];
        var planes = [];
        D.flights.forEach(function (f) {
            var a = D.airports[f.from], b = D.airports[f.to];
            if (!(f.progress > 0 && f.progress < 1) || !a || !b) return;
            planes.push({ code: f.code, from: f.from, to: f.to, lat: a.lat + (b.lat - a.lat) * f.progress, lon: a.lon + (b.lon - a.lon) * f.progress,
                hdg: Math.atan2(b.lon - a.lon, b.lat - a.lat) * 180 / Math.PI, real: true });
        });
        for (var n = 0; n < 110; n++) {
            var from = codes[Math.floor(rnd() * codes.length)], to = codes[Math.floor(rnd() * codes.length)];
            planes.push({ code: prefixes[Math.floor(rnd() * prefixes.length)] + " " + (100 + Math.floor(rnd() * 8900)), from: from, to: to === from ? "SGN" : to,
                lat: 3 + rnd() * 20, lon: 99 + rnd() * 15, hdg: rnd() * 360 });
        }
        planes.forEach(function (pl) {
            pl.alt = 8000 + Math.round(rnd() * 4000);
            pl.spd = 720 + Math.round(rnd() * 180);
            pl.marker = L.marker([pl.lat, pl.lon], { icon: L.divIcon({ className: "fr-plane" + (pl.real ? " fr-plane--ours" : ""), html: '<span style="transform:rotate(' + pl.hdg.toFixed(0) + 'deg)">' + PLANE_SVG + "</span>", iconSize: [22, 22], iconAnchor: [11, 11] }) })
                .addTo(map)
                .bindPopup("<strong>" + esc(pl.code) + "</strong><br>" + pl.from + " → " + pl.to + "<br>Độ cao " + pl.alt.toLocaleString("vi-VN") + " m · " + pl.spd + " km/h");
        });

        // "Live": máy bay nhích dần theo hướng bay; ra khỏi khu vực thì quay lại phía đối diện
        setInterval(function () {
            planes.forEach(function (pl) {
                var r = pl.hdg * Math.PI / 180, step = pl.spd / 900000 * 6;
                pl.lat += Math.cos(r) * step;
                pl.lon += Math.sin(r) * step / Math.cos(pl.lat * Math.PI / 180);
                if (pl.lat > 24) pl.lat = 2; else if (pl.lat < 2) pl.lat = 24;
                if (pl.lon > 115) pl.lon = 98; else if (pl.lon < 98) pl.lon = 115;
                pl.marker.setLatLng([pl.lat, pl.lon]);
            });
        }, 1500);

        // Ô tìm kiếm: số hiệu chuyến bay hoặc mã / tên sân bay
        function find(q) {
            var k = q.replace(/\s/g, "").toUpperCase();
            if (!k) return;
            var pl = planes.filter(function (x) { return x.code.replace(/\s/g, "") === k; })[0];
            if (pl) { map.flyTo([pl.lat, pl.lon], 8); pl.marker.openPopup(); return; }
            var code = codes.filter(function (c) { return c === k || normalize(D.airports[c].name).replace(/\s/g, "").toUpperCase() === normalize(k).toUpperCase(); })[0];
            if (code) { map.flyTo([D.airports[code].lat, D.airports[code].lon], 9); return; }
            SL.toast("Không tìm thấy “" + q + "”. Thử VN 220, SGN hoặc Nội Bài.");
        }
        page.querySelector("[data-live-search]").addEventListener("submit", function (e) {
            e.preventDefault();
            find(this.q.value);
        });
        if (SL.param("q")) find(SL.param("q"));
    }

    /* ---------- Thông tin chuyến bay: ảnh ngang tràn màn hình theo từng cảng hàng không ---------- */

    var MAIN_AIRPORTS = ["HAN", "SGN", "DAD"];

    // Ảnh sân bay: ảnh thật (Wikimedia Commons) nếu có trong dữ liệu, chưa có thì dùng ảnh minh hoạ
    function apPhoto(code, w, h) {
        return D.airports[code].photo || img("ap-" + code, w, h);
    }

    function airportBanner(code) {
        var a = D.airports[code];
        return '<a class="ap-banner" href="tien-ich.html?ap=' + code + '#ap-board">' +
            '<img src="' + apPhoto(code, 1600, 560) + '" alt="Cảng hàng không ' + esc(a.name) + '" loading="lazy">' +
            '<span class="ap-banner__body"><small>Cảng hàng không quốc tế · ' + code + "</small><strong>" + esc(a.name) + "</strong>" +
            '<span class="ap-banner__more">Bảng chuyến bay ' + icon("chevron") + "</span></span>" +
        "</a>";
    }

    // Bảng chuyến bay (minh hoạ) của một sân bay: chuyến trong dữ liệu + chuyến sinh thêm cho đủ bảng
    function airportFlights(code, dir) {
        var rnd = seeded(code.charCodeAt(0) * 31 + code.charCodeAt(2) + (dir === "dep" ? 7 : 3));
        var others = Object.keys(D.airports).filter(function (c) { return c !== code; });
        var list = D.flights.filter(function (f) { return dir === "dep" ? f.from === code : f.to === code; }).map(function (f) { return f; });
        var statuses = ["Đúng giờ", "Đang lên tàu", "Trễ 20 phút", "Đang bay", "Đúng giờ", "Đã hạ cánh"];
        for (var i = 0; list.length < 8; i++) {
            var other = others[Math.floor(rnd() * others.length)];
            var h = 6 + i * 2, m = Math.floor(rnd() * 6) * 10;
            var t = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
            var h2 = h + 1 + Math.floor(rnd() * 2);
            list.push({ code: ["VN", "VJ", "QH", "VU"][Math.floor(rnd() * 4)] + " " + (100 + Math.floor(rnd() * 1800)),
                from: dir === "dep" ? code : other, to: dir === "dep" ? other : code,
                dep: t, arr: (h2 < 10 ? "0" : "") + h2 + ":" + (m < 10 ? "0" : "") + m, status: statuses[i % statuses.length] });
        }
        // Bảng sân bay: sắp theo giờ đi (chuyến đi) hoặc giờ đến (chuyến đến)
        var key = dir === "dep" ? "dep" : "arr";
        return list.sort(function (x, y) { return x[key] < y[key] ? -1 : x[key] > y[key] ? 1 : 0; });
    }

    function airportDetail(code) {
        if (code === "khac") {
            var others = Object.keys(D.airports).filter(function (c) { return MAIN_AIRPORTS.indexOf(c) < 0; });
            return '<div class="ap-others" id="ap-board">' + others.map(function (c) {
                var a = D.airports[c];
                return '<a class="ap-card" href="tien-ich.html?ap=' + c + '#ap-board"><img src="' + apPhoto(c, 480, 270) + '" alt="Cảng hàng không ' + esc(a.name) + '" loading="lazy">' +
                    caption(c + " · " + esc(a.city), esc(a.name)) + "</a>";
            }).join("") + "</div>";
        }
        var a = D.airports[code];
        if (!a) return "";
        return '<div class="panel ap-board" id="ap-board">' +
            '<div class="ap-board__head"><h3>' + esc(a.name) + " <small>" + code + " · " + esc(a.city) + "</small></h3>" +
                '<span class="ap-board__weather">' + icon(a.weather) + a.temp + "°</span></div>" +
            tabbed([
                { id: "dep", label: "Chuyến đi", html: airportFlights(code, "dep").map(flightRow).join("") },
                { id: "arr", label: "Chuyến đến", html: airportFlights(code, "arr").map(flightRow).join("") }
            ], "dep") +
        "</div>";
    }

    function renderUtility() {
        var me = D.me;
        var weatherText = { sun: "Nắng đẹp", cloud: "Nhiều mây", rain: "Có mưa rào" };
        var ap = SL.param("ap");

        page.innerHTML =
            '<div class="container">' +
                pageHead("Tiện ích", "Giám sát chuyến bay trực tiếp, thông tin chuyến bay theo cảng hàng không, sơ đồ nhà ga và tàu bay, thời tiết sân bay.") +

                '<section class="section section--first" id="giam-sat">' + sectionHead("Giám sát chuyến bay") + liveMap() + "</section>" +

                '<section class="section" id="thong-tin">' + sectionHead("Thông tin chuyến bay") +
                    '<div class="ap-banners">' +
                        MAIN_AIRPORTS.map(airportBanner).join("") +
                        '<a class="ap-banner ap-banner--others" href="tien-ich.html?ap=khac#ap-board">' +
                            '<img src="' + apPhoto("PQC", 1600, 560) + '" alt="Các cảng hàng không khác" loading="lazy">' +
                            '<span class="ap-banner__body"><small>' + (Object.keys(D.airports).length - MAIN_AIRPORTS.length) + " cảng hàng không trong nước & quốc tế</small><strong>Các cảng hàng không khác</strong>" +
                            '<span class="ap-banner__more">Xem danh sách ' + icon("chevron") + "</span></span>" +
                        "</a>" +
                    "</div>" +
                    (ap ? airportDetail(ap) : "") +
                "</section>" +

                '<section class="section" id="so-do">' + sectionHead("Sơ đồ hướng dẫn") +
                    '<div class="util-grid">' +
                        '<div class="panel"><h2>Sơ đồ nhà ga</h2><p class="muted">Nhà ga quốc nội Tân Sơn Nhất · đường đi đến cửa ra ' + me.flight.gate + "</p>" + terminalMap(me.flight.gate) + "</div>" +
                        '<div class="panel"><h2>Sơ đồ tàu bay</h2><p class="muted">Airbus A321 · chuyến ' + esc(me.flight.code) + " · ghế của bạn " + esc(me.flight.seat) + "</p>" + seatMap(me.flight.seat) + "</div>" +
                    "</div>" +
                "</section>" +

                '<section class="section" id="thoi-tiet">' + sectionHead("Thời tiết sân bay") +
                    '<div class="weather-grid">' + Object.keys(D.airports).map(function (code) {
                        var a = D.airports[code];
                        return '<div class="weather weather--' + a.weather + '">' + icon(a.weather) +
                            "<div><strong>" + esc(a.name) + "</strong><small>" + code + " · " + esc(a.city) + " · " + weatherText[a.weather] + "</small></div>" +
                            '<span class="weather__temp">' + a.temp + "°</span></div>";
                    }).join("") + "</div>" +
                "</section>" +
            "</div>";

        initLiveMap();
    }

    // Sơ đồ nhà ga (minh hoạ): các khu theo thứ tự đi, đường đi nét đứt từ cửa vào đến cửa ra máy bay của bạn
    function terminalMap(myGate) {
        var gates = [10, 11, 12, 13, 14, 15, 16];
        var gx = function (g) { return 170 + (g - 10) * 62; };
        var mine = gx(+myGate) + 22;
        function zone(x, y, w, h, label, cls) {
            return '<rect class="t-zone' + (cls ? " " + cls : "") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"/>' +
                '<text class="t-label" x="' + (x + w / 2) + '" y="' + (y + 20) + '">' + label + "</text>";
        }
        return '<svg class="terminal" viewBox="0 0 640 290" role="img" aria-label="Sơ đồ nhà ga, đường đến cửa ra ' + myGate + '">' +
            '<rect class="t-building" x="16" y="30" width="608" height="240" rx="16"/>' +
            gates.map(function (g) {
                return '<rect class="t-gate' + (g === +myGate ? " t-gate--mine" : "") + '" x="' + gx(g) + '" y="44" width="44" height="40" rx="6"/>' +
                    '<text class="t-label t-label--gate" x="' + (gx(g) + 22) + '" y="69">' + g + "</text>";
            }).join("") +
            zone(160, 110, 280, 56, "Miễn thuế · Ăn uống") +
            zone(460, 110, 150, 56, "Phòng chờ thương gia") +
            zone(30, 196, 112, 60, "Cửa vào sảnh đi") +
            zone(160, 196, 170, 60, "Quầy làm thủ tục A–D") +
            zone(350, 196, 110, 60, "Soi chiếu an ninh", "t-zone--sec") +
            zone(480, 196, 130, 60, "Hành lý quá khổ") +
            // Đường đi chạy dưới chân các khu (không đè chữ), lên hành lang giữa miễn thuế và phòng chờ, rồi tới cửa ra
            '<path class="t-route" d="M86 242 H450 V97 H' + mine + ' V88"/>' +
            '<circle class="t-you" cx="86" cy="242" r="7"/><text class="t-label t-label--you" x="86" y="284">Bạn ở đây</text>' +
        "</svg>" +
        '<ol class="t-steps">' +
            "<li><b>1</b>Vào sảnh đi, đến quầy làm thủ tục A–D (khoảng 3 phút)</li>" +
            "<li><b>2</b>Qua soi chiếu an ninh (5–15 phút, fast-track nếu đã đặt)</li>" +
            "<li><b>3</b>Đi qua khu miễn thuế · ăn uống</li>" +
            "<li><b>4</b>Đến cửa ra máy bay " + myGate + " trước giờ lên tàu 20 phút</li>" +
        "</ol>";
    }

    // Sơ đồ ghế tàu bay (minh hoạ A321): thương gia 2-2, phổ thông 3-3, ghế của bạn tô màu
    function seatMap(mySeat) {
        var taken = "1D 2A 2F 4B 5C 5D 6A 6E 7F 8B 8C 9D 10A 11E 12C 12F 13B 14D".split(" ");
        var rows = "";
        for (var r = 1; r <= 14; r++) {
            var biz = r <= 3;
            var left = biz ? ["A", "C"] : ["A", "B", "C"];
            var right = biz ? ["D", "F"] : ["D", "E", "F"];
            var seat = function (c) {
                var id = r + c;
                var cls = "seat" + (biz ? " seat--biz" : "") + (id === mySeat ? " seat--mine" : taken.indexOf(id) > -1 ? " seat--taken" : "");
                return '<span class="' + cls + '" title="Ghế ' + id + '">' + (id === mySeat ? icon("user") : c) + "</span>";
            };
            if (r === 4) rows += '<div class="seatmap__divider">Hạng phổ thông</div>';
            if (r === 11) rows += '<div class="seatmap__exit">⇠ Lối thoát hiểm ⇢</div>';
            rows += '<div class="seatmap__row"><span class="seatmap__side">' + left.map(seat).join("") + '</span><span class="seatmap__no">' + r + '</span><span class="seatmap__side">' + right.map(seat).join("") + "</span></div>";
        }
        return '<div class="seatmap">' +
            '<div class="seatmap__nose">Buồng lái · Bếp · WC</div>' +
            '<div class="seatmap__divider">Hạng thương gia</div>' + rows +
            '<div class="seatmap__nose seatmap__nose--tail">WC · Bếp</div>' +
        "</div>" +
        '<div class="seatmap__legend"><span><i class="seat seat--mine"></i>Ghế của bạn</span><span><i class="seat"></i>Còn trống</span><span><i class="seat seat--taken"></i>Đã có người</span></div>';
    }

    /* ================= Ý kiến ================= */

    function starRow(n) {
        var s = "";
        for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= n ? "on" : "") + '">' + icon("star") + "</span>";
        return '<span class="star-row">' + s + "</span>";
    }

    function experiencePost(e) {
        var u = byId(D.users, e.user);
        return '<article class="post panel">' +
            '<div class="post__head">' + avatar(u.name) +
                "<div><strong>" + esc(u.name) + "</strong><small>" + esc(e.time) + "</small></div>" +
                '<span class="pill pill--soft">' + icon("plane") + esc(e.route) + "</span>" +
            "</div>" +
            starRow(e.rating) +
            '<p class="post__text">' + esc(e.text) + "</p>" +
            (e.photo ? '<img class="post__photo" src="' + img(e.photo, 900, 500) + '" alt="" loading="lazy">' : "") +
            '<div class="comment__actions">' +
                '<button type="button">' + icon("like") + e.likes + "</button>" +
                '<button type="button">' + icon("comment") + e.replies + " bình luận</button>" +
                '<button type="button">' + icon("share") + "Chia sẻ</button>" +
            "</div>" +
        "</article>";
    }

    function surveyCard(s) {
        return '<div class="panel survey" data-survey>' +
            '<h3>' + icon("poll") + esc(s.question) + "</h3>" +
            s.options.map(function (o) {
                return '<button type="button" class="survey__opt" data-vote>' +
                    '<span class="survey__bar" style="width:' + o.pct + '%"></span>' +
                    "<span>" + esc(o.label) + '</span><b class="survey__pct">' + o.pct + "%</b></button>";
            }).join("") +
            '<small class="muted">' + s.votes.toLocaleString("vi-VN") + " lượt bình chọn · chọn một phương án để xem kết quả</small>" +
        "</div>";
    }

    function renderOpinion() {
        var me = D.me;
        page.innerHTML =
            '<div class="container container--narrow">' +
                pageHead("Ý kiến", "Chia sẻ trải nghiệm chuyến bay và tham gia khảo sát để AIRLIFE phục vụ bạn tốt hơn.") +
                tabbed([
                    { id: "trai-nghiem", label: "Trải nghiệm", icon: "plane", html:
                        '<form class="panel composer" onsubmit="return false">' +
                            '<div class="composer__row">' + avatar(me.name) + '<textarea rows="2" placeholder="Chuyến bay vừa rồi của bạn thế nào?"></textarea></div>' +
                            '<div class="composer__tools">' +
                                '<input type="text" placeholder="Chặng bay, VD: SGN → HAN" aria-label="Chặng bay">' +
                                starRow(5) +
                                '<button class="btn btn--primary btn--sm" type="submit" data-action="post">Đăng</button>' +
                            "</div>" +
                        "</form>" +
                        '<div class="feed">' + D.experiences.map(experiencePost).join("") + "</div>" },
                    { id: "khao-sat", label: "Khảo sát", icon: "poll", html:
                        '<div class="survey-list">' + D.surveys.map(surveyCard).join("") + "</div>" }
                ], SL.param("tab")) +
            "</div>";
    }

    /* ================= Bạn ================= */

    function renderMe() {
        var me = D.me;
        var following = me.following.map(function (id) { return byId(D.channels, id); });
        page.innerHTML =
            '<div class="container">' +
                '<section class="profile panel">' +
                    avatar(me.name, "xl") +
                    '<div class="profile__info">' +
                        "<h1>" + esc(me.name) + "</h1>" +
                        '<p><span class="pill">' + icon("crown") + esc(me.tier) + "</span> " + me.miles.toLocaleString("vi-VN") + " dặm tích lũy</p>" +
                        '<div class="profile__stats">' +
                            "<div><b>" + me.following.length + "</b><small>Đang theo dõi</small></div>" +
                            "<div><b>" + me.saved.length + "</b><small>Đã lưu</small></div>" +
                            "<div><b>" + me.orders.length + "</b><small>Đơn hàng</small></div>" +
                        "</div>" +
                    "</div>" +
                    '<div class="profile__actions"><button class="btn btn--soft btn--sm" type="button">' + icon("settings") + 'Cài đặt</button><button class="btn btn--soft btn--sm" type="button">' + icon("logout") + "Đăng xuất</button></div>" +
                "</section>" +

                '<div class="me-grid">' +
                    '<section class="section">' + sectionHead("Chuyến bay sắp tới", "tien-ich.html#thong-tin", "Thông tin chuyến bay") + boardingPass(me.flight) + "</section>" +
                    '<section class="section" id="orders">' + sectionHead("Đơn hàng của bạn") +
                        '<div class="panel order-list">' + me.orders.map(function (o) {
                            var p = byId(D.products, o.product);
                            return '<a class="order" href="' + link("product", p.id) + '"><img src="' + img(p.id, 120, 120) + '" alt="">' +
                                "<div><strong>" + esc(p.name) + "</strong><small>#" + o.id + " · " + o.date + "</small></div>" +
                                '<span class="status status--' + (o.status === "Đã nhận hàng" ? "done" : "ok") + '">' + esc(o.status) + "</span></a>";
                        }).join("") + "</div>" +
                    "</section>" +
                "</div>" +

                shelf("Tiếp tục xem", "suu-tap.html", me.history.map(function (h) { return mediaCard(byId(D.media, h.id), h.progress); }).join("")) +

                '<section class="section">' + sectionHead("Kênh đang theo dõi") +
                    '<div class="channel-grid">' + following.map(function (c) { return channelCard(c, true); }).join("") + "</div>" +
                "</section>" +
            "</div>";
    }

    /* ================= Sưu tập ================= */

    function renderCollection() {
        var me = D.me;
        var saved = me.saved.map(function (id) { return byId(D.media, id); });
        var wish = me.wishlist.map(function (id) { return byId(D.products, id); });
        page.innerHTML =
            '<div class="container">' +
                pageHead("Sưu tập", "Nội dung đã lưu, playlist của bạn và sản phẩm, tour yêu thích.") +
                tabbed([
                    { id: "playlist", label: "Playlist", count: me.playlists.length, html:
                        '<div class="playlist-grid">' + me.playlists.map(function (pl) {
                            var first = byId(D.media, pl.items[0]);
                            return '<a class="playlist" href="' + link("media", first.id) + '">' +
                                '<span class="playlist__stack"><img src="' + img(first.id, 640, 360) + '" alt="" loading="lazy">' +
                                    '<span class="playlist__count">' + icon("library") + pl.items.length + " mục</span>" +
                                    caption("Phát tất cả", esc(pl.name)) + "</span></a>";
                        }).join("") +
                        '<button class="playlist playlist--new" type="button">' + icon("sparkle") + "<strong>Tạo playlist mới</strong></button></div>" },
                    { id: "saved", label: "Đã lưu", count: saved.length, html: '<div class="media-grid">' + saved.map(function (m) { return mediaCard(m); }).join("") + "</div>" },
                    { id: "wishlist", label: "Yêu thích", count: wish.length, html: '<div class="product-grid">' + wish.map(productCard).join("") + "</div>" },
                    { id: "history", label: "Đã xem", count: me.history.length, html: '<div class="media-grid">' + me.history.map(function (h) { return mediaCard(byId(D.media, h.id), h.progress); }).join("") + "</div>" }
                ], SL.param("tab")) +
            "</div>";
    }

    /* ================= Tin tức ================= */

    function renderNews() {
        var first = D.news[0];
        var activeFilter = SL.param("f") || "Tất cả";
        var cats = ["Tất cả"].concat(D.news.map(function (n) { return n.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
        page.innerHTML =
            '<div class="container">' +
                pageHead("Tin tức", "Tin hàng không: an ninh, vũ trụ, UAV và không quân.") +
                '<a class="news-lead" href="' + link("news", first.id) + '">' +
                    '<img src="' + img(first.id, 1200, 600) + '" alt="">' +
                    '<span class="news-lead__body"><span class="pill">' + esc(first.cat) + "</span><strong>" + esc(first.title) + "</strong><small>" + esc(first.excerpt) + "</small></span>" +
                "</a>" +
                '<section class="section" id="all">' + chips(cats, activeFilter) +
                    '<div class="news-grid" data-filter-target>' + D.news.map(newsCard).join("") + "</div>" +
                    '<div data-empty hidden>' + emptyState("Chưa có bài viết.") + "</div>" +
                "</section>" +
            "</div>";
        applyFilter(activeFilter);
    }

    function renderArticle() {
        var n = byId(D.news, SL.param("id"));
        if (!n) return notFound();
        document.title = n.title + " | AIRLIFE";
        var related = D.news.filter(function (x) { return x.id !== n.id; }).slice(0, 4);
        page.innerHTML =
            '<div class="container article-layout">' +
                '<article class="article">' +
                    '<nav class="breadcrumb"><a href="tin-tuc.html">Tin tức</a>' + icon("chevron") + '<a href="tin-tuc.html?f=' + encodeURIComponent(n.cat) + '">' + esc(n.cat) + "</a></nav>" +
                    "<h1>" + esc(n.title) + "</h1>" +
                    '<p class="article__meta">' + icon("clock") + esc(n.date) + " · Skyline Media</p>" +
                    '<p class="article__lead">' + esc(n.excerpt) + "</p>" +
                    '<img class="article__cover" src="' + img(n.id, 1200, 640) + '" alt="">' +
                    "<p>Nội dung bài viết minh họa cho mockup. Phần thân bài sẽ do biên tập viên nhập trong CMS, gồm đoạn văn, ảnh, video và có thể gắn sản phẩm, tour hoặc nội dung liên quan ngay trong bài.</p>" +
                    "<h2>Diễn biến chính</h2>" +
                    "<p>Đoạn văn minh hoạ phần diễn biến của bài viết. Khi triển khai, biên tập viên nhập nội dung đầy đủ, chèn ảnh, video hoặc biểu đồ minh hoạ ngay trong bài.</p>" +
                    '<blockquote>“Trích dẫn phát biểu của nhân vật hoặc chuyên gia trong bài viết.”</blockquote>' +
                    "<p>Đoạn văn minh hoạ phần phân tích, đánh giá và thông tin liên quan, kèm liên kết đến các bài cùng chuyên mục.</p>" +
                    '<div class="article__share"><span>Chia sẻ</span><button class="icon-btn" type="button" aria-label="Chia sẻ">' + icon("share") + '</button><button class="icon-btn" type="button" aria-label="Lưu">' + icon("save") + "</button></div>" +
                    '<section class="section section--tight">' + sectionHead("Bình luận") + commentForm() +
                        '<ul class="comment-list">' + D.comments.slice(0, 3).map(function (c) { return commentItem(c, false); }).join("") + "</ul></section>" +
                "</article>" +
                '<aside class="article-side"><h2 class="side-title">Đọc thêm</h2>' + related.map(function (r) {
                    return '<a class="media-row" href="' + link("news", r.id) + '"><span class="thumb thumb--video"><img src="' + img(r.id, 320, 180) + '" alt="" loading="lazy"></span>' +
                        '<span class="media-row__body"><strong>' + esc(r.title) + "</strong><small>" + esc(r.date) + "</small></span></a>";
                }).join("") + "</aside>" +
            "</div>";
    }

    /* ================= Liên hệ ================= */

    function renderContact() {
        var s = D.site;
        page.innerHTML =
            '<div class="container">' +
                pageHead("Liên hệ & hợp tác", "Hãng bay, nhà sản xuất nội dung và doanh nghiệp muốn mở gian hàng trên AIRLIFE.") +
                '<div class="contact">' +
                    '<div class="contact__info">' +
                        s.offices.map(function (o) {
                            return '<div class="panel info-card">' + icon("map") + "<div><strong>Tòa soạn " + esc(o.name) + "</strong><p>" + esc(o.address) + "</p></div></div>";
                        }).join("") +
                        '<div class="panel info-card">' + icon("phone") + '<div><strong>Hotline</strong><p><a href="' + s.phoneHref + '">' + esc(s.phone) + "</a></p></div></div>" +
                        '<div class="panel info-card">' + icon("mail") + '<div><strong>Email</strong><p><a href="mailto:' + esc(s.email) + '">' + esc(s.email) + "</a></p></div></div>" +
                        '<div class="map-box">' + icon("map") + "<span>Bản đồ (nhúng Google Maps khi triển khai)</span></div>" +
                    "</div>" +
                    '<form class="panel contact__form" onsubmit="return false">' +
                        "<h2>Gửi yêu cầu</h2>" +
                        '<div class="field-row">' +
                            '<label class="field"><span>Họ tên</span><input type="text" placeholder="Nguyễn Văn A"></label>' +
                            '<label class="field"><span>Số điện thoại</span><input type="tel" placeholder="09xx xxx xxx"></label>' +
                        "</div>" +
                        '<label class="field"><span>Email</span><input type="email" placeholder="ban@congty.vn"></label>' +
                        '<label class="field"><span>Bạn quan tâm</span><select>' +
                            "<option>Mở kênh / gian hàng doanh nghiệp</option><option>Bán vé bay, tour trên AIRLIFE</option><option>Cung cấp nội dung (phim, podcast…)</option><option>Quảng cáo trên chuyến bay</option><option>Hợp tác hãng bay</option><option>Khác</option>" +
                        "</select></label>" +
                        '<label class="field"><span>Nội dung</span><textarea rows="5" placeholder="Mô tả ngắn nhu cầu của bạn"></textarea></label>' +
                        '<button class="btn btn--primary btn--lg" type="submit" data-action="send-contact">Gửi yêu cầu</button>' +
                    "</form>" +
                "</div>" +
            "</div>";
    }

    /* ================= Tìm kiếm ================= */

    function normalize(s) {
        return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
    }

    function renderSearch() {
        var q = (SL.param("q") || "").trim();
        var nq = normalize(q);
        function hit(text) { return normalize(text).indexOf(nq) > -1; }
        var media = q ? D.media.filter(function (m) { return hit(m.title + " " + m.group + " " + m.genre); }) : [];
        var products = q ? D.products.filter(function (p) { return hit(p.name + " " + p.cat); }) : [];
        var channels = q ? D.channels.filter(function (c) { return hit(c.name + " " + c.type); }) : [];
        var news = q ? D.news.filter(function (n) { return hit(n.title + " " + n.cat); }) : [];
        var total = media.length + products.length + channels.length + news.length;
        document.title = (q ? q + " - " : "") + "Tìm kiếm | AIRLIFE";

        page.innerHTML =
            '<div class="container">' +
                '<form class="search search--page" action="tim-kiem.html" role="search">' +
                    '<input class="search__input" type="search" name="q" value="' + esc(q) + '" placeholder="Tìm phim, podcast, vé bay, tour, kênh…" aria-label="Tìm kiếm" autofocus>' +
                    '<button class="search__btn" type="submit" aria-label="Tìm">' + icon("search") + "</button>" +
                "</form>" +
                (q ? '<p class="muted">' + total + " kết quả cho “" + esc(q) + "”</p>" : "") +
                (channels.length ? '<section class="section">' + sectionHead("Kênh") + '<div class="channel-grid">' + channels.map(channelCard).join("") + "</div></section>" : "") +
                (media.length ? '<section class="section">' + sectionHead("Video & audio") + '<div class="media-grid">' + media.map(function (m) { return mediaCard(m); }).join("") + "</div></section>" : "") +
                (products.length ? '<section class="section">' + sectionHead("Vé bay, tour & sản phẩm") + '<div class="product-grid">' + products.map(productCard).join("") + "</div></section>" : "") +
                (news.length ? '<section class="section">' + sectionHead("Tin tức") + '<div class="news-grid">' + news.map(newsCard).join("") + "</div></section>" : "") +
                (q && !total ? emptyState("Không tìm thấy kết quả. Thử từ khóa khác, ví dụ “phim”, “Nhật Bản”, “đặc sản”.") : "") +
                (!q ? '<section class="section">' + sectionHead("Gợi ý tìm kiếm") +
                    chips(["Phim Việt", "Podcast", "Ngủ ngon", "Vé bay", "Nhật Bản", "Miễn thuế", "Phú Quốc"], "", "data-suggest") + "</section>" : "") +
            "</div>";
    }

    /* ================= Tương tác trong trang ================= */

    function bindPageEvents() {
        page.addEventListener("click", function (e) {
            var el;

            // Tab: bình luận Hay/Nhiều, tab trang (kênh, tiện ích, ý kiến…)
            if ((el = e.target.closest("[data-tab]"))) {
                var bar = el.parentNode;
                var id = el.getAttribute("data-tab");
                bar.querySelectorAll("[data-tab]").forEach(function (b) { b.classList.toggle("active", b === el); });
                // Các pane là anh em ngay sau thanh tab (tab trang) hoặc trong cùng panel (bình luận)
                var scope = bar.closest(".panel") || bar.parentNode;
                Array.prototype.forEach.call(scope.children, function (p) {
                    if (p.hasAttribute("data-pane")) p.hidden = p.getAttribute("data-pane") !== id;
                });
                if (bar.classList.contains("tabs")) {
                    var url = new URL(location.href);
                    url.searchParams.set("tab", id);
                    history.replaceState(null, "", url);
                }
                return;
            }
            if ((el = e.target.closest("[data-chip]"))) {
                applyFilter(el.getAttribute("data-chip"));
                return;
            }
            if ((el = e.target.closest("[data-suggest]"))) {
                location.href = "tim-kiem.html?q=" + encodeURIComponent(el.getAttribute("data-suggest"));
                return;
            }
            if ((el = e.target.closest("[data-vote]"))) {
                var survey = el.closest("[data-survey]");
                survey.classList.add("is-voted");
                survey.querySelectorAll("[data-vote]").forEach(function (b) { b.classList.toggle("is-picked", b === el); });
                return;
            }
            if ((el = e.target.closest(".star-row span"))) {
                var all = el.parentNode.children;
                var idx = Array.prototype.indexOf.call(all, el);
                Array.prototype.forEach.call(all, function (s, i) { s.classList.toggle("on", i <= idx); });
                return;
            }
            if ((el = e.target.closest("[data-gallery]"))) {
                page.querySelector("[data-gallery-main]").src = el.getAttribute("data-gallery");
                el.parentNode.querySelectorAll("button").forEach(function (b) { b.classList.toggle("active", b === el); });
                return;
            }
            if ((el = e.target.closest("[data-qty]"))) {
                var input = page.querySelector("[data-qty-input]");
                input.value = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(el.getAttribute("data-qty"), 10));
                return;
            }
            // Phát / tạm dừng: video (nút giữa hoặc thanh điều khiển) và trình phát audio
            if ((el = e.target.closest("[data-video-play], [data-audio-play]"))) {
                var player = el.closest(".video-player, .audio-player");
                var playing = player.classList.toggle("is-playing");
                player.querySelector(".runway").classList.toggle("is-running", playing);
                player.querySelectorAll(".video-player__controls [data-video-play], [data-audio-play]").forEach(function (b) {
                    b.innerHTML = icon(playing ? "pause" : "play");
                    b.setAttribute("aria-label", playing ? "Tạm dừng" : "Phát");
                });
                // Audio: nút phát cũng mở mini player (data-play, xử lý ở layout.js) — chỉ khi bắt đầu phát
                if (el.hasAttribute("data-audio-play") && !playing) e.stopPropagation();
                return;
            }
            if ((el = e.target.closest("[data-action='toggle-transcript']"))) {
                var list = page.querySelector(".transcript");
                list.hidden = !list.hidden;
                el.textContent = list.hidden ? "Hiện bản chép lời" : "Ẩn bản chép lời";
                return;
            }
            if ((el = e.target.closest("[data-action='download-transcript']"))) {
                var m = byId(D.media, el.getAttribute("data-id"));
                var text = m.title + "\n" + channelOf(m).name + " · " + m.duration + "\n\n" + m.desc + "\n\n" +
                    transcriptOf(m).map(function (l) { return "[" + l[0] + "] " + l[1]; }).join("\n") + "\n";
                var a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
                a.download = m.title.replace(/[\\/:*?"<>|]/g, "") + ".txt";
                document.body.appendChild(a);
                a.click();
                a.remove();
                return;
            }
            if ((el = e.target.closest("[data-seek]"))) {
                SL.toast("Tua đến " + el.getAttribute("data-seek"));
                return;
            }
            if ((el = e.target.closest("[data-action]"))) {
                var msg = {
                    "send-contact": "Đã gửi yêu cầu. Skyline Media sẽ liên hệ lại trong 24 giờ.",
                    "send-feedback": "Cảm ơn góp ý của bạn! AIRLIFE sẽ phản hồi qua email.",
                    "post": "Đã đăng trải nghiệm của bạn.",
                }[el.getAttribute("data-action")];
                if (msg) SL.toast(msg);
            }
        });
    }

    var RENDER = {
        home: renderHome,
        category: renderCategory,
        watch: renderWatch,
        product: renderProduct,
        channel: renderChannel,
        "new": renderNew,
        utility: renderUtility,
        opinion: renderOpinion,
        me: renderMe,
        collection: renderCollection,
        news: renderNews,
        article: renderArticle,
        contact: renderContact,
        search: renderSearch
    };

    var render = RENDER[document.body.getAttribute("data-page")];
    if (render) render();
    bindPageEvents();
})();
