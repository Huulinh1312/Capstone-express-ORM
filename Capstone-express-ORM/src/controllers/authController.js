const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { email, mat_khau, ho_ten, tuoi } = req.body;
        // Kiểm tra email tồn tại
        const checkUser = await prisma.nguoi_dung.findUnique({ where: { email } });
        if (checkUser) return res.status(400).json({ message: "Email đã tồn tại!" });

        // Băm mật khẩu
        const hashed_password = await bcrypt.hash(mat_khau, 10);
        await prisma.nguoi_dung.create({
            data: { email, mat_khau: hashed_password, ho_ten, tuoi: Number(tuoi) }
        });
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, mat_khau } = req.body;
        const user = await prisma.nguoi_dung.findUnique({ where: { email } });
        
        if (!user || !(await bcrypt.compare(mat_khau, user.mat_khau))) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        // Tạo token
        const token = jwt.sign({ userId: user.nguoi_dung_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ message: "Đăng nhập thành công!", token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error });
    }
};

module.exports = { register, login };