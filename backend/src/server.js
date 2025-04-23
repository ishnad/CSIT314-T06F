require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const userRoutes = require('./routes/userRoutes');

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// --- API routes ---
// Mount the user routes under the /api/users path
app.use('/api/users', userRoutes);

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