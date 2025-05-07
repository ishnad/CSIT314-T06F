require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const userAccountRoutes = require('./routes/userAccountRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceListingRoutes = require('./routes/serviceListingRoutes');
const cleanerInsightsRoutes = require('./routes/cleanerInsightsRoutes');

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// --- API routes ---
app.use('/api/users', userAccountRoutes);
app.use('/api/profiles', userProfileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listings', serviceListingRoutes);
app.use('/api/insights/cleaner', cleanerInsightsRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
    // Basic health check - enhance later with actual DB check if needed
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});


// --- Main function and server start ---
async function main() {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

main().catch((e) => {
    console.error('Failed to start server:', e);
    process.exit(1);
});