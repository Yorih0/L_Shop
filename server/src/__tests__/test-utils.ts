import fs from 'fs';
import path from 'path';

const fixturesDir = path.join(__dirname, 'fixtures');
const dbDir = path.join(__dirname, '..', 'db');

export const resetDb = () => {
  // ensure db directory exists
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const files: Array<[string,string]> = [
    ['users.json', 'users.json'],
    ['products.json', 'products.json'],
    ['baskets.json', 'baskets.json']
  ];

  for (const [fixtureName, dbName] of files) {
    const src = path.join(fixturesDir, fixtureName);
    const dest = path.join(dbDir, dbName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    } else {
      // create empty defaults
      if (fixtureName === 'users.json') fs.writeFileSync(dest, '{"users":[]}', 'utf8');
      else fs.writeFileSync(dest, '[]', 'utf8');
    }
  }
};

export const readDb = (name: string) => {
  const p = path.join(dbDir, name);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
};

