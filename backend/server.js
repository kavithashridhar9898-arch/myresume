const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/media', require('./routes/media'));
app.use('/api/qr', require('./routes/qr'));

// Admin route - serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'admin', 'index.html'));
});

// Links page route
app.get('/links', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'links.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MyResume API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║     MYRESUME - Premium Portfolio Platform                ║
    ║                                                          ║
    ║     Server running on http://localhost:${PORT}              ║
    ║                                                          ║
    ║     Public Site:  http://localhost:${PORT}                  ║
    ║     Admin Panel:  http://localhost:${PORT}/admin            ║
    ║     Link Hub:     http://localhost:${PORT}/links            ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝
    `);
});
