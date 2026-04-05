import { setupTestDatabase, cleanupTestDatabase, clearDatabase } from './database';

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await cleanupTestDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRATION = '1h';
process.env.JWT_REFRESH_EXPIRATION = '7d';
