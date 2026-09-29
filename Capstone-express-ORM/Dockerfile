# Sử dụng môi trường Node.js
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy các file cấu hình và cài đặt thư viện
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Copy toàn bộ code còn lại vào
COPY . .

# Mở cổng 8080
EXPOSE 8080

# Lệnh khởi chạy server
CMD ["node", "src/server.js"]