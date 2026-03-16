const db = require('../config/database');

const getAllSkills = async (req, res) => {
    try {
        const [skills] = await db.query(
            'SELECT * FROM skills ORDER BY category, display_order ASC'
        );
        res.json(skills);
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSkillsByCategory = async (req, res) => {
    try {
        const [skills] = await db.query(
            'SELECT * FROM skills WHERE category = ? ORDER BY display_order ASC',
            [req.params.category]
        );
        res.json(skills);
    } catch (error) {
        console.error('Get skills by category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createSkill = async (req, res) => {
    try {
        const { skill_name, category, percentage, icon, display_order } = req.body;

        const [result] = await db.query(
            'INSERT INTO skills (skill_name, category, percentage, icon, display_order) VALUES (?, ?, ?, ?, ?)',
            [skill_name, category, percentage, icon, display_order || 0]
        );

        res.status(201).json({
            message: 'Skill created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { skill_name, category, percentage, icon, display_order } = req.body;

        const [result] = await db.query(
            'UPDATE skills SET skill_name = ?, category = ?, percentage = ?, icon = ?, display_order = ? WHERE id = ?',
            [skill_name, category, percentage, icon, display_order, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.json({ message: 'Skill updated successfully' });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM skills WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllSkills,
    getSkillsByCategory,
    createSkill,
    updateSkill,
    deleteSkill
};
