const UserEntity = require('../entities/userEntity');

class CreateUserAccountController {
    constructor() {
        this.userEntity = new UserEntity();
    }

    async createUserAccount(req, res) {
        const { username, password, userProfile } = req.body;

        try {
            const result = await this.userEntity.createUserAccount({ username, password, userProfile });
            res.status(201).json(result);

        } catch (error) {
            console.error("Error creating user:", error);
            res.status(result.error.status).json({ error: result.error.error });        }
    }
}

class ViewUserAccountController {
    constructor() {
        this.userEntity = new UserEntity();
    }

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
        this.userEntity = new UserEntity();
    }

    async editUserAccount(req, res) {
        const { username, userProfile, email, status } = req.body;

        try {
            const result = await this.userEntity.editUserAccount(username, userProfile, email, status);
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
        this.userEntity = new UserEntity();
    }

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
        this.userEntity = new UserEntity();
    }

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