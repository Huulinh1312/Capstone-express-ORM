- Pinboard Frontend

- Frontend thuần HTML, CSS và JavaScript cho Capstone Express ORM.

- Link Swagger API : http://localhost:8080/api-docs/#/

Chạy local

1. Chạy MySQL và backend:

```bash
npm run db:push
node src/server.js
```

2. Chạy frontend từ thư mục gốc project:

```bash
npx http-server frontend -p 5173
```

Mở `http://localhost:5173`.

Backend mặc định ở `http://localhost:8080`. Token JWT được lưu trong `localStorage` sau khi đăng nhập.

## Màn hình đã có

- Đăng ký và đăng nhập JWT
- Trang chủ masonry và tìm kiếm ảnh
- Chi tiết ảnh, bình luận và lưu ảnh
- Ảnh đã tạo / ảnh đã lưu
- Upload ảnh mới
- Chỉnh sửa hồ sơ
