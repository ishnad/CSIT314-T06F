const { PrismaClient } = require('../generated/prisma');

class ProfileInsightsEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Fetches view statistics for a cleaner's profile.
     * @param {string} cleanerUserId - The ID of the cleaner.
     * @returns {Promise<object>} An object containing total views and daily views for the last week,
     *                            or a message if no views, or an error object.
     */
    async fetchViewStats(cleanerUserId) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Start of the 6th day ago (to include 7 full days with today)
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const todayEndDate = new Date();
        todayEndDate.setHours(23, 59, 59, 999); // End of today

        try {
            // Get total views for all time
            const totalViews = await this.prisma.profileView.count({
                where: {
                    viewedProfileId: cleanerUserId,
                },
            });

            if (totalViews === 0) {
                return { message: "No profile views yet" };
            }

            // Get views within the last 7 days for daily breakdown
            const recentViews = await this.prisma.profileView.findMany({
                where: {
                    viewedProfileId: cleanerUserId,
                    viewedAt: {
                        gte: sevenDaysAgo,
                        lte: todayEndDate,
                    },
                },
                orderBy: {
                    viewedAt: 'asc',
                },
                select: {
                    viewedAt: true,
                }
            });

            // Initialize daily views map for the last 7 days (today, yesterday, ..., day-6 ago)
            const dailyViewsMap = new Map();
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD
                dailyViewsMap.set(dateString, 0);
            }

            // Populate the map with actual view counts
            recentViews.forEach(view => {
                const dateString = view.viewedAt.toISOString().split('T')[0];
                if (dailyViewsMap.has(dateString)) {
                    dailyViewsMap.set(dateString, dailyViewsMap.get(dateString) + 1);
                }
            });

            const dailyViewsLastWeek = Array.from(dailyViewsMap.entries())
                .map(([date, count]) => ({ date, views: count }))
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending by date (most recent first)

            return {
                totalViews,
                dailyViewsLastWeek,
            };

        } catch (error) {
            console.error(`Error fetching view stats for user ${cleanerUserId}:`, error);
            return { error: { status: 500, error: 'Failed to retrieve profile view statistics due to a server error.' } };
        }
    }
}

module.exports = ProfileInsightsEntity;