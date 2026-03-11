process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgres://test:test@localhost:5432/testdb";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-key-1234";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "test-refresh-secret-key-1234";
