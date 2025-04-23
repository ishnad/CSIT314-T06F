const { PrismaClient } = require('../generated/prisma');
const UserEntities = require('../entities/userEntities');

/**
 * Controller class to handle creating a new user account.
 * Corresponds to the 'CreateUserAccountController' in BCE.
 */
class CreateUserAccountController {
    constructor() {
        this.prisma = new PrismaClient(); // Instantiate Prisma Client
        this.userEntities = new UserEntities();
    }

    /**
     * Handle creating a new user account
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async create(req, res) {
        const { username, password, userProfile } = req.body;

        // Validate using UserEntities
        const validationError = this.userEntities.validateCreateUser(req.body);
        if (validationError) {
            return res.status(validationError.status).json({ error: validationError.error });
        }

        try {
            // Check username using UserEntities
            const usernameError = await this.userEntities.checkUsernameExists(username);
            if (usernameError) {
                return res.status(usernameError.status).json({ error: usernameError.error });
            }

            const hashedPassword = await this.userEntities.hashPassword(password);

            // Create user account
            const newUser = await this.prisma.userAccount.create({
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
    }
}

module.exports = {
    CreateUserAccountController,
    // Add other user-related controller classes here later
};