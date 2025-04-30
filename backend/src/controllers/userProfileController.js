const UserProfileEntity = require('../entities/userProfileEntity');

class CreateUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    /**
     * Handles the HTTP request to create a new user profile.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async createUserProfile(req, res) {
        const { name, description } = req.body; // Extract data from request body

        // Basic check for required fields
        if (!name) {
            return res.status(400).json({ error: 'Profile name is required.' });
        }

        try {
            const result = await this.userProfileEntity.createUserProfile({ name, description });

            if (result.error) {
                // If the entity returned an error object, use its status and message
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success: return the created profile data
                res.status(201).json({ message: 'User profile created successfully.', profile: result });
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Controller error creating user profile:", error);
            res.status(500).json({ error: 'An unexpected error occurred while creating the user profile.' });
        }
    }
}

// Export the controller (add others later if needed)
module.exports = {
    CreateUserProfileController
};