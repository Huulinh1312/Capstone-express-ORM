# Pinboard Frontend

Frontend React + TypeScript + Tailwind CSS cho dự án Capstone Pinterest. Frontend kết nối với backend ExpressJS, MySQL và Prisma thông qua REST API. Axios interceptor tự động gắn JWT vào các request cần xác thực.

## Chạy local

1. Chạy MySQL và backend bằng Docker từ thư mục gốc project:

```bash
docker compose up -d --build
```

Nếu chạy backend trực tiếp ngoài Docker:

```bash
npm install
npm run db:push
node src/server.js
```

Backend mặc định ở `http://localhost:8080`.

2. Cài dependency và chạy frontend:

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

Token JWT được lưu trong `localStorage` sau khi đăng nhập.

Có thể đổi API backend bằng biến môi trường `VITE_API_URL`, ví dụ tạo file `.env` trong folder frontend:

```env
VITE_API_URL=http://localhost:8080/api
```

## Kiểm tra backend

- Swagger UI: `http://localhost:8080/api-docs`
- Danh sách ảnh: `GET /api/images`
- Tìm kiếm ảnh: `GET /api/images?name=keyword`
- Đăng ký: `POST /api/auth/register`
- Đăng nhập: `POST /api/auth/login`
- Chi tiết ảnh: `GET /api/images/:id`
- Bình luận: `GET/POST /api/images/:id/comments`
- Kiểm tra ảnh đã lưu: `GET /api/images/:id/saved`
- Lưu ảnh: `POST /api/images/:id/saved`
- Upload ảnh: `POST /api/images` với `multipart/form-data`
- Hồ sơ: `GET/PUT /api/users/profile`
- Ảnh đã tạo: `GET /api/users/created-images`
- Ảnh đã lưu: `GET /api/users/saved-images`
- Xóa ảnh: `DELETE /api/images/:id`

Các API bảo mật yêu cầu header:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Màn hình đã có

- Đăng ký và đăng nhập JWT
- Trang chủ masonry và tìm kiếm ảnh
- Chi tiết ảnh, bình luận và lưu ảnh
- Ảnh đã tạo / ảnh đã lưu
- Upload ảnh mới
- Chỉnh sửa hồ sơ

## Upload ảnh

Ảnh upload được lưu tại `public/img` và backend lưu đường dẫn trong database. Docker Compose đã mount thư mục này vào container để ảnh không bị mất khi rebuild:

```yaml
./public:/usr/src/app/public
```

Không xóa thư mục `public/img` nếu database vẫn còn các bản ghi ảnh đang sử dụng đường dẫn trong thư mục này.

## Cấu trúc chính

```text
src/
├── api/
│   ├── axiosClient.ts
│   ├── authApi.ts
│   ├── imageApi.ts
│   └── userApi.ts
├── components/
├── context/
│   └── AuthContext.tsx
├── pages/
├── utils/
│   └── storage.ts
├── App.tsx
└── main.tsx
```

`src/api/axiosClient.ts` đọc `VITE_API_URL`, tự gắn `Authorization: Bearer <token>` từ `localStorage`, và các file API còn lại chỉ tập trung vào endpoint tương ứng.

## Postman

File collection Postman nằm ở thư mục gốc project: `capstone.postman.json`. Import file này vào Postman để kiểm tra các API. Hãy gọi Login trước, sau đó lưu JWT token vào Bearer Token cho các request bảo mật.

## Build production

```bash
npm run build
npm run preview
```

## Troubleshooting

- Nếu frontend không tải được dữ liệu, kiểm tra backend có chạy ở port `8080` không.
- Nếu request bảo mật trả `401`, hãy đăng nhập lại và kiểm tra Bearer Token.
- Nếu ảnh hiển thị lỗi, kiểm tra file thật có tồn tại trong `public/img` và backend Docker đã được mount volume.
- Nếu thay đổi backend trong Docker chưa có hiệu lực, chạy lại `docker compose up -d --build nodejs-app`.
