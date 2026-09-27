const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'birthday.db');
const db = new DatabaseSync(dbPath);

const sqlPath = fs.readdirSync('drizzle').filter(f => f.endsWith('.sql'))[0];
const sql = fs.readFileSync(path.join('drizzle', sqlPath), 'utf-8');

db.exec(sql);
console.log('Migrated using node:sqlite!');

const now = new Date().toISOString();

const memories = [
  {
    title: 'The Day We Started Talking',
    description: 'The universe decided to bring us together. A simple "hi" that changed everything. Who knew that February 13th would become one of the most important dates in my life?',
    date: '2025-02-13',
    emoji: '💬',
    photos: '[]',
    order: 1,
    type: 'milestone',
    quote: null,
  },
  {
    title: 'You Said Those Three Words',
    description: 'March 21st — the day my heart learned to fly. You told me you love me, and in that moment, the whole world stopped. Those words still echo in my heart every single day.',
    date: '2025-03-21',
    emoji: '💕',
    photos: '[]',
    order: 2,
    type: 'milestone',
    quote: 'I love you',
  },
  {
    title: 'Your Beautiful Henna Hands',
    description: "There's something magical about the way henna looks on your hands. Every pattern, every curve — a work of art, just like you.",
    date: '2025-03-21',
    emoji: '💅',
    photos: '[]',
    order: 3,
    type: 'photo',
    quote: null,
  },
  {
    title: 'When We First Met',
    description: 'Face to face, heart to heart. All those conversations finally came alive when I saw you standing there. That day proved that real connections transcend screens.',
    date: '2025-04-15',
    emoji: '🤝',
    photos: '[]',
    order: 4,
    type: 'milestone',
    quote: null,
  },
  {
    title: 'The Little Things You Tell Me',
    description: "You don't know this, but I remember every little thing you've told me. Your favorite things, your dreams, your stories — they're all safe with me. ❤️",
    date: '2025-05-01',
    emoji: '🌟',
    photos: '[]',
    order: 5,
    type: 'quote',
    quote: 'Every small detail about you is worth remembering.',
  },
];

const insert = db.prepare(`
  INSERT INTO memories (title, description, date, emoji, photos, "order", type, quote, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const item of memories) {
  insert.run(
    item.title,
    item.description,
    item.date,
    item.emoji,
    item.photos,
    item.order,
    item.type,
    item.quote,
    now,
    now
  );
}

console.log(`✅ Seeded ${memories.length} memories successfully!`);
