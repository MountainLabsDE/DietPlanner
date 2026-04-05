import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setupTestDatabase = async () => {
  // Use in-memory SQLite for testing
  process.env.DATABASE_URL = 'file::memory:';
  
  // Initialize database
  await prisma.$connect();
  
  // Run migrations or push schema
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
};

export const cleanupTestDatabase = async () => {
  // Clean up all tables
  const tables = await prisma.$queryRaw<
    Array<{ name: string }>
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`;
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table.name}"`);
  }
  
  await prisma.$disconnect();
};

export const clearDatabase = async () => {
  // Clear all data between tests
  const tables = await prisma.$queryRaw<
    Array<{ name: string }>
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`;
  
  const disableForeignKeys = await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF');
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table.name}"`);
  }
  
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
};

export default prisma;
