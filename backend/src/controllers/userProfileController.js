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
        const { name, permissions } = req.body;

        // Pass permissions (or undefined if not provided) to the entity
        const result = await this.userProfileEntity.createUserProfile({ name, permissions });

        if (result.error) {
            // If the entity returned an error object, use its status and message
            res.status(result.error.status).json({ error: result.error.error });
        } else if (result === true) {
            res.status(201).json(result);
        }
    }
}

class ViewUserProfileController {
     constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    /**
     * Handles the HTTP request to list user profiles.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async listUserProfiles(req, res) {
        const { keyword } = req.query; // Extract keyword from query parameters

        const result = await this.userProfileEntity.listUserProfiles({ keyword });

        if (result.error) {
            // If the entity returned an error object
            res.status(result.error.status).json({ error: result.error.error });
        } else {
            // Success: return the list of profiles
            res.status(200).json(result); // Send the array directly
        }
    }
}

class EditUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    /**
     * Handles the HTTP request to update a user profile.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async updateUserProfile(req, res) {
        const { id } = req.params; // Extract profile ID from URL parameter
        const { name, permissions } = req.body; // Extract data, including optional permissions

        // Pass both name and permissions (or undefined) to the entity
        const result = await this.userProfileEntity.updateUserProfile(id, { name, permissions });

        if (result.error) {
            // If the entity returned an error object, use its status and message
            res.status(result.error.status).json({ error: result.error.error });
        } else if (result === true) {
            res.status(200).json(result);
        }
    }
}

class SimulateUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    /**
     * Handles the HTTP request to simulate a user profile view.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async simulateProfile(req, res) {
        const { profileName } = req.params; // Extract profile name from URL parameter

        // Basic check: profileName must be present (entity layer does more thorough validation)
        if (!profileName) {
            return res.status(400).json({ error: 'Profile name is required in the URL for simulation.' });
        }

        try {
            const result = await this.userProfileEntity.simulateProfile(profileName);

            if (result.error) {
                // If the entity returned an error object, use its status and message
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success: return the profile data needed for simulation
                // The frontend will use this data to render the simulated view
                res.status(200).json({ message: `Simulating profile: ${result.name}`, profile: result });
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Controller error simulating user profile:", error);
            res.status(500).json({ error: 'An unexpected error occurred while simulating the user profile.' });
        }
    }
}

class UpdateUserProfileStatusController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    /**
     * Handles the HTTP request to update the status of a user profile.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async updateProfileStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body; // Expecting status like "ACTIVE" or "SUSPENDED"

        const result = await this.userProfileEntity.updateProfileStatus(id, status.toUpperCase());

        if (result.error) {
            res.status(result.error.status).json({ error: result.error.error });
        } else if (result === true) {
            res.status(200).json(result);
        }
    }
}

class SearchUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    /**
     * Handles the HTTP request to search for a user profile by name and retrieve its associated user accounts.
     * @param {object} req - Express request object, expects req.query.filter and req.query.keyword.
     * @param {object} res - Express response object.
     */
    async searchUserProfiles(req, res) {
        const { filter, keyword } = req.query;

        const result = await this.userProfileEntity.searchUserProfiles({ filter, keyword });

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }

        res.status(200).json(result);
    }
}

module.exports = {
    CreateUserProfileController,
    ViewUserProfileController,
    EditUserProfileController,
    SimulateUserProfileController,
    UpdateUserProfileStatusController,
    SearchUserProfileController
};