const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

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
        fileSize: 10 * 1024 * 1024 // 10MB limit for Cloudinary
    }
});

// Get all media
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM media ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get media by type
router.get('/type/:type', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM media WHERE type = $1 ORDER BY created_at DESC',
            [req.params.type]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get media by type error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload media to Cloudinary
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type = 'image', alt_text = '' } = req.body;

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'myresume',
                    resource_type: req.file.mimetype.startsWith('video/') ? 'video' : 'auto',
                    public_id: `file-${Date.now()}-${Math.round(Math.random() * 1E9)}`
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // Save to database
        const dbResult = await db.query(
            'INSERT INTO media (type, file_path, file_name, file_size, mime_type, alt_text) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [type, uploadResult.secure_url, req.file.originalname, req.file.size, req.file.mimetype, alt_text]
        );

        res.status(201).json({
            message: 'File uploaded successfully',
            id: dbResult.rows[0].id,
            file: {
                id: dbResult.rows[0].id,
                type,
                file_path: uploadResult.secure_url,
                file_name: req.file.originalname,
                file_size: req.file.size,
                mime_type: req.file.mimetype,
                alt_text
            }
        });
    } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Delete media
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM media WHERE id = $1', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Media not found' });
        }

        const media = result.rows[0];

        // Delete from Cloudinary (extract public_id from URL)
        if (media.file_path && media.file_path.includes('cloudinary.com')) {
            try {
                const urlParts = media.file_path.split('/');
                const filename = urlParts[urlParts.length - 1];
                const publicId = 'myresume/' + filename.split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.error('Cloudinary delete error:', cloudinaryError);
                // Continue even if Cloudinary delete fails
            }
        }

        // Delete from database
        await db.query('DELETE FROM media WHERE id = $1', [req.params.id]);

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
