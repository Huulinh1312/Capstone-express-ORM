const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET Danh sách ảnh / Lọc theo tên
const getImages = async (req, res) => {
    const { name } = req.query;
    try {
        const images = await prisma.hinh_anh.findMany({
            where: name ? { ten_hinh: { contains: name } } : {} // Nếu có name thì lọc, không thì lấy hết
        });
        res.status(200).json(images);
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// GET Chi tiết ảnh và người tạo
const getImageDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await prisma.hinh_anh.findUnique({
            where: { hinh_id: Number(id) },
            include: { nguoi_dung: { select: { ho_ten: true, anh_dai_dien: true } } }
        });
        res.status(200).json(image);
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// POST Bình luận ảnh (Cần token)
const addComment = async (req, res) => {
    try {
        const { id } = req.params; // ID ảnh
        const { noi_dung } = req.body;
        const userId = req.user.userId; // Lấy từ token

       const newComment = await prisma.binh_luan.create({
            data: { nguoi_dung_id: userId, hinh_id: Number(id), noi_dung }
        });
        res.status(201).json({ message: "Đã bình luận", data: newComment });
    } catch (error) { 
        console.log("Chi tiết lỗi addComment:", error); // In ra terminal VS Code
        res.status(500).json({ message: "Lỗi Server", detail: error.message }); // Bắn chi tiết lỗi lên Postman
    }
};
// GET Danh sách bình luận theo ID ảnh
const getCommentsByImage = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await prisma.binh_luan.findMany({
            where: { hinh_id: Number(id) },
            include: { nguoi_dung: { select: { ho_ten: true, anh_dai_dien: true } } }
        });
        res.status(200).json(comments);
    } catch (error) { res.status(500).json({ message: "Lỗi Server", error: error.message }); }
};

// GET Kiểm tra ảnh đã lưu chưa (Dành cho nút Save)
const checkSavedImage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // Bắt buộc truyền token

        const isSaved = await prisma.luu_anh.findUnique({
            where: {
                nguoi_dung_id_hinh_id: { // Khóa chính kép theo cấu trúc Prisma
                    nguoi_dung_id: userId,
                    hinh_id: Number(id)
                }
            }
        });
        
        res.status(200).json({ isSaved: !!isSaved }); // Trả về true nếu đã lưu, false nếu chưa
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// POST Lưu ảnh vào bộ sưu tập của user (Cần token)
const saveImage = async (req, res) => {
    try {
        const imageId = Number(req.params.id);
        const userId = req.user.userId;

        const image = await prisma.hinh_anh.findUnique({ where: { hinh_id: imageId } });
        if (!image) return res.status(404).json({ message: "Không tìm thấy ảnh" });

        await prisma.luu_anh.upsert({
            where: { nguoi_dung_id_hinh_id: { nguoi_dung_id: userId, hinh_id: imageId } },
            update: {},
            create: { nguoi_dung_id: userId, hinh_id: imageId }
        });

        res.status(201).json({ message: "Đã lưu ảnh" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};


module.exports = { getImages, getImageDetail, addComment, getCommentsByImage, checkSavedImage, saveImage };