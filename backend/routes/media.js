const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getAllMedia,
    getMediaByType,
    uploadMedia,
    deleteMedia
} = require('../controllers/mediaController');
const { authenticateToken } = require('../middleware/auth');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

router.get('/', getAllMedia);
router.get('/type/:type', getMediaByType);
router.post('/upload', authenticateToken, upload.single('file'), uploadMedia);
router.delete('/:id', authenticateToken, deleteMedia);

module.exports = router;
