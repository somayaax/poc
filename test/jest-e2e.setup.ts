/**
 * Valid Mongo URI for e2e (defaults match docker-compose `database` service credentials).
 * Override with DATABASE_URI in the environment when needed.
 */
process.env.DATABASE_URI =
  process.env.DATABASE_URI ||
  'mongodb://root:rootUserPW123@127.0.0.1:27017/bookstore_e2e?authSource=admin&directConnection=true';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';
process.env.SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'e2e@local.test';
process.env.SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'E2eTest1!';
