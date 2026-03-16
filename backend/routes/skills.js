const express = require('express');
const router = express.Router();
const {
    getAllSkills,
    getSkillsByCategory,
    createSkill,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', getAllSkills);
router.get('/category/:category', getSkillsByCategory);
router.post('/', authenticateToken, createSkill);
router.put('/:id', authenticateToken, updateSkill);
router.delete('/:id', authenticateToken, deleteSkill);

module.exports = router;
