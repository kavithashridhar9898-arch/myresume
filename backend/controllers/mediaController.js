const db = require('../config/database');
const path = require('path');
const fs = require('fs');

const getAllMedia = async (req, res) => {
    try {
        const [media] = await db.query('SELECT * FROM media ORDER BY created_at DESC');
        res.json(media);
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMediaByType = async (req, res) => {
    try {
        const [media] = await db.query(
            'SELECT * FROM media WHERE type = ? ORDER BY created_at DESC',
            [req.params.type]
        );
        res.json(media);
    } catch (error) {
        console.error('Get media by type error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type = 'image', alt_text = '' } = req.body;
        const filePath = `/uploads/${req.file.filename}`;

        const [result] = await db.query(
            'INSERT INTO media (type, file_path, file_name, file_size, mime_type, alt_text) VALUES (?, ?, ?, ?, ?, ?)',
            [type, filePath, req.file.originalname, req.file.size, req.file.mimetype, alt_text]
        );

        res.status(201).json({
            message: 'File uploaded successfully',
            id: result.insertId,
            file: {
                id: result.insertId,
                type,
                file_path: filePath,
                file_name: req.file.originalname,
                file_size: req.file.size,
                mime_type: req.file.mimetype,
                alt_text
            }
        });
    } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const [media] = await db.query('SELECT * FROM media WHERE id = ?', [req.params.id]);

        if (media.length === 0) {
            return res.status(404).json({ message: 'Media not found' });
        }

        const filePath = path.join(__dirname, '..', media[0].file_path);
        
        // Delete file from filesystem
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await db.query('DELETE FROM media WHERE id = ?', [req.params.id]);

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllMedia,
    getMediaByType,
    uploadMedia,
    deleteMedia
};
