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

    function sectionHead(title, href, more) {
        return '<div class="section-head"><h2>' + title + "</h2>" +
            (href ? '<a class="section-head__more" href="' + href + '">' + (more || "Xem tất cả") + icon("chevron") + "</a>" : "") + "</div>";
    }

    function pageHead(iconName, title, desc) {
        return '<header class="page-head"><span class="page-head__icon">' + icon(iconName) + "</span>" +
            "<div><h1>" + esc(title) + "</h1><p>" + esc(desc) + "</p></div></header>";
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
                (typeof progress === "number" ? '<span class="thumb__progress"><span style="width:' + Math.round(progress * 100) + '%"></span></span>' : "") +
            "</a>" +
            (audio ? '<button class="play-fab" type="button" data-play="' + m.id + '" aria-label="Nghe ' + esc(m.title) + '">' + icon("play") + "</button>" : "") +
            '<div class="media-card__body">' +
                '<a href="' + link("channel", ch.id) + '">' + avatar(ch.name, "sm") + "</a>" +
                "<div>" +
                    '<h3 class="media-card__title"><a href="' + link("media", m.id) + '">' + esc(m.title) + "</a></h3>" +
                    '<p class="media-card__meta">' + meta(m) + "</p>" +
                "</div>" +
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
            '<span class="tile__overlay"><small>' + sub + "</small><strong>" + esc(isProduct ? item.name : item.title) + "</strong></span>" +
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
        return p.cat === "Vé bay" || p.section === "tour-bay";
    }

    function productCard(p) {
        var off = discount(p);
        return '<article class="product-card" data-filter="' + esc(p.cat) + '">' +
            '<a class="thumb thumb--square" href="' + link("product", p.id) + '">' +
                '<img src="' + img(p.id, 400, 400) + '" alt="" loading="lazy">' +
                (off ? '<span class="sale-tag">-' + off + "%</span>" : "") +
            "</a>" +
            '<div class="product-card__body">' +
                '<span class="product-card__cat">' + esc(p.cat) + "</span>" +
                '<h3 class="product-card__name"><a href="' + link("product", p.id) + '">' + esc(p.name) + "</a></h3>" +
                '<div class="price">' + (p.section === "tour-bay" ? "<small>Từ</small>" : "") + "<strong>" + SL.price(p.price) + "</strong>" + (p.oldPrice ? "<del>" + SL.price(p.oldPrice) + "</del>" : "") + "</div>" +
                '<div class="product-card__meta">' + stars(p.rating) + "<span>" + (isBooking(p) ? "Đã đặt " : "Đã bán ") + SL.compact(p.sold) + "</span></div>" +
                (isBooking(p)
                    ? '<a class="btn btn--primary btn--block btn--sm" href="' + link("product", p.id) + '">' + icon(p.cat === "Vé bay" ? "ticket" : "globe") + "Đặt ngay</a>"
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
            '<div class="panel__head"><h2>' + icon("fire") + (title || "Bình luận nổi bật") + "</h2>" +
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
            '<a class="thumb thumb--video" href="' + link("news", n.id) + '"><img src="' + img(n.id, 640, 360) + '" alt="" loading="lazy"></a>' +
            '<span class="news-card__cat">' + esc(n.cat) + " · " + esc(n.date) + "</span>" +
            '<h3><a href="' + link("news", n.id) + '">' + esc(n.title) + "</a></h3>" +
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
                '<div class="pass__top"><span class="logo__text">SKYLINE</span><span class="pill pill--soft">' + esc(f.cabin) + "</span></div>" +
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
            '<div class="panel__head"><h2>' + icon("radar") + 'Tiện ích</h2><a class="link" href="tien-ich.html">Tất cả</a></div>' +
            '<form class="flight-form" action="tien-ich.html">' +
                '<input type="hidden" name="tab" value="flightradar">' +
                '<input type="text" name="q" placeholder="Số hiệu chuyến bay, VD: VN 220" aria-label="Số hiệu chuyến bay">' +
                '<button class="btn btn--primary btn--sm" type="submit">Tra cứu</button>' +
            "</form>" +
            '<div class="flight-mini">' + live.map(flightRow).join("") + "</div>" +
            '<div class="utility__grid">' +
                '<a class="utility__item" href="tien-ich.html?tab=ra-tau-bay">' + icon("luggage") + "<span>Ra tàu bay</span></a>" +
                '<a class="utility__item" href="tien-ich.html?tab=thoi-tiet">' + icon("sun") + "<span>Thời tiết</span></a>" +
                '<a class="utility__item" href="tien-ich.html?tab=wifi">' + icon("wifi") + "<span>Wi-Fi</span></a>" +
                '<a class="utility__item" href="tien-ich.html?tab=phong-cho">' + icon("gate") + "<span>Phòng chờ</span></a>" +
            "</div>" +
        "</div>";
    }

    function renderHome() {
        var videos = D.media.filter(function (m) { return m.kind === "video"; });
        var audios = D.media.filter(function (m) { return m.kind === "audio"; });
        var featured = videos.filter(function (m) { return m.featured; })[0] || videos[0];
        var rest = videos.filter(function (m) { return m !== featured; });
        var topAudio = audios.slice().sort(function (a, b) { return b.views - a.views; });
        var business = D.products.filter(function (p) { return p.section === "kinh-doanh"; });
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
                        '<div class="panel__head"><h2>' + icon("headphones") + 'Nghe nhiều</h2><a class="link" href="chuyen-muc.html?c=nghe">Tất cả</a></div>' +
                        '<div class="rank-list">' + topAudio.slice(0, 4).map(function (m, i) { return mediaRow(m, i + 1); }).join("") + "</div>" +
                    "</div>" +
                    '<div class="panel">' +
                        '<div class="panel__head"><h2>' + icon("briefcase") + 'Kinh doanh trên chuyến bay</h2><a class="link" href="chuyen-muc.html?c=kinh-doanh">Xem tất cả</a></div>' +
                        '<div class="product-grid product-grid--3">' + deals.map(productCard).join("") + "</div>" +
                    "</div>" +
                    utilityBlock() +
                "</div>" +

                shelf("Tour bay nổi bật", "chuyen-muc.html?c=tour-bay", tours.map(productCard).join("")) +
                shelf("Mới tải lên", "moi-tai.html", D.media.slice().reverse().slice(0, 8).map(function (m) { return mediaCard(m); }).join("")) +
                shelf("Mua sắm & miễn thuế", "chuyen-muc.html?c=kinh-doanh", business.filter(function (p) { return p.cat !== "Vé bay"; }).map(productCard).join("")) +

                '<div class="split">' +
                    '<section class="section">' + sectionHead("Khám phá", "tin-tuc.html?f=" + encodeURIComponent("Khám phá")) +
                        '<div class="news-grid news-grid--2">' + D.news.filter(function (n) { return n.cat === "Khám phá"; }).slice(0, 2).map(newsCard).join("") + "</div>" +
                    "</section>" +
                    '<section class="section">' + sectionHead("Ý kiến khách bay", "y-kien.html?tab=khao-sat", "Tham gia") +
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
        document.title = cat.name + " | SKYLINE";

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
            var items = D.media.filter(function (m) { return m.cat === cat.id; });
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
                pageHead(cat.icon, cat.title, cat.desc) +
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
        document.title = m.title + " | SKYLINE";

        var player = audio
            ? '<div class="audio-player">' +
                '<img class="audio-player__cover" src="' + img(m.id, 480, 480) + '" alt="">' +
                '<div class="audio-player__main">' +
                    '<span class="pill">' + esc(m.group) + "</span>" +
                    "<h2>" + esc(m.title) + "</h2>" +
                    "<p>" + esc(ch.name) + "</p>" +
                    '<div class="wave" aria-hidden="true">' + new Array(49).join("<span></span>") + "</div>" +
                    '<div class="audio-player__time"><span>00:00</span><span>' + esc(m.duration) + "</span></div>" +
                    '<div class="audio-player__controls">' +
                        '<button class="icon-btn" type="button" aria-label="Bài trước">' + icon("prev") + "</button>" +
                        '<button class="icon-btn icon-btn--primary icon-btn--lg" type="button" data-play="' + m.id + '" aria-label="Phát">' + icon("play") + "</button>" +
                        '<button class="icon-btn" type="button" aria-label="Bài sau">' + icon("next") + "</button>" +
                    "</div>" +
                    '<p class="hint">Bấm phát để nghe trong nền, nhạc vẫn chạy khi bạn chuyển sang trang khác.</p>' +
                "</div>" +
              "</div>"
            : '<div class="video-player" data-video>' +
                '<img src="' + img(m.id, 1280, 720) + '" alt="">' +
                '<button class="video-player__play" type="button" aria-label="Phát">' + icon("play") + "</button>" +
                '<div class="video-player__bar"><span class="video-player__progress"></span><small>00:00 / ' + esc(m.duration) + "</small></div>" +
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
                    '<div class="desc-box"><strong>' + SL.compact(m.views) + " lượt " + (audio ? "nghe" : "xem") + " · " + esc(m.date) + " · " + esc(m.genre) + "</strong><p>" + esc(m.desc) + "</p></div>" +

                    (products.length
                        ? '<section class="section section--tight">' + sectionHead(icon("bag") + "Sản phẩm trong " + (audio ? "tập này" : "video")) +
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
        document.title = p.name + " | SKYLINE";

        var options = booking
            ? '<div class="field-row">' +
                '<label class="field"><span>' + (p.cat === "Vé bay" ? "Ngày bay" : "Ngày khởi hành") + '</span><input type="date" value="2026-11-14"></label>' +
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
                                  '<button class="btn btn--primary btn--lg" type="button" data-cart="' + p.id + '">' + icon("ticket") + "Đặt ngay</button>"
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
                            ? "Đặt bởi " + esc(ch.name) + " trên SKYLINE. Xác nhận qua email và tin nhắn trong 15 phút; đổi hoặc hủy theo điều kiện của từng hạng dịch vụ."
                            : "Sản phẩm được bán bởi " + esc(ch.name) + " trên SKYLINE. Đặt hàng ngay trong chuyến bay qua màn hình ghế ngồi hoặc điện thoại kết nối Wi-Fi trên máy bay; thanh toán bằng thẻ, ví điện tử hoặc khi nhận hàng.") + "</p>" +
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
        document.title = ch.name + " | SKYLINE";

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
                pageHead("sparkle", "Mới tải", "Video, podcast và phim vừa được cập nhật lên SKYLINE.") +
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
            "</span>" +
            "<strong>" + esc(m.title) + "</strong>" +
            "<small>" + esc(m.group) + " · " + esc(m.genre) + "</small>" +
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

    // Bản đồ bay dạng sơ đồ: sân bay theo toạ độ trong data, đường bay cong, máy bay đặt theo % hành trình
    function radarMap() {
        var W = 160, H = 100;
        function pt(code) { var a = airport(code); return [a.x / 100 * (W - 20) + 10, a.y / 100 * (H - 16) + 8]; }
        var routes = "", planes = "";
        D.flights.forEach(function (f) {
            var a = pt(f.from), b = pt(f.to);
            var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
            var dx = b[0] - a[0], dy = b[1] - a[1];
            var c = [mx - dy * 0.2, my + dx * 0.2]; // điểm điều khiển lệch vuông góc để đường bay cong
            var live = f.progress > 0 && f.progress < 1;
            routes += '<path class="route' + (live ? " route--live" : "") + '" d="M' + a + " Q" + c + " " + b + '"/>';
            if (live) {
                var t = f.progress;
                var x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0];
                var y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1];
                var tx = 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]);
                var ty = 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
                var angle = Math.atan2(ty, tx) * 180 / Math.PI + 90;
                planes += '<g class="plane" transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + angle.toFixed(0) + ')">' +
                    '<path d="M0-3.2 .7-1v.8L3 .9v.7L.7.9v1.5l.9.8v.5L0 3.3l-1.6.4v-.5l.9-.8V.9L-3 1.6V.9L-.7-.2V-1z"/></g>' +
                    '<text class="plane__label" x="' + (x + 3).toFixed(1) + '" y="' + (y - 2.5).toFixed(1) + '">' + esc(f.code) + "</text>";
            }
        });
        var dots = Object.keys(D.airports).map(function (code) {
            var p = pt(code);
            return '<g class="ap"><circle class="ap__pulse" cx="' + p[0] + '" cy="' + p[1] + '" r="2.2"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.1"/>' +
                '<text x="' + (p[0] + 2.4) + '" y="' + (p[1] + 1) + '">' + code + "</text></g>";
        }).join("");
        return '<div class="radar"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Bản đồ chuyến bay đang hoạt động">' +
            '<defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" class="grid"/></pattern></defs>' +
            '<rect width="' + W + '" height="' + H + '" fill="url(#grid)"/>' + routes + dots + planes + "</svg>" +
            '<span class="radar__live"><i></i>Trực tiếp · ' + D.flights.filter(function (f) { return f.progress > 0 && f.progress < 1; }).length + " chuyến đang bay</span></div>";
    }

    function renderUtility() {
        var me = D.me;
        var steps = [
            { t: "Trước 24 giờ", d: "Làm thủ tục trực tuyến, chọn ghế và nhận thẻ lên máy bay điện tử." },
            { t: "Trước 2 giờ", d: "Có mặt tại sân bay. Chuyến quốc tế nên đến trước 3 giờ." },
            { t: "Trước 60 phút", d: "Đóng quầy ký gửi hành lý. Qua soi chiếu an ninh (fast-track nếu đã đặt)." },
            { t: "Trước 40 phút", d: "Có mặt tại cửa ra máy bay " + me.flight.gate + ". Bắt đầu lên tàu lúc " + me.flight.boarding + "." },
            { t: "Trước 15 phút", d: "Đóng cửa ra máy bay. Hành khách đến trễ sẽ không được lên tàu." }
        ];
        var wifi = [
            { name: "Nhắn tin", price: 49000, desc: "Zalo, Messenger, WhatsApp suốt chặng bay", hot: false },
            { name: "Lướt web", price: 149000, desc: "Email, mạng xã hội, 1 thiết bị", hot: true },
            { name: "Cao cấp", price: 299000, desc: "Tốc độ cao, xem video, 2 thiết bị", hot: false }
        ];
        var weatherText = { sun: "Nắng đẹp", cloud: "Nhiều mây", rain: "Có mưa rào" };

        page.innerHTML =
            '<div class="container">' +
                pageHead("radar", "Tiện ích", "Mọi thứ cần cho chuyến bay: ra tàu bay, theo dõi chuyến bay, thời tiết, Wi-Fi và dịch vụ sân bay.") +
                tabbed([
                    { id: "ra-tau-bay", label: "Ra tàu bay", icon: "luggage", html:
                        '<div class="util-grid">' +
                            '<div>' +
                                '<h2 class="side-title">Chuyến bay của bạn</h2>' + boardingPass(me.flight) +
                                '<div class="panel mt-16"><h2>Hành lý</h2><ul class="check-list">' +
                                    "<li>" + icon("check") + "Xách tay 7kg, kích thước tối đa 56 × 36 × 23 cm</li>" +
                                    "<li>" + icon("check") + "Ký gửi 30kg (hạng Thương gia)</li>" +
                                    "<li>" + icon("check") + "Chất lỏng dưới 100ml/chai, tổng không quá 1 lít</li>" +
                                    "<li>" + icon("check") + "Pin dự phòng mang theo người, không ký gửi</li>" +
                                "</ul></div>" +
                            "</div>" +
                            '<div class="panel"><h2>Lịch trình ra tàu bay</h2><ol class="timeline">' + steps.map(function (s) {
                                return "<li><strong>" + s.t + "</strong><p>" + s.d + "</p></li>";
                            }).join("") + "</ol></div>" +
                        "</div>" },
                    { id: "flightradar", label: "Flightradar", icon: "radar", html:
                        '<form class="search search--page" action="tien-ich.html"><input type="hidden" name="tab" value="flightradar">' +
                            '<input class="search__input" type="search" name="q" value="' + esc(SL.param("q") || "") + '" placeholder="Số hiệu chuyến bay hoặc sân bay, VD: VN 220, SGN"><button class="search__btn" type="submit" aria-label="Tìm">' + icon("search") + "</button></form>" +
                        '<div class="radar-layout">' + radarMap() +
                            '<div class="panel flight-board"><h2>Bảng chuyến bay</h2>' + D.flights.filter(function (f) {
                                var q = (SL.param("q") || "").replace(/\s/g, "").toUpperCase();
                                return !q || (f.code + f.from + f.to).replace(/\s/g, "").indexOf(q) > -1;
                            }).map(flightRow).join("") + "</div>" +
                        "</div>" },
                    { id: "thoi-tiet", label: "Thời tiết điểm đến", icon: "sun", html:
                        '<div class="weather-grid">' + Object.keys(D.airports).map(function (code) {
                            var a = D.airports[code];
                            return '<div class="weather weather--' + a.weather + '">' + icon(a.weather) +
                                "<div><strong>" + esc(a.city) + "</strong><small>" + code + " · " + weatherText[a.weather] + "</small></div>" +
                                '<span class="weather__temp">' + a.temp + "°</span></div>";
                        }).join("") + "</div>" },
                    { id: "wifi", label: "Wi-Fi trên máy bay", icon: "wifi", html:
                        '<div class="plan-grid">' + wifi.map(function (w) {
                            return '<div class="plan' + (w.hot ? " plan--hot" : "") + '">' + (w.hot ? '<span class="pill">Phổ biến</span>' : "") +
                                icon("wifi") + "<h3>" + w.name + "</h3><p>" + w.desc + '</p><div class="price"><strong>' + SL.price(w.price) + "</strong><small>/ chặng bay</small></div>" +
                                '<button class="btn ' + (w.hot ? "btn--primary" : "btn--outline") + ' btn--block" type="button" data-action="buy-wifi">Mua gói</button></div>';
                        }).join("") + "</div>" },
                    { id: "phong-cho", label: "Phòng chờ & fast-track", icon: "gate", html:
                        '<div class="product-grid">' + D.products.filter(function (p) { return p.cat === "Dịch vụ sân bay"; }).map(productCard).join("") + "</div>" }
                ], SL.param("tab")) +
            "</div>";
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
                pageHead("chat", "Ý kiến", "Chia sẻ trải nghiệm chuyến bay, tham gia khảo sát và góp ý để SKYLINE phục vụ bạn tốt hơn.") +
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
                        '<div class="survey-list">' + D.surveys.map(surveyCard).join("") + "</div>" },
                    { id: "gop-y", label: "Góp ý", icon: "edit", html:
                        '<form class="panel feedback" onsubmit="return false">' +
                            "<h2>Gửi góp ý cho SKYLINE</h2>" +
                            '<label class="field"><span>Bạn góp ý về</span><select>' +
                                "<option>Nội dung giải trí (phim, nhạc, podcast)</option><option>Kinh doanh: vé bay, mua sắm, đơn hàng</option><option>Tour bay</option><option>Tiện ích: Flightradar, Wi-Fi, phòng chờ</option><option>Website / ứng dụng</option><option>Khác</option>" +
                            "</select></label>" +
                            '<div class="field"><span>Mức độ hài lòng</span><div class="rate">' +
                                ["Rất tệ", "Chưa tốt", "Bình thường", "Tốt", "Tuyệt vời"].map(function (r, i) {
                                    return '<label><input type="radio" name="rate"' + (i === 3 ? " checked" : "") + "><span>" + (i + 1) + "<small>" + r + "</small></span></label>";
                                }).join("") +
                            "</div></div>" +
                            '<label class="field"><span>Nội dung</span><textarea rows="5" placeholder="Điều gì khiến bạn hài lòng hoặc chưa hài lòng?"></textarea></label>' +
                            '<div class="field-row">' +
                                '<label class="field"><span>Số hiệu chuyến bay (nếu có)</span><input type="text" placeholder="VD: VN 220"></label>' +
                                '<label class="field"><span>Email nhận phản hồi</span><input type="email" placeholder="ban@email.com"></label>' +
                            "</div>" +
                            '<button class="btn btn--primary btn--lg" type="submit" data-action="send-feedback">Gửi góp ý</button>' +
                        "</form>" }
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
                    '<section class="section">' + sectionHead("Chuyến bay sắp tới", "tien-ich.html?tab=ra-tau-bay", "Ra tàu bay") + boardingPass(me.flight) + "</section>" +
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
                pageHead("library", "Sưu tập", "Nội dung đã lưu, playlist của bạn và sản phẩm, tour yêu thích.") +
                tabbed([
                    { id: "playlist", label: "Playlist", count: me.playlists.length, html:
                        '<div class="playlist-grid">' + me.playlists.map(function (pl) {
                            var first = byId(D.media, pl.items[0]);
                            return '<a class="playlist" href="' + link("media", first.id) + '">' +
                                '<span class="playlist__stack"><img src="' + img(first.id, 640, 360) + '" alt="" loading="lazy">' +
                                    '<span class="playlist__count">' + icon("library") + pl.items.length + " mục</span></span>" +
                                "<strong>" + esc(pl.name) + "</strong><small>Phát tất cả</small></a>";
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
                pageHead("news", "Tin tức", "Khám phá điểm đến, sự kiện, mẹo bay và line-up phim trên SKYLINE.") +
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
        document.title = n.title + " | SKYLINE";
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
                    "<h2>Điểm nổi bật</h2>" +
                    "<p>SKYLINE kết hợp nội dung giải trí trên chuyến bay với tính năng mạng xã hội: hành khách có thể xem, nghe, bình luận, theo dõi kênh yêu thích và mua sắm ngay khi đang bay.</p>" +
                    '<blockquote>“Mỗi chuyến bay là vài giờ khách hàng sẵn sàng khám phá nội dung mới.”</blockquote>' +
                    "<p>Doanh nghiệp có thể mở kênh, đăng video giới thiệu sản phẩm và gắn sản phẩm vào nội dung để khách đặt hàng chỉ với một chạm.</p>" +
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
                pageHead("phone", "Liên hệ & hợp tác", "Hãng bay, nhà sản xuất nội dung và doanh nghiệp muốn mở gian hàng trên SKYLINE.") +
                '<div class="contact">' +
                    '<div class="contact__info">' +
                        '<div class="panel info-card">' + icon("map") + "<div><strong>Địa chỉ</strong><p>" + esc(s.address) + "</p></div></div>" +
                        '<div class="panel info-card">' + icon("phone") + '<div><strong>Điện thoại</strong><p><a href="tel:+842839333249">' + esc(s.phone) + "</a></p></div></div>" +
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
                            "<option>Mở kênh / gian hàng doanh nghiệp</option><option>Bán vé bay, tour trên SKYLINE</option><option>Cung cấp nội dung (phim, podcast…)</option><option>Quảng cáo trên chuyến bay</option><option>Hợp tác hãng bay</option><option>Khác</option>" +
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
        document.title = (q ? q + " - " : "") + "Tìm kiếm | SKYLINE";

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
            if ((el = e.target.closest("[data-video]"))) {
                el.classList.toggle("is-playing");
                return;
            }
            if ((el = e.target.closest("[data-action]"))) {
                var msg = {
                    "send-contact": "Đã gửi yêu cầu. Skyline Media sẽ liên hệ lại trong 24 giờ.",
                    "send-feedback": "Cảm ơn góp ý của bạn! SKYLINE sẽ phản hồi qua email.",
                    "post": "Đã đăng trải nghiệm của bạn.",
                    "buy-wifi": "Đã chọn gói Wi-Fi. Kết nối mạng SKYLINE-WIFI trên máy bay để sử dụng."
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
