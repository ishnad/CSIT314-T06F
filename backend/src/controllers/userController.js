const { PrismaClient, UserProfile } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient(); // Instantiate Prisma Client
const SALT_ROUNDS = 10;

/**
 * Controller function to handle creating a new user account.
 * Corresponds to the 'CreateUserAccountController' in BCE.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createUserAccount = async (req, res) => {
    const { username, password, userProfile } = req.body;

    // --- Validation ---
    if (!username || !password || !userProfile) {
        return res.status(400).json({ error: 'Username, password, and userProfile are required.' });
    }
    if (!Object.values(UserProfile).includes(userProfile)) {
         return res.status(400).json({
            error: `Invalid userProfile. Must be one of: ${Object.values(UserProfile).join(', ')}`
         });
    }
    // --- End Validation ---

    try {
        const existingUser = await prisma.userAccount.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Interact with the UserAccount entity (database) via Prisma Client
        const newUser = await prisma.userAccount.create({
            data: {
                username: username,
                password: hashedPassword,
                userProfile: userProfile,
            },
        });

        // Prepare response (exclude sensitive data)
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            userProfile: newUser.userProfile,
            createdAt: newUser.createdAt,
        };
        res.status(201).json(userResponse);

    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
            return res.status(409).json({ error: 'Username already exists (database constraint).' });
        }
        res.status(500).json({ error: 'Failed to create user account.' });
    }
    // No finally block needed to disconnect here if prisma client is shared / managed globally
};

module.exports = {
    createUserAccount,
    // Add other user-related controller functions here later (e.g., getUser, updateUser)
};