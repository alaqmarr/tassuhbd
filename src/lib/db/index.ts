import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'birthday.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Convert absolute path to a file URI format that libsql expects for local files
// Add file: prefix and replace backslashes with forward slashes for Windows compatibility
const fileUrl = `file:${dbPath.replace(/\\/g, '/')}`;

// Global variable for singleton pattern to prevent multiple instances during hot reloads
let client;

if (process.env.NODE_ENV === 'production') {
  client = createClient({ url: fileUrl });
} else {
  if (!globalThis._libsqlClient) {
    globalThis._libsqlClient = createClient({ url: fileUrl });
  }
  client = globalThis._libsqlClient;
}

export const db = drizzle(client, { schema });

declare global {
  var _libsqlClient: any;
}
