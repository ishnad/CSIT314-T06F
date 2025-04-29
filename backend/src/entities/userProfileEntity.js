const { PrismaClient } = require('../generated/prisma');

class UserProfileEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    validate(name, description) {
        if (!name || !description) {
            return {
                status: 400,
                error: 'Profile name and description are required'
            };
        }
        return null;
    }

    async checkProfileNameExists(name) {
        const existingProfile = await this.prisma.userProfile.findUnique({
            where: { name },
        });

        if (existingProfile) {
            return {
                status: 409, // Conflict
                error: 'Profile name already exists.'
            };
        }
        return null;
    }


    async createUserProfile(name, description) {
        const validationError = this.validate(name, description);
        if (validationError) {
            return { error: validationError };
        }

        const nameExistsError = await this.checkProfileNameExists(name);
        if (nameExistsError) {
            return { error: nameExistsError };
        }

        try {
            const profile = await this.prisma.userProfile.create({
                data: {
                    name,
                    description
                }
            });
            // Return only necessary fields, similar to userAccountEntity
            return {
                id: profile.id,
                name: profile.name,
                description: profile.description
            };
        } catch (error) {
            console.error('Error creating user profile:', error);
            // Return structured error
            return {
                error: {
                    status: 500,
                    error: 'Failed to create user profile due to server error.'
                }
            };
        }
    }

    async listUserProfiles(filter, keyword) {
        const whereClause = {};

        if (filter && keyword && (filter === 'name' || filter === 'description')) {
            whereClause[filter] = { contains: keyword, mode: 'insensitive' };
        }

        return this.prisma.userProfile.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true
            }
        });
    }
}

module.exports = UserProfileEntity;