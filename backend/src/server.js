require('dotenv').config(); // Load .env file first
const express = require('express');
const { PrismaClient } = require('../src/generated/prisma'); // Use custom output path from schema.prisma

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString(), database: 'connected' }); // Assume connected for now
});

// --- API routes ---

// ---

async function main() {
    // Test database connection
    try {
        await prisma.$connect();
        console.log("Database connection successful!");

        app.listen(PORT, () => {
            console.log(`Backend server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); // Exit if DB connection fails
    }
}

main();

// shutdown
process.on('beforeExit', async () => {
  console.log('Disconnecting database...');
  await prisma.$disconnect();
  console.log('Database disconnected.');
});