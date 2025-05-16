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
        const result = await this.userEntity.createUserAccount({ username, password, email, userProfileName });

        if (result === true) {
            res.status(201).json(true); // Successfully created
        } else if (result.error) {
            // Error object returned from entity
            res.status(result.error.status).json({ error: result.error.message });
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
        const users = await this.userEntity.viewUserAccount(filter, keyword);
        
        // Handle case when filtering for specific user that doesn't exist
        if (filter === 'username' && keyword && users.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(users);
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
        const { id, username, userProfileName, email, status } = req.body;

        const result = await this.userEntity.editUserAccount(id, username, userProfileName, email, status);
        if (result.error) {
            res.status(result.error.status).json({ error: result.error.error });
        } else {
            res.status(200).json(result);
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

        const success = await this.userEntity.suspendUserAccount(username);
        if (success) {
            res.status(200).json(success);
        } else {
            res.status(success.error.status).json({ error: success.error.error });
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

        const users = await this.userEntity.searchUserAccount(filter, keyword);
        if (users.length === 0) {
            res.status(200).json({ message: "No users found for your search" });
        } else {
            res.status(200).json(users);
        }
    }
}

class ViewCleanerProfileController {
    constructor() {
        this.userEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to view a specific cleaner's profile.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async getAllActiveCleaners(req, res) {
        try {
            const result = await this.userEntity.fetchAllActiveCleaners();
            if (result.error) {
                res.status(result.error.status).json({ error: result.error.message });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch active cleaners" });
        }
    }

    async viewCleanerProfile(req, res) {
        const { cleanerId } = req.params;

        const result = await this.userEntity.getCleanerProfile(cleanerId);

        if (result.error) {
            res.status(result.error.status).json({ error: result.error.error });
        } else {
            res.status(200).json(result);
        }
    }
}

module.exports = {
    CreateUserAccountController,
    ViewUserAccountController,
    EditUserAccountController,
    SuspendUserAccountController,
    SearchUserAccountController,
    ViewCleanerProfileController
};
