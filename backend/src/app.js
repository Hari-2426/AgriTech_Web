const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Static folder for uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AgriAssist API is running',
        version: '1.0.0'
    });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const cropRoutes = require('./routes/cropRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const alertRoutes = require('./routes/alertRoutes');
const marketRoutes = require('./routes/marketRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const copilotRoutes = require('./routes/copilotRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai/copilot', copilotRoutes);

// Error Handling Middleware
const { errorHandler } = require('./middlewares/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
