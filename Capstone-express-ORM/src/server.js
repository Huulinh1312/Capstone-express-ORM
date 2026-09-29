require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Import thư viện Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const prisma = new PrismaClient();
const app = express();

// Import middlewares
const { verifyToken } = require('./middlewares/authMiddleware');

// Import controllers
const { register, login } = require('./controllers/authController');
const { getImages, getImageDetail, addComment, getCommentsByImage, checkSavedImage, saveImage } = require('./controllers/imageController');
const { getUserProfile, updateUserProfile, getSavedImages, getCreatedImages, deleteImage } = require('./controllers/userController');

// --- Cấu hình Multer để lưu file ảnh upload ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lưu ý: Bắt buộc phải tạo thư mục "public" và thư mục con "img" ở gốc dự án trước khi chạy
        cb(null, process.cwd() + '/public/img'); 
    },
    filename: (req, file, cb) => {
        // Tránh trùng tên file bằng cách gắn thêm timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});
const upload = multer({ storage });

// --- Cấu hình Swagger ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Capstone Pinterest',
            version: '1.0.0',
            description: 'Tài liệu API cho đồ án Backend Node.js'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/server.js'], // Quét các comment @swagger trong file này
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Cấu hình Express
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Cấp quyền truy cập thư mục public để xem ảnh trên trình duyệt

// Khởi tạo trang UI của Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
//               ĐỊNH TUYẾN (ROUTES)
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               mat_khau: { type: string }
 *               ho_ten: { type: string }
 *               tuoi: { type: integer }
 *     responses:
 *       201: { description: Đăng ký thành công }
 */
app.post('/api/auth/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập hệ thống
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               mat_khau: { type: string }
 *     responses:
 *       200: { description: Trả về Token JWT }
 */
app.post('/api/auth/login', login);

/**
 * @swagger
 * /api/images:
 *   get:
 *     tags: [Images]
 *     summary: Lấy danh sách toàn bộ ảnh / Tìm kiếm theo tên
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Tên ảnh cần tìm
 *     responses:
 *       200: { description: Thành công }
 */
app.get('/api/images', getImages);

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     tags: [Images]
 *     summary: Lấy thông tin chi tiết ảnh và người tạo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Thành công }
 */
app.get('/api/images/:id', getImageDetail);

/**
 * @swagger
 * /api/images/{id}/comments:
 *   get:
 *     tags: [Images]
 *     summary: Lấy danh sách bình luận theo ID ảnh
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Thành công }
 */
app.get('/api/images/:id/comments', getCommentsByImage);

/**
 * @swagger
 * /api/images/{id}/comments:
 *   post:
 *     tags: [Images]
 *     summary: Thêm bình luận vào ảnh (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noi_dung: { type: string }
 *     responses:
 *       201: { description: Đã bình luận }
 */
app.post('/api/images/:id/comments', verifyToken, addComment);

/**
 * @swagger
 * /api/images/{id}/saved:
 *   get:
 *     tags: [Images]
 *     summary: Kiểm tra ảnh đã lưu chưa (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Trả về true/false }
 */
app.get('/api/images/:id/saved', verifyToken, checkSavedImage);

/**
 * @swagger
 * /api/images/{id}/saved:
 *   post:
 *     tags: [Images]
 *     summary: Lưu ảnh vào bộ sưu tập (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Đã lưu ảnh }
 */
app.post('/api/images/:id/saved', verifyToken, saveImage);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     tags: [Images]
 *     summary: Xóa ảnh đã tạo (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Xóa thành công }
 */
app.delete('/api/images/:id', verifyToken, deleteImage);

/**
 * @swagger
 * /api/images:
 *   post:
 *     tags: [Images]
 *     summary: Thêm hình ảnh mới (Upload File - Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ten_hinh: { type: string }
 *               mo_ta: { type: string }
 *               hinh_anh:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Thêm ảnh thành công }
 */
app.post('/api/images', verifyToken, upload.single('hinh_anh'), async (req, res) => {
    try {
        const file = req.file;
        const { ten_hinh, mo_ta } = req.body;
        
        if (!file) {
            return res.status(400).json({ message: "Vui lòng đính kèm file ảnh" });
        }

        // Lưu thông tin ảnh vào database
        const newImage = await prisma.hinh_anh.create({
            data: {
                ten_hinh,
                mo_ta,
                duong_dan: `/img/${file.filename}`, // Lưu đường dẫn tĩnh để Client có thể load
                nguoi_dung_id: req.user.userId      // Lấy ID người tạo từ Token
            }
        });
        res.status(201).json({ message: "Thêm ảnh thành công", data: newImage });
    } catch (error) { 
        console.error("Lỗi upload ảnh:", error);
        res.status(500).json({ message: "Lỗi Server", error: error.message }); 
    }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Lấy thông tin cá nhân (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Trả về thông tin user }
 */
app.get('/api/users/profile', verifyToken, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Chỉnh sửa thông tin cá nhân (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ho_ten: { type: string }
 *               tuoi: { type: integer }
 *               anh_dai_dien: { type: string }
 *     responses:
 *       200: { description: Cập nhật thành công }
 */
app.put('/api/users/profile', verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/users/saved-images:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách ảnh đã lưu (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Thành công }
 */
app.get('/api/users/saved-images', verifyToken, getSavedImages);

/**
 * @swagger
 * /api/users/created-images:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách ảnh đã tạo (Cần Token)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Thành công }
 */
app.get('/api/users/created-images', verifyToken, getCreatedImages);

// Khởi chạy Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`Tài liệu API Swagger tại http://localhost:${PORT}/api-docs`);
});