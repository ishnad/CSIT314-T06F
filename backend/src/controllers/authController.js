const UserAccountEntity = require('../entities/userAccountEntity');

// --- AuthController ---
class AuthController {
    constructor() {
        this.userAccountEntity = new UserAccountEntity();
    }

    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        try {
            const result = await this.userAccountEntity.validateLogin(username, password);
            if (result.error) {
                res.status(result.error.status).json({ error: result.error.message });
            } else {
                res.status(200).json({
                    message: 'Login successful.',
                    user: {
                        id: result.id,
                        username: result.username,
                        email: result.email,
                        profile: result.userProfile
                    }
                });
            }
        } catch (error) {
            console.error("Controller error during login:", error);
            res.status(500).json({ error: 'An unexpected error occurred during login.' });
        }
    }

    async logout(req, res) {
        // Stateless logout acknowledgement
        res.status(200).json({
            message: 'Logout successful. Please clear your session/token.'
        });
    }
}

module.exports = {
    AuthController
};