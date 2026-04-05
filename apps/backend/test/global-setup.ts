import { setupTestDatabase } from './database';

module.exports = async () => {
  console.log('Setting up test database...');
  await setupTestDatabase();
  console.log('Test database ready');
};
