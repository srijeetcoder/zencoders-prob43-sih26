import fs from 'fs';
import path from 'path';
import { query } from '../config/database';

export async function initializeDatabase(): Promise<void> {
  console.log('🚀 Initializing PostgreSQL Schema & pgvector Extensions...');
  const initSqlPath = path.resolve(process.cwd(), 'init.sql');
  const sql = fs.readFileSync(initSqlPath, 'utf-8');

  try {
    await query(sql);
    console.log('✅ Database schema and pgvector indexes initialized successfully.');
  } catch (error: any) {
    console.error('❌ Failed to initialize database:', error.message);
    throw error;
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
