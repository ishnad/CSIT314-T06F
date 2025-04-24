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

module.exports = {
    CreateUserAccountController,
};