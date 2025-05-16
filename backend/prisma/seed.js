const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const SALT_ROUNDS = 10; // Define salt rounds for hashing

async function main() {
  console.log(`Start seeding ...`);

  const profilesToSeed = [
    { name: 'UserAdmin', permissions: ['ADMIN_PRIVILEGES', 'MANAGE_SERVICES', 'SEARCH_CLEANERS', 'VIEW_REPORTS'] },
    { name: 'Homeowner', permissions: ['SEARCH_CLEANERS'] },
    { name: 'Cleaner', permissions: ['MANAGE_SERVICES'] },
    { name: 'Platform Management', permissions: ['VIEW_REPORTS', 'MANAGE_SERVICES'] },
  ];

  for (const profileData of profilesToSeed) {
    const profile = await prisma.userProfile.upsert({
      where: { name: profileData.name },
      update: { permissions: profileData.permissions },
      create: {
          name: profileData.name,
          permissions: profileData.permissions,
      },
    });
    console.log(`Created or updated profile '${profile.name}' with permissions: ${profile.permissions.join(', ')}`);
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


  // --- Seed Service Categories ---
  const serviceCategories = [
    { name: 'Basic Cleaning', description: 'General cleaning services' },
    { name: 'Deep Cleaning', description: 'Thorough cleaning of entire home' },
    { name: 'Window Cleaning', description: 'Interior and exterior window cleaning' },
    { name: 'Carpet Cleaning', description: 'Professional carpet and rug cleaning' },
    { name: 'Move-In/Move-Out Cleaning', description: 'Cleaning for property transitions' }
  ];

  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { serviceCatName: category.name },
      update: {},
      create: {
        serviceCatName: category.name,
        serviceCatDescription: category.description,
        status: 'ACTIVE'
      }
    });
  }
  console.log('Seeded service categories');

  // --- Seed Service Listings ---
  const cleaners = await prisma.userAccount.findMany({
    where: {
      userProfile: {
        name: 'Cleaner'
      }
    },
    take: 20 // Only seed listings for first 20 cleaners
  });

  const categories = await prisma.serviceCategory.findMany();

  for (const cleaner of cleaners) {
    // Each cleaner gets 1-3 random service listings
    const listingCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < listingCount; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const rate = Math.floor(Math.random() * 20) + 15; // Random rate between 15-35

      await prisma.serviceListing.create({
        data: {
          description: `${randomCategory.serviceCatName} service by ${cleaner.username}`,
          ratePerHr: rate,
          cleanerId: cleaner.id,
          serviceCategoryId: randomCategory.id,
          status: 'ACTIVE'
        }
      });
    }
  }
  console.log('Seeded service listings');

  // --- Seed Profile Views ---
  const homeowners = await prisma.userAccount.findMany({
    where: {
      userProfile: {
        name: 'Homeowner'
      }
    },
    take: 30
  });

  for (let i = 0; i < 100; i++) { // Create 100 random profile views
    const randomViewer = homeowners[Math.floor(Math.random() * homeowners.length)];
    const randomCleaner = cleaners[Math.floor(Math.random() * cleaners.length)];
    
    // Random date in last 30 days
    const viewedAt = new Date();
    viewedAt.setDate(viewedAt.getDate() - Math.floor(Math.random() * 30));

    await prisma.profileView.create({
      data: {
        viewedProfileId: randomCleaner.id,
        viewerId: randomViewer.id,
        viewedAt: viewedAt
      }
    });
  }
  console.log('Seeded profile views');

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