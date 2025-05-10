const UserAccountEntity = require('../entities/userAccountEntity');

class CreateUserAccountController {
    constructor() {
        this.userEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to create a new user account.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async createUserAccount(req, res) {
        const { username, password, email, userProfileName } = req.body;
        try {
            const result = await this.userEntity.createUserAccount({ username, password, email, userProfileName });

            if (result === true) {
                res.status(201).json(true); // Successfully created
            } else {
                console.error("User account creation failed (handled by entity).");
                res.status(400).json(false); // Creation failed
            }
        } catch (error) {
            // An unexpected error occurred during the entity call (e.g., database issue or other unhandled exception in entity)
            console.error("createUserAccount ERROR:", error);
            res.status(500).json(false); // Creation failed
        }
    }
}

class ViewUserAccountController {
    constructor() {
        this.userEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to view user accounts, with optional filtering.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async viewUserAccount(req, res) {
        const { filter, keyword } = req.query;

        try {
            const users = await this.userEntity.viewUserAccount(filter, keyword);
            
            // Handle case when filtering for specific user that doesn't exist
            if (filter === 'username' && keyword && users.length === 0) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.status(200).json(users);
            }
        } catch (error) {
            console.error("Error viewing users:", error);
            res.status(500).json({ error: "Failed to retrieve users" });
        }
    }
}

class EditUserAccountController {
    constructor() {
        this.userEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to edit an existing user account.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async editUserAccount(req, res) {
        // Expect id, username, userProfileName, email, status
        const { id, username, userProfileName, email, status } = req.body;

        try {
            // Pass id along with other data to the entity
            const result = await this.userEntity.editUserAccount(id, username, userProfileName, email, status);
            if (result.error) {
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error editing user:", error);
            res.status(500).json({ error: "Failed to update user" });
        }
    }
}

class SuspendUserAccountController {
    constructor() {
        this.userEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to suspend a user account.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async suspendUserAccount(req, res) {
        const { username } = req.body;

        try {
            const success = await this.userEntity.suspendUserAccount(username);
            if (success) {
                res.status(200).json({ message: 'User account suspended successfully' });
            } else {
                res.status(500).json({ error: 'Failed to suspend user account' });
            }
        } catch (error) {
            console.error("Error suspending user:", error);
            res.status(500).json({ error: "Failed to suspend user account" });
        }
    }
}

class SearchUserAccountController {
    constructor() {
        this.userEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to search for user accounts.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchUserAccount(req, res) {
        const { filter, keyword } = req.query;

        try {
            const users = await this.userEntity.searchUserAccount(filter, keyword);
            if (users.length === 0) {
                res.status(200).json({ message: "No users found for your search" });
            } else {
                res.status(200).json(users);
            }
        } catch (error) {
            console.error("Error searching users:", error);
            if (error.message === 'Filter parameter is required for search') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to search users" });
            }
        }
    }
}

module.exports = {
    CreateUserAccountController,
    ViewUserAccountController,
    EditUserAccountController,
    SuspendUserAccountController,
    SearchUserAccountController
};