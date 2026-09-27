import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log(`\nAdd this to your .env.local:\nADMIN_PASSWORD_HASH=${hash}`);
