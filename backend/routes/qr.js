const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const db = require('../config/database');

// Generate QR code
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT github, linkedin, leetcode FROM profile LIMIT 1');
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const profile = result.rows[0];
        const linksData = {
            github: profile.github,
            linkedin: profile.linkedin,
            leetcode: profile.leetcode
        };

        // Create URL for the links page
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const linksUrl = `${baseUrl}/links.html`;

        // Generate QR code
        const qrCodeDataUrl = await QRCode.toDataURL(linksUrl, {
            width: 400,
            margin: 2,
            color: {
                dark: '#C6A15B',
                light: '#050A18'
            }
        });

        res.json({
            qrCode: qrCodeDataUrl,
            links: linksData,
            linksUrl: linksUrl
        });
    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get social links data
router.get('/links', async (req, res) => {
    try {
        const result = await db.query('SELECT name, github, linkedin, leetcode FROM profile LIMIT 1');
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get links error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
