const db = require('../config/database');

const getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.query(
            'SELECT * FROM projects ORDER BY featured DESC, display_order ASC, created_at DESC'
        );
        res.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProjectById = async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        
        if (projects.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(projects[0]);
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

        const [result] = await db.query(
            `INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image, video, category, featured, display_order) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, tech_stack, github_link, demo_link, image, video, category, featured || false, display_order || 0]
        );

        res.status(201).json({ 
            message: 'Project created successfully',
            id: result.insertId 
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

        const [result] = await db.query(
            `UPDATE projects SET 
                title = ?, description = ?, tech_stack = ?, github_link = ?, demo_link = ?,
                image = ?, video = ?, category = ?, featured = ?, display_order = ?
             WHERE id = ?`,
            [title, description, tech_stack, github_link, demo_link, image, video, category, featured, display_order, req.params.id]
        );

        if (result.affectedRows === 0) {
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
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
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
