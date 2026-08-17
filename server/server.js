require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const guidanceRoutes = require('./routes/guidanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'VaultOfCode AI Support Chatbot API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/guidance', guidanceRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Career Guidance & Lead Engine Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
