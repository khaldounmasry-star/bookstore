import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Script invoked: Seeding database...');

  const commonHash = await bcrypt.hash('test1234', 10);
  const superHash  = await bcrypt.hash('supersecret', 10);

  const superAdmin = await prisma.person.create({
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@bookstore.com',
      role: 'SUPER_ADMIN',
      passwords: {
        create: [{ hash: superHash }]
      }
    }
  });

  const admin = await prisma.person.create({
    data: {
      firstName: 'Khaldoun',
      lastName: 'Masry',
      email: 'khaldounmasry@gmail.com',
      role: Role.ADMIN,
      passwords: {
        create: [{ hash: commonHash }]
      }
    }
  });

  const user = await prisma.person.create({
    data: {
      firstName: 'Khal',
      lastName: 'M',
      email: 'khaldounm@gmail.com',
      role: Role.USER,
      passwords: {
        create: [{ hash: commonHash }]
      }
    }
  });

  console.log(`Users created:
  - super admin: ${superAdmin.email}
  - admin:       ${admin.email}
  - user:        ${user.email}`);

  console.log('Seeding 200 books...');

  for (let i = 1; i <= 200; i++) {
    const title = faker.commerce.productName();
    const author = faker.person.fullName();
    const description = faker.lorem.sentence({ min: 8, max: 16 });
    const genre = faker.book.genre();
    const year = faker.number.int({ min: 1950, max: 2024 });
    const rating = faker.number.float({ min: 0, max: 5, fractionDigits: 1 });
    const price = parseFloat(faker.commerce.price({ min: 5, max: 60, dec: 2 }));
    const sku = faker.string.uuid();

    await prisma.book.create({
      data: {
        title,
        author,
        description,
        genre,
        year,
        rating,
        price,
        sku,
        covers: {
          create: Array.from({ length: 5 }).map((_, idx) => ({
            imageUrl: `https://picsum.photos/seed/book-${i}-img-${idx}/500/800`
          }))
        }
      }
    });

    if (i % 20 === 0) console.log(`Created ${i} books...`);
  }

  console.log('Terminating script: Done seeding 200 books and 3 users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
