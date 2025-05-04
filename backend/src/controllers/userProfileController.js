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

        // Basic check for required fields
        if (!name) {
            return res.status(400).json({ error: 'Profile name is required.' });
        }
        // Permissions are optional, but if provided, should be an array (entity validates further)
        if (permissions !== undefined && !Array.isArray(permissions)) {
             return res.status(400).json({ error: 'Permissions must be an array.' });
        }

        try {
            // Pass permissions (or undefined if not provided) to the entity
            const result = await this.userProfileEntity.createUserProfile({ name, permissions });

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

        try {
            const result = await this.userProfileEntity.listUserProfiles({ keyword });

            if (result.error) {
                // If the entity returned an error object
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success: return the list of profiles
                res.status(200).json(result); // Send the array directly
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Controller error listing user profiles:", error);
            res.status(500).json({ error: 'An unexpected error occurred while listing user profiles.' });
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

        // Basic check: ID must be present
        if (!id) {
            return res.status(400).json({ error: 'Profile ID is required in the URL.' });
        }
        // Basic check: At least name or permissions must be provided
        if (name === undefined && permissions === undefined) {
             return res.status(400).json({ error: 'At least name or permissions must be provided for update.' });
        }
        // Permissions are optional, but if provided, should be an array (entity validates further)
        if (permissions !== undefined && !Array.isArray(permissions)) {
             return res.status(400).json({ error: 'Permissions must be an array.' });
        }

        try {
            // Pass both name and permissions (or undefined) to the entity
            const result = await this.userProfileEntity.updateUserProfile(id, { name, permissions });

            if (result.error) {
                // If the entity returned an error object, use its status and message
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success: return the updated profile data
                res.status(200).json({ message: 'User profile updated successfully.', profile: result });
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Controller error updating user profile:", error);
            res.status(500).json({ error: 'An unexpected error occurred while updating the user profile.' });
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


// Export the controllers
module.exports = {
    CreateUserProfileController,
    ViewUserProfileController,
    EditUserProfileController,
    SimulateUserProfileController
};