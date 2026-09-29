- Pinboard Frontend

  - Frontend React + TypeScript + Tailwind CSS cho Capstone Express ORM. API được chia theo module Axios và JWT tự động gắn qua interceptor.
  - Swagger API : http://localhost:8080/api-docs/#/



Chạy local

1. Chạy MySQL và backend:

```bash
npm run db:push
node src/server.js
```

2. Cài dependency và chạy frontend:

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

Backend mặc định ở `http://localhost:8080`. Token JWT được lưu trong `localStorage` sau khi đăng nhập.

Có thể đổi API backend bằng biến môi trường `VITE_API_URL`, ví dụ tạo file `.env` trong folder frontend:

```env
VITE_API_URL=http://localhost:8080/api
```

## Màn hình đã có

- Đăng ký và đăng nhập JWT
- Trang chủ masonry và tìm kiếm ảnh
- Chi tiết ảnh, bình luận và lưu ảnh
- Ảnh đã tạo / ảnh đã lưu
- Upload ảnh mới
- Chỉnh sửa hồ sơ

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
