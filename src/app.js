const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Trackwise API is running!' });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message || 'Internal server error!' });
});

module.exports = app;