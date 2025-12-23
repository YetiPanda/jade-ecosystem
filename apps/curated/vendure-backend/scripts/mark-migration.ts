import AppDataSource from '../ormconfig';

async function markMigrationAsExecuted() {
  try {
    await AppDataSource.initialize();
    console.log('✓ Database connection established');

    await AppDataSource.query(`
      INSERT INTO jade.migrations (timestamp, name)
      VALUES (1730000000003, 'ProductTaxonomy1730000000003')
      ON CONFLICT DO NOTHING
    `);

    console.log('✓ Migration marked as executed');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

markMigrationAsExecuted();
