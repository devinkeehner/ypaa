import { MongoClient } from 'mongodb';
import { mkdir, writeFile } from 'node:fs/promises';

process.loadEnvFile('.env.local');
const sourceURL = new URL(process.env.DATABASE_URI);
if (!['localhost', '127.0.0.1', '[::1]'].includes(sourceURL.hostname) || sourceURL.port === '27018') throw new Error('The demo must be copied from the existing local database on a different port.');
const direct = new MongoClient('mongodb://127.0.0.1:27018/?directConnection=true', { serverSelectionTimeoutMS: 15000 });
await direct.connect();
try {
  const hello = await direct.db('admin').command({ hello: 1 });
  if (hello.setName && hello.setName !== 'crmDemo') throw new Error('Port 27018 belongs to another replica set.');
  if (!hello.setName) await direct.db('admin').command({ replSetInitiate: { _id: 'crmDemo', members: [{ _id: 0, host: '127.0.0.1:27018' }] } });
} finally { await direct.close(); }
const source = new MongoClient(process.env.DATABASE_URI);
const target = new MongoClient('mongodb://127.0.0.1:27018/ypaa_crm_demo?replicaSet=crmDemo', { serverSelectionTimeoutMS: 30000 });
try {
  await Promise.all([source.connect(), target.connect()]);
  const db = target.db();
  const marker = db.collection('_crm_demo_snapshot');
  let snapshot = await marker.findOne({ name: 'snapshot' });
  if (!snapshot) {
    const existing = await db.listCollections().toArray();
    if (existing.some((c) => c.name !== '_crm_demo_snapshot')) throw new Error('The demo database already contains an unfinished copy. Inspect it before retrying; no data was overwritten.');
    const collections = await source.db().listCollections().toArray();
    for (const collection of collections.filter((c) => !c.name.startsWith('system.'))) {
      const destination = await db.createCollection(collection.name);
      const cursor = source.db().collection(collection.name).find({});
      let batch = [];
      for await (const doc of cursor) { batch.push(doc); if (batch.length === 250) { await destination.insertMany(batch); batch = []; } }
      if (batch.length) await destination.insertMany(batch);
      for (const index of await source.db().collection(collection.name).indexes()) {
        if (index.name === '_id_') continue;
        const { key, v, ns, ...options } = index;
        await destination.createIndex(key, options);
      }
    }
    const latest = await db.collection('checkout-orders').findOne({}, { sort: { purchasedAt: -1 }, projection: { purchasedAt: 1 } });
    snapshot = { name: 'snapshot', copiedAt: new Date().toISOString(), latestPaymentDate: latest?.purchasedAt ? new Date(latest.purchasedAt).toISOString().slice(0, 10) : 'unknown' };
    await marker.insertOne(snapshot);
  }
  await mkdir('.local-crm', { recursive: true });
  await writeFile('.local-crm/snapshot.json', JSON.stringify(snapshot, null, 2));
  console.log(`Isolated CRM demo ready. Latest imported payment: ${snapshot.latestPaymentDate}. Existing local data was only read.`);
} finally { await Promise.all([source.close(), target.close()]); }
