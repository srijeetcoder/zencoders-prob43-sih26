import fs from 'fs';
import path from 'path';
import { query, pool } from './database';

export async function runMigrations(): Promise<void> {
  console.log('🔄 Checking and applying database migrations...');
  try {
    const initSqlPath = path.resolve(__dirname, '../../init.sql');
    if (fs.existsSync(initSqlPath)) {
      const sql = fs.readFileSync(initSqlPath, 'utf8');
      // Execute the entire init script
      await query(sql);
      console.log('✅ Database schema and reference tables synchronized successfully.');
    } else {
      console.warn('⚠️ init.sql not found at', initSqlPath);
    }
  } catch (err: any) {
    console.error('❌ Database migration error:', err.message);
  }
}

// Allow direct execution via CLI
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🏁 Migration completed.');
      pool.end();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
