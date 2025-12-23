#!/usr/bin/env node
/**
 * Run database migrations before starting the server
 * This ensures the database schema is up to date on every deployment
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🔄 Running database migrations...');

const command = 'node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d ormconfig.ts';

exec(command, { cwd: path.join(__dirname) }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Migration failed:', error);
    console.error(stderr);
    process.exit(1);
  }

  console.log(stdout);
  console.log('✅ Migrations completed successfully');
  process.exit(0);
});
