import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDb } from './config/db.js';

const PORT = Number(process.env.PORT || 5000);

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET');
  }

  await connectDb(process.env.MONGO_URI);

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
