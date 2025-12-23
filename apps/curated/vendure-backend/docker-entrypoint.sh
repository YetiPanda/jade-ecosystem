#!/bin/sh
set -e

echo "🚀 Starting JADE Vendure Backend..."

# Create jade schema and enable UUID extension BEFORE running migrations
# Use admin credentials if available (for managed databases like Northflank)
echo "📋 Ensuring database schema exists..."
cd /app/apps/vendure-backend
node -e "
const { Client } = require('pg');
const adminUser = process.env.DATABASE_ADMIN_USER || process.env.DATABASE_USER;
const adminPassword = process.env.DATABASE_ADMIN_PASSWORD || process.env.DATABASE_PASSWORD;
const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: adminUser,
  password: adminPassword,
  database: process.env.DATABASE_NAME,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});
client.connect()
  .then(() => client.query('CREATE SCHEMA IF NOT EXISTS jade'))
  .then(() => client.query('CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"'))
  .then(() => client.query('GRANT ALL ON SCHEMA jade TO ' + process.env.DATABASE_USER))
  .then(() => { console.log('✓ Schema ready'); client.end(); })
  .catch(err => { console.error('Schema creation failed:', err.message); client.end(); process.exit(1); });
"

# Run database migrations
echo "📦 Running database migrations..."
npx typeorm migration:run -d dist/config/database.js || {
    echo "⚠️  Migration failed or no migrations to run"
    echo "Continuing with server startup..."
}

# Start the application
echo "✅ Starting server..."
exec node dist/index.js
