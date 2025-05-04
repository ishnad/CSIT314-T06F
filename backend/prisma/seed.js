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
    { name: 'Platform Management', description: 'User who manages service categories and reporting.' },
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

  // --- Seed Bulk Users ---
  console.log('Starting bulk user seeding...');

  const profilesToSeedUsers = ['Homeowner', 'Cleaner', 'Platform Management'];
  const usersPerProfile = 100;
  const defaultPassword = 'password123'; // Default password for seeded users
  const hashedPassword = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

  for (const profileName of profilesToSeedUsers) {
    const profile = await prisma.userProfile.findUnique({
      where: { name: profileName },
    });

    if (!profile) {
      console.warn(`Profile '${profileName}' not found. Skipping user seeding for this profile.`);
      continue;
    }

    console.log(`Seeding ${usersPerProfile} users for profile: ${profileName}`);
    const usersToCreate = [];
    for (let i = 1; i <= usersPerProfile; i++) {
      const username = `${profileName.toLowerCase().replace(/\s+/g, '')}${i}`; // e.g., homeowner1, cleaner50
      const email = `${username}@example.com`;
      usersToCreate.push({
        username: username,
        password: hashedPassword,
        email: email,
        userProfileId: profile.id,
        status: 'ACTIVE',
      });
    }

    for (const userData of usersToCreate) {
       await prisma.userAccount.upsert({
         where: { username: userData.username },
         update: { // Update if exists, ensure correct profile and status
            password: hashedPassword,
            email: userData.email,
            userProfileId: userData.userProfileId,
            status: 'ACTIVE',
         },
         create: userData, // Create if not exists
       });
    }
     console.log(`Finished seeding users for profile: ${profileName}`);
  }
  // --- End Seed Bulk Users ---


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