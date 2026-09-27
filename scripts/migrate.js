try {
  const Database = require('better-sqlite3');
  console.log('Loaded better-sqlite3');
  const fs = require('fs');
  const path = require('path');
  
  const dbPath = path.join(process.cwd(), 'data', 'birthday.db');
  const sqlite = new Database(dbPath);
  console.log('DB opened');
  
  const sqlPath = fs.readdirSync('drizzle').filter(f => f.endsWith('.sql'))[0];
  const sql = fs.readFileSync(path.join('drizzle', sqlPath), 'utf-8');
  
  sqlite.exec(sql);
  console.log('Migrated!');
} catch (e) {
  console.error('Error:', e);
}
