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
            res.status(200).json(users);
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

module.exports = {
    CreateUserAccountController,
    ViewUserAccountController,
    EditUserAccountController,
    SuspendUserAccountController
};