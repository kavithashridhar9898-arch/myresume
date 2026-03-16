const db = require('../config/database');

const getAllSkills = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM skills ORDER BY category, display_order ASC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSkillsByCategory = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM skills WHERE category = $1 ORDER BY display_order ASC',
            [req.params.category]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get skills by category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createSkill = async (req, res) => {
    try {
        const { skill_name, category, percentage, icon, display_order } = req.body;

        const result = await db.query(
            'INSERT INTO skills (skill_name, category, percentage, icon, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [skill_name, category, percentage, icon, display_order || 0]
        );

        res.status(201).json({
            message: 'Skill created successfully',
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { skill_name, category, percentage, icon, display_order } = req.body;

        const result = await db.query(
            'UPDATE skills SET skill_name = $1, category = $2, percentage = $3, icon = $4, display_order = $5 WHERE id = $6',
            [skill_name, category, percentage, icon, display_order, req.params.id]
        );

        if (result.rowCount === 0) {
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
        const result = await db.query('DELETE FROM skills WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
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
