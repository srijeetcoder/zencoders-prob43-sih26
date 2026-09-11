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

    // Ensure all critical columns exist on users table even if pre-created earlier
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS government_id VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS institution_id UUID;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS district_id UUID;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id UUID;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(10);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp_expires_at TIMESTAMPTZ;
    `).catch((colErr) => {
      console.warn('Notice while ensuring user columns:', colErr.message);
    });
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
