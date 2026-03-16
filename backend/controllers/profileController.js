const db = require('../config/database');

const getProfile = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM profile LIMIT 1');
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            title,
            bio,
            email,
            phone,
            location,
            github,
            linkedin,
            leetcode,
            twitter,
            website,
            resume_file,
            profile_image
        } = req.body;

        const result = await db.query('SELECT * FROM profile LIMIT 1');
        
        if (result.rows.length === 0) {
            // Create new profile if none exists
            await db.query(
                `INSERT INTO profile (name, title, bio, email, phone, location, github, linkedin, leetcode, twitter, website, resume_file, profile_image) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [name, title, bio, email, phone, location, github, linkedin, leetcode, twitter, website, resume_file, profile_image]
            );
        } else {
            // Get existing profile for partial update
            const existing = result.rows[0];
            
            // Build update query dynamically for partial updates
            const updates = [];
            const values = [];
            let paramIndex = 1;
            
            if (name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(name); }
            if (title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(title); }
            if (bio !== undefined) { updates.push(`bio = $${paramIndex++}`); values.push(bio); }
            if (email !== undefined) { updates.push(`email = $${paramIndex++}`); values.push(email); }
            if (phone !== undefined) { updates.push(`phone = $${paramIndex++}`); values.push(phone); }
            if (location !== undefined) { updates.push(`location = $${paramIndex++}`); values.push(location); }
            if (github !== undefined) { updates.push(`github = $${paramIndex++}`); values.push(github); }
            if (linkedin !== undefined) { updates.push(`linkedin = $${paramIndex++}`); values.push(linkedin); }
            if (leetcode !== undefined) { updates.push(`leetcode = $${paramIndex++}`); values.push(leetcode); }
            if (twitter !== undefined) { updates.push(`twitter = $${paramIndex++}`); values.push(twitter); }
            if (website !== undefined) { updates.push(`website = $${paramIndex++}`); values.push(website); }
            if (resume_file !== undefined) { updates.push(`resume_file = $${paramIndex++}`); values.push(resume_file); }
            if (profile_image !== undefined) { updates.push(`profile_image = $${paramIndex++}`); values.push(profile_image); }
            
            if (updates.length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            
            values.push(existing.id);
            
            await db.query(
                `UPDATE profile SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
                values
            );
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
