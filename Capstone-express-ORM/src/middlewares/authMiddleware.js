const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Không tìm thấy token!" });

    // Cắt chữ "Bearer " ra khỏi token
    token = token.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        req.user = decoded; // Lưu thông tin giải mã (chứa userId) vào req để dùng cho các API sau
        next();
    });
};
module.exports = { verifyToken };