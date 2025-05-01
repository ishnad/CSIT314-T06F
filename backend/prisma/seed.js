const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const SALT_ROUNDS = 10; // Define salt rounds for hashing

async function main() {
  console.log(`Start seeding ...`);

  // Define default user profiles
  const profilesToSeed = [
    { name: 'UserAdmin', description: 'Administrator with full access.' },
    { name: 'Homeowner', description: 'User who owns properties and books services.' },
    { name: 'Cleaner', description: 'User who provides cleaning services.' },
  ];

  for (const profileData of profilesToSeed) {
    const profile = await prisma.userProfile.upsert({
      where: { name: profileData.name }, // Check if profile with this name exists
      update: {}, // Don't update if it exists
      create: profileData, // Create if it doesn't exist
    });
    console.log(`Created or found profile with name: ${profile.name}`);
  }

  // --- Seed Default Admin User ---
  const adminProfile = await prisma.userProfile.findUnique({
    where: { name: 'UserAdmin' },
  });

  if (adminProfile) {
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // Default password
    const adminEmail = 'admin@example.com'; // Default email

    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    const adminUser = await prisma.userAccount.upsert({
      where: { username: adminUsername },
      update: {
        // Optionally update fields if admin user already exists
        password: hashedPassword, // Ensure password is the default one
        email: adminEmail,
        userProfileId: adminProfile.id,
        status: 'ACTIVE', // Ensure admin is active
      },
      create: {
        username: adminUsername,
        password: hashedPassword,
        email: adminEmail,
        userProfileId: adminProfile.id,
        status: 'ACTIVE',
      },
    });
    console.log(`Created or updated admin user: ${adminUser.username}`);
  } else {
    console.warn("Could not seed admin user because 'UserAdmin' profile was not found.");
  }
  // --- End Seed Default Admin User ---

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });