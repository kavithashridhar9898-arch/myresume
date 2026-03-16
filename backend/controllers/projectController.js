const db = require('../config/database');

const getAllProjects = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM projects ORDER BY featured DESC, display_order ASC, created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProjectById = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            tech_stack,
            github_link,
            demo_link,
            image,
            video,
            category,
            featured,
            display_order
        } = req.body;

        const result = await db.query(
            `INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image, video, category, featured, display_order) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [title, description, tech_stack, github_link, demo_link, image, video, category, featured || false, display_order || 0]
        );

        res.status(201).json({ 
            message: 'Project created successfully',
            id: result.rows[0].id 
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProject = async (req, res) => {
    try {
        const {
            title,
            description,
            tech_stack,
            github_link,
            demo_link,
            image,
            video,
            category,
            featured,
            display_order
        } = req.body;

        const result = await db.query(
            `UPDATE projects SET 
                title = $1, description = $2, tech_stack = $3, github_link = $4, demo_link = $5,
                image = $6, video = $7, category = $8, featured = $9, display_order = $10
             WHERE id = $11`,
            [title, description, tech_stack, github_link, demo_link, image, video, category, featured, display_order, req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM projects WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
