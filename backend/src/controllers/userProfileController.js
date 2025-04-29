const UserProfileEntity = require('../entity/userProfileEntity');

class CreateUserProfileController {
    constructor() {
        this.userProfileEntity = new UserProfileEntity();
    }

    async createUserProfile(req, res) {
        const { name, description } = req.body;
        try {
            const profile = await this.userProfileEntity.createProfile(name, description);
            res.status(201).json(profile);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create profile' });
        }
    }
}

module.exports = {
    CreateUserProfileController
};