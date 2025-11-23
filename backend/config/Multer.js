const multer = require('multer');
const cloudinary = require('../config/Cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (!file) return null; // 👈 quan trọng: nếu không có file thì không làm gì

        const folderName = req.body.folderName || 'productimg';
        const fileName = path.parse(file.originalname).name
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-]/g, '');

        return {
            folder: folderName,
            allowed_formats: ['jpg', 'png', 'jpeg'],
            public_id: `${fileName}-${Date.now()}`,
            resource_type: 'image',
        };
    },
});

const upload = multer({ storage });

// Middleware bọc lại, không bắt buộc có file
const safeUpload = (req, res, next) => {
    const handler = upload.single('image'); // 👈 nhớ đồng bộ field name = 'image'

    handler(req, res, function (err) {
        if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Sai field upload ảnh' });
        }
        // Nếu không có file thì req.file sẽ = undefined, không sao cả
        next(err);
    });
};

module.exports = safeUpload;
