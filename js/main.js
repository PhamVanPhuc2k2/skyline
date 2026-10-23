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

    // Thẻ video/audio dạng lưới: video 16:9, audio vuông có nút phát nền
    function mediaCard(m) {
        var ch = channelOf(m);
        var audio = m.kind === "audio";
        return '<article class="media-card' + (audio ? " media-card--audio" : "") + '" data-filter="' + esc(m.group + "|" + m.genre) + '">' +
            '<a class="thumb ' + (audio ? "thumb--square" : "thumb--video") + '" href="' + link("media", m.id) + '">' +
                '<img src="' + img(m.id, audio ? 400 : 640, audio ? 400 : 360) + '" alt="" loading="lazy">' +
                '<span class="thumb__time">' + esc(m.duration) + "</span>" +
                (m.products && m.products.length ? '<span class="thumb__tag">' + icon("bag") + m.products.length + " sản phẩm</span>" : "") +
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
        var sub = isProduct ? SL.price(item.price) : esc(item.group) + " · " + esc(item.duration);
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
                '<div class="price"><strong>' + SL.price(p.price) + "</strong>" + (p.oldPrice ? "<del>" + SL.price(p.oldPrice) + "</del>" : "") + "</div>" +
                '<div class="product-card__meta">' + stars(p.rating) + "<span>Đã bán " + SL.compact(p.sold) + "</span></div>" +
                '<button class="btn btn--accent btn--block btn--sm" type="button" data-cart="' + p.id + '">' + icon("cart") + "Thêm vào giỏ</button>" +
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
            ? '<a class="btn btn--accent" href="' + href + '">' + icon("bag") + "Mua ngay · " + SL.price(item.price) + "</a>" +
              '<button class="btn btn--glass" type="button" data-cart="' + item.id + '">' + icon("cart") + "Thêm vào giỏ</button>"
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

    function chips(list, active) {
        return '<div class="chips" role="tablist">' + list.map(function (f) {
            return '<button type="button" class="chip' + (f === active ? " active" : "") + '" data-chip="' + esc(f) + '">' + esc(f) + "</button>";
        }).join("") + "</div>";
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

    /* ================= Trang chủ ================= */

    function utilityBlock() {
        var utils = [
            { icon: "plane", label: "Tra cứu chuyến bay" },
            { icon: "globe", label: "Wi-Fi trên máy bay" },
            { icon: "store", label: "Phòng chờ & fast-track" },
            { icon: "map", label: "Cẩm nang điểm đến" }
        ];
        return '<div class="panel utility">' +
            '<div class="panel__head"><h2>' + icon("plane") + "Tiện ích chuyến bay</h2></div>" +
            '<form class="flight-form" onsubmit="return false">' +
                '<input type="text" placeholder="Số hiệu chuyến bay, VD: VN 220" aria-label="Số hiệu chuyến bay">' +
                '<button class="btn btn--primary btn--sm" type="submit">Tra cứu</button>' +
            "</form>" +
            '<div class="utility__grid">' + utils.map(function (u) {
                return '<a class="utility__item" href="chuyen-muc.html?c=mua-sam&f=D%E1%BB%8Bch%20v%E1%BB%A5%20s%C3%A2n%20bay">' + icon(u.icon) + "<span>" + u.label + "</span></a>";
            }).join("") + "</div>" +
        "</div>";
    }

    function renderHome() {
        var videos = D.media.filter(function (m) { return m.kind === "video"; });
        var audios = D.media.filter(function (m) { return m.kind === "audio"; });
        var featured = videos.filter(function (m) { return m.featured; })[0] || videos[0];
        var rest = videos.filter(function (m) { return m !== featured; });
        var topAudio = audios.slice().sort(function (a, b) { return b.views - a.views; });

        page.innerHTML =
            '<div class="container">' +
                topGrid({
                    stack: rest.slice(0, 3).map(function (m) { return tile(m); }).join(""),
                    hero: hero(featured),
                    aside: commentPanel(D.comments),
                    row: rest.slice(3, 7).map(mediaCard).join("")
                }) +

                // Hàng dưới cùng theo bản vẽ: 3 khối rộng hẹp khác nhau
                '<div class="bottom-grid">' +
                    '<div class="panel">' +
                        '<div class="panel__head"><h2>' + icon("headphones") + 'Nghe nhiều</h2><a class="link" href="chuyen-muc.html?c=nghe">Tất cả</a></div>' +
                        '<div class="rank-list">' + topAudio.slice(0, 4).map(function (m, i) { return mediaRow(m, i + 1); }).join("") + "</div>" +
                    "</div>" +
                    '<div class="panel">' +
                        '<div class="panel__head"><h2>' + icon("bag") + 'Mua sắm trên chuyến bay</h2><a class="link" href="chuyen-muc.html?c=mua-sam">Vào cửa hàng</a></div>' +
                        '<div class="product-grid product-grid--3">' + D.products.slice(0, 3).map(productCard).join("") + "</div>" +
                    "</div>" +
                    utilityBlock() +
                "</div>" +

                shelf("Line-up mới tháng 11", "line-up-moi.html",
                    D.media.filter(function (m) { return m.lineup; }).map(mediaCard).join("")) +
                shelf("Podcast & sách nói", "chuyen-muc.html?c=nghe", audios.map(mediaCard).join("")) +

                '<section class="section">' + sectionHead("Kênh nổi bật") +
                    '<div class="channel-grid">' + D.channels.map(channelCard).join("") + "</div>" +
                "</section>" +

                '<section class="section">' + sectionHead("Tin tức", "tin-tuc.html") +
                    '<div class="news-grid">' + D.news.slice(0, 3).map(newsCard).join("") + "</div>" +
                "</section>" +
            "</div>";
    }

    function channelCard(c) {
        return '<article class="channel-card">' +
            '<a href="' + link("channel", c.id) + '">' + avatar(c.name, "lg") + "</a>" +
            '<h3><a href="' + link("channel", c.id) + '">' + esc(c.name) + "</a>" + verified(c) + "</h3>" +
            "<small>" + esc(c.type) + " · " + SL.compact(c.followers) + " theo dõi</small>" +
            '<button class="btn btn--outline btn--sm" type="button" data-follow>Theo dõi</button>' +
        "</article>";
    }

    function newsCard(n) {
        return '<article class="news-card">' +
            '<a class="thumb thumb--video" href="' + link("news", n.id) + '"><img src="' + img(n.id, 640, 360) + '" alt="" loading="lazy"></a>' +
            '<span class="news-card__cat">' + esc(n.cat) + " · " + esc(n.date) + "</span>" +
            '<h3><a href="' + link("news", n.id) + '">' + esc(n.title) + "</a></h3>" +
            "<p>" + esc(n.excerpt) + "</p>" +
        "</article>";
    }

    /* ================= Chuyên mục (Xem / Nghe / Mua sắm) ================= */

    function renderCategory() {
        var cat = byId(D.categories, SL.param("c")) || D.categories[0];
        var activeFilter = SL.param("f") || "Tất cả";
        var isShop = cat.id === "mua-sam";
        document.title = cat.name + " | SKYLINE";

        var top, grid;
        if (isShop) {
            var products = D.products.slice().sort(function (a, b) { return discount(b) - discount(a); });
            var reviews = D.comments.filter(function (c) { return byId(D.products, c.media); });
            top = topGrid({
                stack: products.slice(1, 4).map(function (p) { return tile(p, "product"); }).join(""),
                hero: hero(products[0], { product: true, badge: "Ưu đãi lớn nhất", cover: cat.cover }),
                aside: commentPanel(reviews.concat(D.comments.slice(0, 5)), "Khách bay nói gì"),
                row: products.slice(4, 8).map(productCard).join("")
            });
            grid = '<div class="product-grid">' + D.products.map(productCard).join("") + "</div>";
        } else {
            var items = D.media.filter(function (m) { return m.cat === cat.id; });
            var featured = items.filter(function (m) { return m.featured; })[0] || items[0];
            var rest = items.filter(function (m) { return m !== featured; });
            var ids = items.map(function (m) { return m.id; });
            top = topGrid({
                stack: rest.slice(0, 3).map(function (m) { return tile(m); }).join(""),
                hero: hero(featured, { cover: cat.cover }),
                aside: commentPanel(D.comments.filter(function (c) { return ids.indexOf(c.media) > -1; }).concat(D.comments).slice(0, 8)),
                row: rest.slice(3, 7).map(mediaCard).join("")
            });
            grid = '<div class="media-grid">' + items.map(mediaCard).join("") + "</div>";
        }

        page.innerHTML =
            '<div class="container">' +
                '<header class="page-head">' +
                    '<span class="page-head__icon">' + icon(cat.icon) + "</span>" +
                    "<div><h1>" + esc(cat.title) + "</h1><p>" + esc(cat.desc) + "</p></div>" +
                "</header>" +
                top +
                '<section class="section" id="all">' +
                    sectionHead("Tất cả trong " + esc(cat.name)) +
                    chips(cat.filters, activeFilter) +
                    '<div data-filter-target>' + grid + "</div>" +
                    '<div data-empty hidden>' + emptyState("Chưa có nội dung trong mục này.") + "</div>" +
                "</section>" +
            "</div>";

        applyFilter(activeFilter);
    }

    // Lọc thẻ trong lưới theo chip (so với data-filter: nhóm|thể loại hoặc loại sản phẩm)
    function applyFilter(value) {
        var cards = page.querySelectorAll("[data-filter-target] [data-filter]");
        var shown = 0;
        cards.forEach(function (card) {
            var ok = value === "Tất cả" || card.getAttribute("data-filter").split("|").indexOf(value) > -1;
            card.hidden = !ok;
            if (ok) shown++;
        });
        page.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-chip") === value); });
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
                    '<div class="wave" aria-hidden="true">' + new Array(48).join("<span></span>") + "</div>" +
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
                '<button class="btn btn--accent btn--sm" type="button" data-cart="' + p.id + '">' + icon("cart") + "Thêm</button>" +
            "</div>" +
        "</div>";
    }

    function commentForm() {
        return '<form class="comment-form" onsubmit="return false">' +
            avatar("Bạn", "sm") +
            '<input type="text" placeholder="Viết bình luận…" aria-label="Viết bình luận">' +
            '<button class="btn btn--primary btn--sm" type="submit">Gửi</button>' +
        "</form>";
    }

    /* ================= Trang sản phẩm ================= */

    function renderProduct() {
        var p = byId(D.products, SL.param("id"));
        if (!p) return notFound();
        var ch = channelOf(p);
        var off = discount(p);
        var inMedia = D.media.filter(function (m) { return (m.products || []).indexOf(p.id) > -1; });
        var reviews = D.comments.filter(function (c) { return c.media === p.id; }).concat(D.comments.slice(0, 3));
        var related = D.products.filter(function (x) { return x.id !== p.id; }).slice(0, 4);
        document.title = p.name + " | SKYLINE";

        page.innerHTML =
            '<div class="container">' +
                '<nav class="breadcrumb"><a href="index.html">Trang chủ</a>' + icon("chevron") +
                    '<a href="chuyen-muc.html?c=mua-sam">Mua sắm</a>' + icon("chevron") + "<span>" + esc(p.cat) + "</span></nav>" +
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
                        '<div class="product__stats">' + stars(p.rating) + "<span>" + reviews.length + " đánh giá</span><span>Đã bán " + p.sold.toLocaleString("vi-VN") + "</span></div>" +
                        '<div class="price price--lg"><strong>' + SL.price(p.price) + "</strong>" +
                            (p.oldPrice ? "<del>" + SL.price(p.oldPrice) + '</del><span class="sale-tag sale-tag--inline">-' + off + "%</span>" : "") + "</div>" +
                        '<fieldset class="options"><legend>Nhận hàng</legend>' +
                            option("Nhận tại cửa ra máy bay", "Đặt trước 3 giờ khi bay", true) +
                            option("Giao tại sân bay đến", "Nhân viên chờ ở sảnh đến") +
                            option("Giao tận nhà", "2–3 ngày, miễn phí từ 300.000₫") +
                        "</fieldset>" +
                        '<div class="qty"><span>Số lượng</span><div class="qty__box"><button type="button" data-qty="-1">−</button><input type="text" value="1" aria-label="Số lượng" data-qty-input><button type="button" data-qty="1">+</button></div></div>' +
                        '<div class="product__buy">' +
                            '<button class="btn btn--outline btn--lg" type="button" data-cart="' + p.id + '">' + icon("cart") + "Thêm vào giỏ</button>" +
                            '<button class="btn btn--accent btn--lg" type="button" data-cart="' + p.id + '">Mua ngay</button>' +
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
                        "<h2>Mô tả sản phẩm</h2><p>" + esc(p.desc) + "</p>" +
                        "<p>Sản phẩm được bán bởi " + esc(ch.name) + " trên SKYLINE. Đặt hàng ngay trong chuyến bay qua màn hình ghế ngồi hoặc điện thoại kết nối Wi-Fi trên máy bay; thanh toán bằng thẻ, ví điện tử hoặc khi nhận hàng.</p>" +
                        '<h2 class="mt">Đánh giá từ khách bay</h2>' +
                        '<ul class="comment-list">' + reviews.map(function (c) { return commentItem(c, false); }).join("") + "</ul>" +
                    "</section>" +
                    (inMedia.length
                        ? '<aside><h2 class="side-title">Xuất hiện trong</h2><div class="next-list">' + inMedia.map(function (m) { return mediaRow(m); }).join("") + "</div></aside>"
                        : "") +
                "</div>" +

                '<section class="section">' + sectionHead("Có thể bạn cũng thích", "chuyen-muc.html?c=mua-sam") +
                    '<div class="product-grid">' + related.map(productCard).join("") + "</div></section>" +
            "</div>";
    }

    function option(title, sub, checked) {
        return '<label class="option"><input type="radio" name="ship"' + (checked ? " checked" : "") + "><span><strong>" + title + "</strong><small>" + sub + "</small></span></label>";
    }

    /* ================= Trang kênh ================= */

    function renderChannel() {
        var ch = byId(D.channels, SL.param("id"));
        if (!ch) return notFound();
        var media = D.media.filter(function (m) { return m.channel === ch.id; });
        var videos = media.filter(function (m) { return m.kind === "video"; });
        var audios = media.filter(function (m) { return m.kind === "audio"; });
        var products = D.products.filter(function (p) { return p.channel === ch.id; });
        document.title = ch.name + " | SKYLINE";

        var tabs = [
            { id: "home", label: "Trang chủ" },
            { id: "video", label: "Video", count: videos.length },
            { id: "audio", label: "Nghe", count: audios.length },
            { id: "shop", label: "Cửa hàng", count: products.length },
            { id: "about", label: "Giới thiệu" }
        ];
        var current = SL.param("tab") || "home";
        var none = emptyState("Kênh chưa đăng nội dung ở mục này.");

        var panes = {
            home: (media.length ? '<div class="media-grid">' + media.slice(0, 8).map(mediaCard).join("") + "</div>" : "") +
                  (products.length ? '<section class="section">' + sectionHead("Sản phẩm của kênh") + '<div class="product-grid">' + products.map(productCard).join("") + "</div></section>" : "") ||
                  none,
            video: videos.length ? '<div class="media-grid">' + videos.map(mediaCard).join("") + "</div>" : none,
            audio: audios.length ? '<div class="media-grid">' + audios.map(mediaCard).join("") + "</div>" : none,
            shop: products.length ? '<div class="product-grid">' + products.map(productCard).join("") + "</div>" : none,
            about: '<div class="panel about"><h2>Giới thiệu</h2><p>' + esc(ch.desc) + "</p>" +
                   "<ul><li>" + icon("store") + esc(ch.type) + "</li><li>" + icon("user") + ch.followers.toLocaleString("vi-VN") + " người theo dõi</li><li>" + icon("clock") + "Tham gia 03/2026</li></ul></div>"
        };

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
                    '<nav class="tabs" role="tablist">' + tabs.map(function (t) {
                        return '<button type="button" class="tabs__item' + (t.id === current ? " active" : "") + '" data-tab="' + t.id + '">' + t.label + (t.count ? " <small>" + t.count + "</small>" : "") + "</button>";
                    }).join("") + "</nav>" +
                    Object.keys(panes).map(function (k) {
                        return '<div class="tab-pane" data-pane="' + k + '"' + (k === current ? "" : " hidden") + ">" + panes[k] + "</div>";
                    }).join("") +
                "</div>" +
            "</div>";
    }

    /* ================= Line-up mới ================= */

    function renderLineup() {
        var months = ["Tháng 11/2026", "Tháng 10/2026", "Tháng 9/2026"];
        var lineup = D.media.filter(function (m) { return m.kind === "video"; });
        page.innerHTML =
            '<div class="container">' +
                '<header class="page-head">' +
                    '<span class="page-head__icon">' + icon("sparkle") + "</span>" +
                    "<div><h1>Line-up mới</h1><p>Phim và series vừa cập nhật lên hệ thống giải trí trên các chuyến bay.</p></div>" +
                "</header>" +
                '<nav class="tabs" role="tablist">' + months.map(function (mo, i) {
                    return '<button type="button" class="tabs__item' + (i ? "" : " active") + '" data-tab="m' + i + '">' + mo + "</button>";
                }).join("") + "</nav>" +
                months.map(function (mo, i) {
                    // Mockup: các tháng cũ dùng lại danh sách theo thứ tự khác
                    var list = i ? lineup.slice(i * 3).concat(lineup.slice(0, i * 3)) : lineup;
                    return '<div class="tab-pane" data-pane="m' + i + '"' + (i ? " hidden" : "") + ">" +
                        '<div class="poster-grid">' + list.map(posterCard).join("") + "</div></div>";
                }).join("") +
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

    /* ================= Tin tức ================= */

    function renderNews() {
        var first = D.news[0];
        var cats = ["Tất cả"].concat(D.news.map(function (n) { return n.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
        page.innerHTML =
            '<div class="container">' +
                '<header class="page-head"><span class="page-head__icon">' + icon("news") + "</span><div><h1>Tin tức</h1><p>Line-up, sự kiện, mẹo bay và câu chuyện kinh doanh trên SKYLINE.</p></div></header>" +
                '<a class="news-lead" href="' + link("news", first.id) + '">' +
                    '<img src="' + img(first.id, 1200, 600) + '" alt="">' +
                    '<span class="news-lead__body"><span class="pill">' + esc(first.cat) + "</span><strong>" + esc(first.title) + "</strong><small>" + esc(first.excerpt) + "</small></span>" +
                "</a>" +
                '<section class="section">' + chips(cats, "Tất cả") +
                    '<div class="news-grid" data-filter-target>' + D.news.map(function (n) {
                        return newsCard(n).replace('<article class="news-card">', '<article class="news-card" data-filter="' + esc(n.cat) + '">');
                    }).join("") + "</div>" +
                    '<div data-empty hidden>' + emptyState("Chưa có bài viết.") + "</div>" +
                "</section>" +
            "</div>";
    }

    function renderArticle() {
        var n = byId(D.news, SL.param("id"));
        if (!n) return notFound();
        document.title = n.title + " | SKYLINE";
        var related = D.news.filter(function (x) { return x.id !== n.id; }).slice(0, 4);
        page.innerHTML =
            '<div class="container article-layout">' +
                '<article class="article">' +
                    '<nav class="breadcrumb"><a href="tin-tuc.html">Tin tức</a>' + icon("chevron") + "<span>" + esc(n.cat) + "</span></nav>" +
                    "<h1>" + esc(n.title) + "</h1>" +
                    '<p class="article__meta">' + icon("clock") + esc(n.date) + " · Skyline Media</p>" +
                    '<p class="article__lead">' + esc(n.excerpt) + "</p>" +
                    '<img class="article__cover" src="' + img(n.id, 1200, 640) + '" alt="">' +
                    "<p>Nội dung bài viết minh họa cho mockup. Phần thân bài sẽ do biên tập viên nhập trong CMS, gồm đoạn văn, ảnh, video và có thể gắn sản phẩm hoặc nội dung liên quan ngay trong bài.</p>" +
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
                '<header class="page-head"><span class="page-head__icon">' + icon("phone") + "</span><div><h1>Liên hệ & hợp tác</h1><p>Hãng bay, nhà sản xuất nội dung và doanh nghiệp muốn mở gian hàng trên SKYLINE.</p></div></header>" +
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
                            "<option>Mở kênh / gian hàng doanh nghiệp</option><option>Cung cấp nội dung (phim, podcast…)</option><option>Quảng cáo trên chuyến bay</option><option>Hợp tác hãng bay</option><option>Khác</option>" +
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
        var total = media.length + products.length + channels.length;
        document.title = (q ? q + " - " : "") + "Tìm kiếm | SKYLINE";

        page.innerHTML =
            '<div class="container">' +
                '<form class="search search--page" action="tim-kiem.html" role="search">' +
                    '<input class="search__input" type="search" name="q" value="' + esc(q) + '" placeholder="Tìm phim, podcast, sản phẩm, kênh…" aria-label="Tìm kiếm" autofocus>' +
                    '<button class="search__btn" type="submit" aria-label="Tìm">' + icon("search") + "</button>" +
                "</form>" +
                (q ? '<p class="muted">' + total + " kết quả cho “" + esc(q) + "”</p>" : "") +
                (channels.length ? '<section class="section">' + sectionHead("Kênh") + '<div class="channel-grid">' + channels.map(channelCard).join("") + "</div></section>" : "") +
                (media.length ? '<section class="section">' + sectionHead("Video & audio") + '<div class="media-grid">' + media.map(mediaCard).join("") + "</div></section>" : "") +
                (products.length ? '<section class="section">' + sectionHead("Sản phẩm") + '<div class="product-grid">' + products.map(productCard).join("") + "</div></section>" : "") +
                (q && !total ? emptyState("Không tìm thấy kết quả. Thử từ khóa khác, ví dụ “phim”, “podcast”, “đặc sản”.") : "") +
                (!q ? '<section class="section">' + sectionHead("Gợi ý tìm kiếm") +
                    chips(["Phim Việt", "Podcast", "Ngủ ngon", "Miễn thuế", "Đặc sản", "Phòng chờ"], "").replace(/data-chip=/g, "data-suggest=") + "</section>" : "") +
            "</div>";
    }

    /* ================= Tương tác trong trang ================= */

    function bindPageEvents() {
        page.addEventListener("click", function (e) {
            var el;

            // Tab: bình luận Hay/Nhiều, tab kênh, tab tháng line-up
            if ((el = e.target.closest("[data-tab]"))) {
                var scope = el.closest(".panel, .container");
                var id = el.getAttribute("data-tab");
                el.parentNode.querySelectorAll("[data-tab]").forEach(function (b) { b.classList.toggle("active", b === el); });
                scope.querySelectorAll("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== id; });
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
            if ((el = e.target.closest("[data-action='send-contact']"))) {
                SL.toast("Đã gửi yêu cầu. Skyline Media sẽ liên hệ lại trong 24 giờ.");
            }
        });
    }

    var RENDER = {
        home: renderHome,
        category: renderCategory,
        watch: renderWatch,
        product: renderProduct,
        channel: renderChannel,
        "line-up": renderLineup,
        news: renderNews,
        article: renderArticle,
        contact: renderContact,
        search: renderSearch
    };

    var render = RENDER[document.body.getAttribute("data-page")];
    if (render) render();
    bindPageEvents();
})();
