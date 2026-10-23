/**
 * TỰ ĐỘNG TẠO bởi scripts/build_data.py — không sửa tay file này.
 * Sửa nội dung ở data/content.json rồi chạy lại script.
 */
window.DATA = {
  "site": {
    "name": "SKYLINE",
    "tagline": "Mạng xã hội trên không cho khách bay & doanh nghiệp",
    "company": "Skyline Media",
    "address": "Tầng 7, 53 Phó Đức Chính, Phường Nguyễn Thái Bình, Quận 1, TP. Hồ Chí Minh, Việt Nam",
    "phone": "(+84) 28 3933 3249",
    "email": "content@skyline.vn"
  },
  "categories": [
    {
      "id": "xem",
      "name": "Xem",
      "icon": "play",
      "title": "Phim & Series trên mọi chuyến bay",
      "desc": "Kho phim chiếu rạp, series và phim tài liệu được tuyển chọn cho màn hình ghế ngồi và thiết bị cá nhân.",
      "cover": "xem-cover",
      "filters": [
        "Tất cả",
        "Phim nước ngoài",
        "Series nước ngoài",
        "Phim Việt",
        "Series Việt",
        "Hành động",
        "Rom-com",
        "Gia đình",
        "Hoạt hình",
        "Tài liệu"
      ]
    },
    {
      "id": "nghe",
      "name": "Nghe",
      "icon": "headphones",
      "title": "Nghe trọn hành trình",
      "desc": "Âm nhạc, podcast, sách nói và nội dung thư giãn giúp bạn ngủ ngon ở độ cao 10.000 mét.",
      "cover": "nghe-cover",
      "filters": [
        "Tất cả",
        "Âm nhạc",
        "Podcast",
        "Sách nói",
        "Thiền & Ngủ ngon"
      ]
    },
    {
      "id": "mua-sam",
      "name": "Mua sắm",
      "icon": "bag",
      "title": "Mua sắm & tiện ích cho khách bay",
      "desc": "Hàng miễn thuế, đặc sản vùng miền, dịch vụ sân bay và ưu đãi du lịch, giao tận nơi khi hạ cánh.",
      "cover": "muasam-cover",
      "filters": [
        "Tất cả",
        "Ưu đãi bay",
        "Miễn thuế",
        "Đặc sản",
        "Dịch vụ sân bay",
        "Du lịch"
      ]
    }
  ],
  "channels": [
    {
      "id": "skyline",
      "name": "Skyline Media",
      "type": "Nhà phân phối nội dung",
      "verified": true,
      "followers": 128000,
      "desc": "Đơn vị cung cấp nội dung giải trí trên chuyến bay cho các hãng hàng không tại Việt Nam và khu vực."
    },
    {
      "id": "bay-vui",
      "name": "Bay Vui Travel",
      "type": "Nhà sáng tạo",
      "verified": true,
      "followers": 54200,
      "desc": "Review sân bay, hạng ghế và kinh nghiệm bay tiết kiệm."
    },
    {
      "id": "dac-san-3-mien",
      "name": "Đặc Sản 3 Miền",
      "type": "Doanh nghiệp",
      "verified": true,
      "followers": 31800,
      "desc": "Đặc sản chính gốc từ các địa phương, đóng gói quà tặng cho khách bay."
    },
    {
      "id": "duty-free-sg",
      "name": "Duty Free Sài Gòn",
      "type": "Doanh nghiệp",
      "verified": true,
      "followers": 76500,
      "desc": "Cửa hàng miễn thuế: mỹ phẩm, nước hoa, đồng hồ, rượu vang. Đặt trước, nhận tại cửa ra máy bay."
    },
    {
      "id": "song-cham",
      "name": "Sống Chậm Podcast",
      "type": "Nhà sáng tạo",
      "verified": false,
      "followers": 22900,
      "desc": "Podcast về sống chậm, du lịch một mình và chăm sóc tinh thần."
    },
    {
      "id": "lounge-plus",
      "name": "Lounge Plus",
      "type": "Doanh nghiệp",
      "verified": true,
      "followers": 18400,
      "desc": "Phòng chờ hạng thương gia, fast-track và dịch vụ đưa đón sân bay."
    }
  ],
  "media": [
    {
      "id": "v01",
      "kind": "video",
      "cat": "xem",
      "group": "Phim nước ngoài",
      "genre": "Hành động",
      "title": "Vùng Trời Cuối Cùng",
      "channel": "skyline",
      "duration": "2:08:14",
      "views": 1840000,
      "date": "2 ngày trước",
      "featured": true,
      "lineup": true,
      "products": [
        "p02",
        "p05"
      ],
      "desc": "Một phi công thử nghiệm buộc phải hạ cánh khẩn cấp xuống vùng núi băng, nơi bí mật quân sự bị chôn vùi suốt ba thập kỷ."
    },
    {
      "id": "v02",
      "kind": "video",
      "cat": "xem",
      "group": "Phim Việt",
      "genre": "Gia đình",
      "title": "Chuyến Bay Về Nhà",
      "channel": "skyline",
      "duration": "1:52:40",
      "views": 932000,
      "date": "5 ngày trước",
      "lineup": true,
      "products": [
        "p01",
        "p03"
      ],
      "desc": "Ba anh em xa quê hẹn nhau trên cùng một chuyến bay đêm 30 Tết."
    },
    {
      "id": "v03",
      "kind": "video",
      "cat": "xem",
      "group": "Series nước ngoài",
      "genre": "Tội ác",
      "title": "Hành Lang Số 7 — Mùa 2",
      "channel": "skyline",
      "duration": "10 tập",
      "views": 2210000,
      "date": "1 tuần trước",
      "lineup": true,
      "products": [],
      "desc": "Điều tra viên sân bay lần theo đường dây buôn lậu xuyên lục địa."
    },
    {
      "id": "v04",
      "kind": "video",
      "cat": "xem",
      "group": "Phim nước ngoài",
      "genre": "Rom-com",
      "title": "Ghế 12A",
      "channel": "skyline",
      "duration": "1:41:05",
      "views": 671000,
      "date": "1 tuần trước",
      "lineup": true,
      "products": [
        "p04"
      ],
      "desc": "Hai người lạ liên tục bị xếp ngồi cạnh nhau trên mọi chuyến bay trong một năm."
    },
    {
      "id": "v05",
      "kind": "video",
      "cat": "xem",
      "group": "Phim nước ngoài",
      "genre": "Hoạt hình",
      "title": "Mây Nhỏ Phiêu Lưu",
      "channel": "skyline",
      "duration": "1:28:30",
      "views": 1120000,
      "date": "2 tuần trước",
      "lineup": true,
      "products": [],
      "desc": "Đám mây nhỏ muốn trở thành cơn mưa đầu tiên của mùa hạ."
    },
    {
      "id": "v06",
      "kind": "video",
      "cat": "xem",
      "group": "Phim Việt",
      "genre": "Tài liệu",
      "title": "Hang Động Cuối Trời",
      "channel": "skyline",
      "duration": "58:12",
      "views": 384000,
      "date": "3 tuần trước",
      "products": [
        "p07"
      ],
      "desc": "Hành trình 21 ngày xuyên hệ thống hang động Quảng Bình."
    },
    {
      "id": "v07",
      "kind": "video",
      "cat": "xem",
      "group": "Series Việt",
      "genre": "Phong cách sống",
      "title": "Ăn Gì Ở Sân Bay",
      "channel": "bay-vui",
      "duration": "8 tập",
      "views": 512000,
      "date": "4 ngày trước",
      "products": [
        "p01",
        "p08"
      ],
      "desc": "Đánh giá món ăn tại 8 sân bay lớn của Việt Nam."
    },
    {
      "id": "v08",
      "kind": "video",
      "cat": "xem",
      "group": "Series nước ngoài",
      "genre": "Anime",
      "title": "Học Viện Phi Công",
      "channel": "skyline",
      "duration": "12 tập",
      "views": 1460000,
      "date": "6 ngày trước",
      "lineup": true,
      "products": [],
      "desc": "Năm học viên trẻ và giấc mơ chinh phục bầu trời."
    },
    {
      "id": "v09",
      "kind": "video",
      "cat": "xem",
      "group": "Phim Việt",
      "genre": "Kinh dị",
      "title": "Chuyến Bay 0 Giờ",
      "channel": "skyline",
      "duration": "1:46:22",
      "views": 803000,
      "date": "3 tuần trước",
      "products": [],
      "desc": "Chuyến bay cuối cùng trong đêm và hành khách không có tên trong danh sách."
    },
    {
      "id": "v10",
      "kind": "video",
      "cat": "xem",
      "group": "Series Việt",
      "genre": "Rom-com",
      "title": "Tiếp Viên Tập Sự",
      "channel": "skyline",
      "duration": "16 tập",
      "views": 1980000,
      "date": "1 tháng trước",
      "products": [
        "p04"
      ],
      "desc": "Những chuyện dở khóc dở cười của nhóm tiếp viên mới vào nghề."
    },
    {
      "id": "v11",
      "kind": "video",
      "cat": "xem",
      "group": "Series Việt",
      "genre": "Phong cách sống",
      "title": "Review Hạng Thương Gia 5 Hãng Bay",
      "channel": "bay-vui",
      "duration": "24:10",
      "views": 296000,
      "date": "2 ngày trước",
      "products": [
        "p06"
      ],
      "desc": "So sánh ghế, suất ăn và phòng chờ của 5 hãng bay nội địa."
    },
    {
      "id": "v12",
      "kind": "video",
      "cat": "xem",
      "group": "Phim nước ngoài",
      "genre": "Hành động",
      "title": "Đường Băng Đỏ",
      "channel": "skyline",
      "duration": "2:01:47",
      "views": 1270000,
      "date": "1 tháng trước",
      "products": [],
      "desc": "Đặc nhiệm giải cứu con tin trên đường băng bị phong tỏa."
    },
    {
      "id": "a01",
      "kind": "audio",
      "cat": "nghe",
      "group": "Âm nhạc",
      "genre": "Âm nhạc",
      "title": "Lofi Trên Mây — Playlist cất cánh",
      "channel": "skyline",
      "duration": "1:12:00",
      "views": 640000,
      "date": "3 ngày trước",
      "featured": true,
      "products": [],
      "desc": "Giai điệu lofi nhẹ nhàng cho lúc cất cánh và hạ cánh."
    },
    {
      "id": "a02",
      "kind": "audio",
      "cat": "nghe",
      "group": "Podcast",
      "genre": "Podcast",
      "title": "Một Mình Đi Nhật — Tập 14",
      "channel": "song-cham",
      "duration": "42:18",
      "views": 128000,
      "date": "1 tuần trước",
      "products": [
        "p07"
      ],
      "desc": "Chuyện xin visa, đặt vé rẻ và lịch trình 10 ngày ở Kansai."
    },
    {
      "id": "a03",
      "kind": "audio",
      "cat": "nghe",
      "group": "Sách nói",
      "genre": "Sách nói",
      "title": "Nhà Giả Kim (Sách nói)",
      "channel": "skyline",
      "duration": "5:36:00",
      "views": 412000,
      "date": "2 tuần trước",
      "products": [],
      "desc": "Bản sách nói đầy đủ, giọng đọc truyền cảm."
    },
    {
      "id": "a04",
      "kind": "audio",
      "cat": "nghe",
      "group": "Thiền & Ngủ ngon",
      "genre": "Thiền & Ngủ ngon",
      "title": "Ngủ Ngon Trên Chuyến Bay Đêm",
      "channel": "song-cham",
      "duration": "60:00",
      "views": 287000,
      "date": "5 ngày trước",
      "products": [
        "p06"
      ],
      "desc": "Âm thanh trắng và hướng dẫn thở giúp ngủ sâu khi bay đường dài."
    },
    {
      "id": "a05",
      "kind": "audio",
      "cat": "nghe",
      "group": "Âm nhạc",
      "genre": "Âm nhạc",
      "title": "Nhạc Trịnh — Những Bản Tình Ca",
      "channel": "skyline",
      "duration": "58:44",
      "views": 905000,
      "date": "1 tháng trước",
      "products": [],
      "desc": "Tuyển tập nhạc Trịnh Công Sơn qua các giọng ca mới."
    },
    {
      "id": "a06",
      "kind": "audio",
      "cat": "nghe",
      "group": "Podcast",
      "genre": "Podcast",
      "title": "Kinh Doanh Hàng Không 101",
      "channel": "bay-vui",
      "duration": "35:02",
      "views": 76000,
      "date": "4 ngày trước",
      "products": [],
      "desc": "Hãng bay kiếm tiền từ đâu? Phỏng vấn chuyên gia ngành."
    },
    {
      "id": "a07",
      "kind": "audio",
      "cat": "nghe",
      "group": "Thiền & Ngủ ngon",
      "genre": "Thiền & Ngủ ngon",
      "title": "Thiền 10 Phút Chống Say Máy Bay",
      "channel": "song-cham",
      "duration": "10:00",
      "views": 154000,
      "date": "2 tuần trước",
      "products": [],
      "desc": "Bài tập hít thở giảm chóng mặt, buồn nôn khi gặp nhiễu động."
    },
    {
      "id": "a08",
      "kind": "audio",
      "cat": "nghe",
      "group": "Sách nói",
      "genre": "Sách nói",
      "title": "Đắc Nhân Tâm (Sách nói)",
      "channel": "skyline",
      "duration": "7:12:00",
      "views": 520000,
      "date": "1 tháng trước",
      "products": [],
      "desc": "Phiên bản sách nói rút gọn cho chuyến bay dưới 2 giờ."
    }
  ],
  "products": [
    {
      "id": "p01",
      "name": "Hộp quà Đặc sản Huế 6 món",
      "cat": "Đặc sản",
      "channel": "dac-san-3-mien",
      "price": 389000,
      "oldPrice": 450000,
      "rating": 4.8,
      "sold": 2140,
      "desc": "Mè xửng, tôm chua, mắm ruốc, trà cung đình… đóng hộp quà, giao tại sân bay đến."
    },
    {
      "id": "p02",
      "name": "Nước hoa Aviator Eau de Parfum 100ml",
      "cat": "Miễn thuế",
      "channel": "duty-free-sg",
      "price": 2150000,
      "oldPrice": 2890000,
      "rating": 4.7,
      "sold": 860,
      "desc": "Giá miễn thuế, đặt trước khi bay, nhận tại cửa ra máy bay."
    },
    {
      "id": "p03",
      "name": "Cà phê Buôn Ma Thuột rang mộc 500g",
      "cat": "Đặc sản",
      "channel": "dac-san-3-mien",
      "price": 215000,
      "oldPrice": null,
      "rating": 4.9,
      "sold": 5320,
      "desc": "Robusta Cầu Đất – Buôn Ma Thuột rang mộc, xay theo yêu cầu."
    },
    {
      "id": "p04",
      "name": "Gối cổ memory foam du lịch",
      "cat": "Ưu đãi bay",
      "channel": "bay-vui",
      "price": 189000,
      "oldPrice": 259000,
      "rating": 4.6,
      "sold": 3870,
      "desc": "Gối chữ U cao su non, kèm bịt mắt và nút tai."
    },
    {
      "id": "p05",
      "name": "Đồng hồ Pilot Chronograph",
      "cat": "Miễn thuế",
      "channel": "duty-free-sg",
      "price": 6490000,
      "oldPrice": 7900000,
      "rating": 4.8,
      "sold": 214,
      "desc": "Mặt kính sapphire, chống nước 10ATM, bảo hành quốc tế 2 năm."
    },
    {
      "id": "p06",
      "name": "Vé phòng chờ thương gia Tân Sơn Nhất",
      "cat": "Dịch vụ sân bay",
      "channel": "lounge-plus",
      "price": 590000,
      "oldPrice": 750000,
      "rating": 4.5,
      "sold": 1290,
      "desc": "Sử dụng phòng chờ 3 giờ, buffet, tắm, wifi tốc độ cao."
    },
    {
      "id": "p07",
      "name": "Tour Phong Nha 2 ngày 1 đêm",
      "cat": "Du lịch",
      "channel": "bay-vui",
      "price": 1890000,
      "oldPrice": 2290000,
      "rating": 4.7,
      "sold": 640,
      "desc": "Đón tại sân bay Đồng Hới, động Phong Nha, Thiên Đường, lưu trú homestay."
    },
    {
      "id": "p08",
      "name": "Fast-track an ninh + đưa đón sân bay",
      "cat": "Dịch vụ sân bay",
      "channel": "lounge-plus",
      "price": 450000,
      "oldPrice": null,
      "rating": 4.6,
      "sold": 980,
      "desc": "Làm thủ tục ưu tiên, qua an ninh nhanh, xe đón tận cửa."
    }
  ],
  "users": [
    {
      "id": "u1",
      "name": "Minh Anh"
    },
    {
      "id": "u2",
      "name": "Hoàng Long"
    },
    {
      "id": "u3",
      "name": "Thu Trang"
    },
    {
      "id": "u4",
      "name": "Quốc Bảo"
    },
    {
      "id": "u5",
      "name": "Lan Phương"
    },
    {
      "id": "u6",
      "name": "Đức Huy"
    },
    {
      "id": "u7",
      "name": "Ngọc Hân"
    },
    {
      "id": "u8",
      "name": "Tuấn Kiệt"
    }
  ],
  "comments": [
    {
      "user": "u1",
      "media": "v01",
      "likes": 1240,
      "replies": 86,
      "time": "2 giờ trước",
      "text": "Xem trọn bộ trên chuyến SGN – HAN mà quên luôn giờ hạ cánh. Cảnh hạ cánh trên núi băng quá đỉnh!"
    },
    {
      "user": "u2",
      "media": "v02",
      "likes": 980,
      "replies": 54,
      "time": "5 giờ trước",
      "text": "Khóc thật sự ở đoạn ba anh em gặp nhau ở cửa ra. Ai bay Tết chắc đồng cảm."
    },
    {
      "user": "u3",
      "media": "a04",
      "likes": 760,
      "replies": 31,
      "time": "1 ngày trước",
      "text": "Bay đêm 12 tiếng đi Frankfurt, nghe cái này ngủ được 6 tiếng liền. Cảm ơn kênh!"
    },
    {
      "user": "u4",
      "media": "v11",
      "likes": 642,
      "replies": 120,
      "time": "1 ngày trước",
      "text": "Phần chấm điểm suất ăn hơi khắt khe, nhưng review phòng chờ thì chuẩn."
    },
    {
      "user": "u5",
      "media": "p01",
      "likes": 530,
      "replies": 18,
      "time": "2 ngày trước",
      "text": "Đặt trên máy bay, hạ cánh Huế là có người giao tận cửa ra. Tiện thật sự."
    },
    {
      "user": "u6",
      "media": "v03",
      "likes": 498,
      "replies": 77,
      "time": "2 ngày trước",
      "text": "Mùa 2 cài cắm tình tiết hay hơn mùa 1 nhiều. Hóng mùa 3."
    },
    {
      "user": "u7",
      "media": "a02",
      "likes": 377,
      "replies": 12,
      "time": "3 ngày trước",
      "text": "Nhờ tập này mà mình đặt được vé Osaka giá rẻ, cảm ơn chị host."
    },
    {
      "user": "u8",
      "media": "v08",
      "likes": 312,
      "replies": 25,
      "time": "4 ngày trước",
      "text": "Anime về phi công hiếm lắm, nét vẽ đẹp, nhạc phim hay."
    }
  ],
  "news": [
    {
      "id": "n01",
      "title": "Skyline Media đưa 40 phim mới lên hệ thống giải trí tháng 11",
      "cat": "Line-up",
      "date": "20/10/2026",
      "excerpt": "Danh sách phim chiếu trên các chuyến bay nội địa và quốc tế trong tháng 11 có nhiều tác phẩm Việt vừa ra rạp."
    },
    {
      "id": "n02",
      "title": "Ra mắt SKYLINE: xem, nghe, mua sắm ngay trên chuyến bay",
      "cat": "Sự kiện",
      "date": "15/10/2026",
      "excerpt": "Nền tảng mới cho phép hành khách bình luận, theo dõi nhà sáng tạo và đặt hàng giao tại sân bay đến."
    },
    {
      "id": "n03",
      "title": "5 mẹo để ngủ ngon trên chuyến bay đường dài",
      "cat": "Mẹo bay",
      "date": "10/10/2026",
      "excerpt": "Chọn ghế, giờ ăn, ánh sáng và âm thanh: những điều nhỏ giúp bạn hạ cánh tỉnh táo."
    },
    {
      "id": "n04",
      "title": "Doanh nghiệp đặc sản tăng 3 lần đơn hàng nhờ bán trên chuyến bay",
      "cat": "Kinh doanh",
      "date": "02/10/2026",
      "excerpt": "Mô hình gian hàng trên SKYLINE giúp thương hiệu địa phương tiếp cận khách bay mỗi ngày."
    },
    {
      "id": "n05",
      "title": "Phim Việt chiếm 35% lượt xem trên máy bay quý III",
      "cat": "Line-up",
      "date": "28/09/2026",
      "excerpt": "Phim gia đình và hài lãng mạn được khách nội địa chọn xem nhiều nhất."
    },
    {
      "id": "n06",
      "title": "Hướng dẫn đăng ký kênh doanh nghiệp trên SKYLINE",
      "cat": "Kinh doanh",
      "date": "20/09/2026",
      "excerpt": "Các bước xác minh, đăng sản phẩm và gắn sản phẩm vào video, podcast."
    }
  ]
};
