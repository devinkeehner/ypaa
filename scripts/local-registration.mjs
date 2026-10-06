// This runner intentionally does not load the developer's .env or copy any existing database.
import { MongoClient } from 'mongodb';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

const action = process.argv[2];
const uri = 'mongodb://127.0.0.1:27029/ypaa_registration_test?replicaSet=ypaaTest';
const env = { ...process.env, DATABASE_URI: uri, PAYLOAD_SECRET: 'local-registration-synthetic-only-secret', RESEND_API_KEY: 'synthetic-capture-only', SCHOLARSHIP_FROM_EMAIL: 'NECYPAA Test <sender@example.invalid>', REGISTRATION_TEST_MAIL_CAPTURE: 'true', REGISTRATION_CHECK_TRUST_PROXY: 'false', REGISTRATION_CHECK_ORIGIN: 'http://127.0.0.1:3029', ENABLE_R2: 'false', PAYLOAD_ENABLE_MCP: 'false', VERCEL: '', STRIPE_SECRET_KEY: '', STRIPE_WEBHOOK_SECRET: '', STRIPE_BACKFILL_SECRET: '', REGISTRATION_SITE_API_KEY: '', ISSUER_SERVICE_API_KEY: '', CASH_ACCESS_CODE: '', NODE_ENV: 'development', HOTEL_REQUEST_ORIGIN: 'http://127.0.0.1:3029' };
const run = (args, extra = {}) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env: { ...env, ...extra } });
  child.on('error', reject); child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Command exited ${code}`)));
});
async function prepareMongo() {
  const client = new MongoClient('mongodb://127.0.0.1:27029/?directConnection=true', { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const hello = await client.db('admin').command({ hello: 1 });
    const options = await client.db('admin').command({ getCmdLineOpts: 1 });
    if ((options.parsed?.replication?.replSetName || options.parsed?.replication?.replSet) !== 'ypaaTest' || (hello.setName && hello.setName !== 'ypaaTest')) throw new Error('Port 27029 is not the isolated ypaaTest replica set. No data was changed.');
    if (!hello.isWritablePrimary) {
      try { await client.db('admin').command({ replSetInitiate: { _id: 'ypaaTest', members: [{ _id: 0, host: '127.0.0.1:27029' }] } }); }
      catch (error) { if (error.codeName !== 'AlreadyInitialized') throw error; }
    }
  } catch (error) {
    if (error.codeName === 'NotYetInitialized') await client.db('admin').command({ replSetInitiate: { _id: 'ypaaTest', members: [{ _id: 0, host: '127.0.0.1:27029' }] } });
    else throw error;
  } finally { await client.close(); }
  const ready = new MongoClient(uri, { serverSelectionTimeoutMS: 30000 });
  await ready.connect(); await ready.close();
}
if (action === 'mongo') {
  await mkdir('.local-registration/mongo', { recursive: true });
  const binary = process.env.MONGOD_PATH || 'mongod';
  const child = spawn(binary, ['--dbpath', join(process.cwd(), '.local-registration/mongo'), '--replSet', 'ypaaTest', '--bind_ip', '127.0.0.1', '--port', '27029', '--logpath', join(process.cwd(), '.local-registration/mongo.log')], { stdio: 'inherit' });
  child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  child.on('exit', (code) => { process.exitCode = code || 0; });
} else if (action === 'seed' || action === 'reset') {
  await prepareMongo();
  const client = new MongoClient(uri); await client.connect();
  try {
    const db = client.db(); const names = await db.listCollections().toArray();
    const marker = await db.collection('_synthetic_test_marker').findOne({ _id: 'registration' });
    if (names.length && marker?.synthetic !== true) throw new Error('The test database has unrecognized data. No data was changed.');
    if (action === 'reset') await db.dropDatabase();
    await db.collection('_synthetic_test_marker').updateOne({ _id: 'registration' }, { $set: { synthetic: true } }, { upsert: true });
  } finally { await client.close(); }
  await mkdir('.local-registration', { recursive: true });
  await writeFile('.local-registration/mail.ndjson', '');
  await run(['--import', 'tsx', 'scripts/registration-test-seed.ts']);
} else if (action === 'hotel-seed') {
  await prepareMongo();
  await run(['--import', 'tsx', 'scripts/hotel-request-test-seed.ts']);
} else if (action === 'dev' || action === 'hotel-dev' || action === 'build' || action === 'dry-run') {
  await prepareMongo();
  const client = new MongoClient(uri); await client.connect();
  try { if ((await client.db().collection('_synthetic_test_marker').findOne({ _id: 'registration' }))?.synthetic !== true) throw new Error('Run the synthetic seed first.'); } finally { await client.close(); }
  if (action === 'dry-run') { await run(['--import', 'tsx', 'scripts/dry-run-registration-tracker.ts', process.argv[3] || '']); process.exit(0); }
  if (action === 'build') { await run(['node_modules/payload/bin.js', 'generate:importmap']); await run(['node_modules/next/dist/bin/next', 'build'], { NODE_ENV: 'production', REGISTRATION_TEST_MAIL_CAPTURE: 'false' }); process.exit(0); }
  await run(['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3029']);
} else if (action === 'hotel-test') {
  await prepareMongo();
  await run(['--import', 'tsx', '--test', '--test-concurrency=1', '--test-force-exit', 'tests/hotel-requests.test.ts'], { DATABASE_URI: `mongodb://127.0.0.1:27029/ypaa_registration_test_${randomUUID().replaceAll('-', '')}?replicaSet=ypaaTest` });
} else if (action === 'test') {
  await prepareMongo();
  await run(['--import', 'tsx', '--test', '--test-concurrency=1', '--test-force-exit', 'tests/registration-check.test.ts', 'tests/registration-import.test.ts'], { DATABASE_URI: `mongodb://127.0.0.1:27029/ypaa_registration_test_${randomUUID().replaceAll('-', '')}?replicaSet=ypaaTest` });
} else if (action === 'hotel-browser') {
  await run(['tests/hotel-requests.browser.mjs']);
} else if (action === 'browser') {
  await run(['tests/registration-check.browser.mjs']);
  await run(['tests/registration-import.browser.mjs']);
} else throw new Error('Usage: node scripts/local-registration.mjs mongo|seed|reset|dev|build|test|browser|dry-run [tracker.xlsx]|hotel-seed|hotel-test|hotel-dev|hotel-browser');
