const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', getProfile);
router.put('/', authenticateToken, updateProfile);

module.exports = router;
