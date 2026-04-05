import { cleanupTestDatabase } from './database';

module.exports = async () => {
  console.log('Cleaning up test database...');
  await cleanupTestDatabase();
  console.log('Test database cleaned up');
};
