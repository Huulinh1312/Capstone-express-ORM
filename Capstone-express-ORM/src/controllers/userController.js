const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET Thông tin user (Profile)
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.nguoi_dung.findUnique({
            where: { nguoi_dung_id: userId },
            select: { email: true, ho_ten: true, tuoi: true, anh_dai_dien: true } // Không trả về mật khẩu
        });
        res.status(200).json(user);
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// PUT Chỉnh sửa thông tin cá nhân
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ho_ten, tuoi } = req.body;
        const avatarPath = req.file ? `/img/${req.file.filename}` : undefined;
        
        const updatedUser = await prisma.nguoi_dung.update({
            where: { nguoi_dung_id: userId },
            data: {
                ho_ten,
                tuoi: Number(tuoi),
                ...(avatarPath ? { anh_dai_dien: avatarPath } : {})
            }
        });
        res.status(200).json({ message: "Cập nhật thành công", data: updatedUser });
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// GET Danh sách ảnh đã lưu theo user id
const getSavedImages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const savedImages = await prisma.luu_anh.findMany({
            where: { nguoi_dung_id: userId },
            include: { hinh_anh: true } // Kéo theo thông tin chi tiết của bức ảnh
        });
        res.status(200).json(savedImages);
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// GET Danh sách ảnh đã tạo theo user id
const getCreatedImages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const createdImages = await prisma.hinh_anh.findMany({
            where: { nguoi_dung_id: userId }
        });
        res.status(200).json(createdImages);
    } catch (error) { res.status(500).json({ message: "Lỗi Server" }); }
};

// DELETE Xóa ảnh đã tạo
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Kiểm tra xem ảnh này có phải do user này tạo không
        const image = await prisma.hinh_anh.findUnique({ where: { hinh_id: Number(id) } });
        if (!image) return res.status(404).json({ message: "Không tìm thấy ảnh" });
        if (image.nguoi_dung_id !== userId) return res.status(403).json({ message: "Bạn không có quyền xóa ảnh này" });

        // Phải xóa dữ liệu liên kết ở bảng binh_luan và luu_anh trước khi xóa ảnh gốc
        await prisma.binh_luan.deleteMany({ where: { hinh_id: Number(id) } });
        await prisma.luu_anh.deleteMany({ where: { hinh_id: Number(id) } });
        await prisma.hinh_anh.delete({ where: { hinh_id: Number(id) } });

        res.status(200).json({ message: "Đã xóa ảnh thành công" });
    } catch (error) { res.status(500).json({ message: "Lỗi Server", error: error.message }); }
};

module.exports = { getUserProfile, updateUserProfile, getSavedImages, getCreatedImages, deleteImage };