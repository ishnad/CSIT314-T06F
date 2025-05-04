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

            // Check if result exists and has an error property
            if (result && result.error) {
                // Ensure error object has status and message before using them
                const status = result.error.status || 500; // Default to 500 if status missing
                const message = result.error.message || 'An unknown validation error occurred.';
                res.status(status).json({ error: message });
            } else if (!result) {
                // Handle case where validateLogin returns null/undefined unexpectedly
                console.error("Controller error: validateLogin returned unexpected value:", result);
                res.status(500).json({ error: 'An unexpected error occurred during login.' });
            } else {
                // Success case
                res.status(200).json({
                    message: 'Login successful.',
                    user: {
                        id: result.id,
                        username: result.username,
                        email: result.email,
                        profile: { // Include profile details and permissions
                            id: result.userProfile.id,
                            name: result.userProfile.name,
                            permissions: result.userProfile.permissions
                        }
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