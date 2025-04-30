const { PrismaClient } = require('@prisma/client');

class UserProfileEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUserProfile(name, description) {
        try {
            const profile = await this.prisma.userProfile.create({
                data: {
                    name,
                    description
                }
            });
            return profile;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    async getProfileById(id) {
        return this.prisma.userProfile.findUnique({
            where: { id }
        });
    }

    async updateProfile(id, name, description) {
        return this.prisma.userProfile.update({
            where: { id },
            data: { name, description }
        });
    }

    async deleteProfile(id) {
        return this.prisma.userProfile.delete({
            where: { id }
        });
    }

    async listProfiles() {
        return this.prisma.userProfile.findMany();
    }
}

module.exports = UserProfileEntity;