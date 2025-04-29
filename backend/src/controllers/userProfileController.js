const UserProfileEntity = require('../entity/userProfileEntity');

class CreateUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    async createUserProfile(req, res) {
        const { name, description } = req.body;
        try {
            const result = await this.userProfileEntity.createUserProfile(name, description);

            if (result.error) {
                // Use status and error message from the entity
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success
                res.status(201).json(result);
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Error creating user profile:", error);
            res.status(500).json({ error: 'Failed to create profile due to an unexpected error' });
        }
    }
}

class ViewUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    async listUserProfiles(req, res) {
        // Extract filter and keyword from query parameters
        const { filter, keyword } = req.query;

        try {
            // Pass filter and keyword to the entity method
            const profiles = await this.userProfileEntity.listUserProfiles(filter, keyword);

            if (filter && keyword && profiles.length === 0) {
                 res.status(404).json({ message: "No user profiles found matching the criteria" });
            } else {
                res.status(200).json(profiles);
            }
        } catch (error) {
            console.error("Error listing user profiles:", error);
            res.status(500).json({ error: 'Failed to retrieve user profiles' });
        }
    }
}

module.exports = {
    CreateUserProfileController,
    ViewUserProfileController
};