const express = require('express');
const router = express.Router();
const { login, logout, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
