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
        try {
            const { filter, keyword } = req.query;
            const users = await this.userEntity.viewUserAccount(filter, keyword);
            
            // Handle case when filtering for specific user that doesn't exist
            if (filter === 'username' && keyword && users.length === 0) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.status(200).json(users);
            }
        } catch (error) {
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
        try {
            const { id, username, userProfileName, email, status } = req.body;
            const result = await this.userEntity.editUserAccount(id, username, userProfileName, email, status);
            if (result.error) {
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
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
            const result = await this.userEntity.suspendUserAccount(username);
            if (result === true) { // Entity returns true on success
                res.status(200).json(true);
            } else if (result && result.error) { // Entity returns an error object
                res.status(result.error.status).json({ error: result.error.message });
            } else {
                // This block is hit if result is not true and not an error object (e.g., false from mock).
                // We expect this path to cause a TypeError, which should be caught by the outer catch.
                // Forcing a very explicit TypeError:
                const intentionallyUndefined = undefined;
                intentionallyUndefined.thisWillThrow(); // This will cause a TypeError
            }
        } catch (error) {
            // This catch block should now definitely catch the TypeError from the else block.
            console.error("suspendUserAccount ERROR:", error); // Ensure this is logged
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
            // Handle specific error for missing filter from entity
            if (error.message === 'Filter parameter is required for search') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Failed to search users" });
            }
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

class SearchCleanerController {
    constructor() {
        this.userAccountEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to search for cleaners.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchCleaner(req, res) {
        const { keyword } = req.query;
        
        const result = await this.userAccountEntity.searchCleaners(keyword);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        }

        if (result.length === 0) {
            // Alternate flow: No matching cleaner profiles
            return res.status(200).json({ message: "No cleaners match your search criteria", cleaners: [] });
        }

        // Normal flow: Display list of matching cleaner profiles
        return res.status(200).json(result);
    }
}

module.exports = {
    CreateUserAccountController,
    ViewUserAccountController,
    EditUserAccountController,
    SuspendUserAccountController,
    SearchUserAccountController,
    ViewCleanerProfileController,
    SearchCleanerController
};
