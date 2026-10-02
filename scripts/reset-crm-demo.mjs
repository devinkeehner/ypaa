import { MongoClient, BSON } from 'mongodb';
import { mkdir, writeFile } from 'node:fs/promises';

process.loadEnvFile('.env.local');
const sourceURL = new URL(process.env.DATABASE_URI);
if (!['localhost', '127.0.0.1', '[::1]'].includes(sourceURL.hostname) || sourceURL.port === '27018') {
  throw new Error('Reset source must be the original local database on a different port.');
}
// Destination is fixed: never reset production or the original local database.
const source = new MongoClient(process.env.DATABASE_URI);
const target = new MongoClient('mongodb://127.0.0.1:27018/ypaa_crm_demo?replicaSet=crmDemo');
const collections = ['contacts', 'attendees', 'checkout-orders', 'registration-entitlements', 'breakfast-tickets', 'scholarship-contributions', 'registration-corrections'];
try {
  await Promise.all([source.connect(), target.connect()]);
  const db = target.db();
  if (!(await db.collection('_crm_demo_snapshot').findOne({ name: 'snapshot' }))) throw new Error('No initialized demo snapshot found.');
  const original = {}, backup = {};
  for (const name of collections) {
    original[name] = await source.db().collection(name).find({}).toArray();
    backup[name] = await db.collection(name).find({}).toArray();
  }
  if (!original.attendees.length || !original['checkout-orders'].length) throw new Error('Original CRM data is empty; refusing reset.');
  await mkdir('.local-crm/backups', { recursive: true });
  const backupPath = `.local-crm/backups/before-reset-${Date.now()}.json`;
  await writeFile(backupPath, BSON.EJSON.stringify(backup, { relaxed: false }), { flag: 'wx' });
  const session = target.startSession();
  try {
    await session.withTransaction(async () => {
      for (const name of collections) {
        await db.collection(name).deleteMany({}, { session });
        if (original[name].length) await db.collection(name).insertMany(original[name], { session });
      }
    });
  } finally { await session.endSession(); }
  for (const name of collections) {
    const restored = await db.collection(name).find({}).sort({ _id: 1 }).toArray();
    const expected = [...original[name]].sort((a, b) => String(a._id).localeCompare(String(b._id)));
    if (BSON.EJSON.stringify(restored) !== BSON.EJSON.stringify(expected)) throw new Error(`Reset verification failed: ${name}`);
  }
  console.log(`Demo CRM reset and verified against the original local records. Backup: ${backupPath}. Logins preserved.`);
} finally { await Promise.all([source.close(), target.close()]); }
