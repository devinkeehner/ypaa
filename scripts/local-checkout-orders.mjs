// Uses only the already running isolated ypaaTest Mongo; never loads developer env files.
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { MongoClient } from 'mongodb';

const action = process.argv[2] || 'test';
const env = { ...process.env, PAYLOAD_SECRET: 'synthetic-orders-only-secret', ENABLE_R2: 'false', PAYLOAD_ENABLE_MCP: 'false', RESEND_API_KEY: '', STRIPE_SECRET_KEY: '', STRIPE_WEBHOOK_SECRET: '', STRIPE_BACKFILL_SECRET: '', REGISTRATION_SITE_API_KEY: '', ISSUER_SERVICE_API_KEY: '', CASH_ACCESS_CODE: '', VERCEL: '', NEXT_TELEMETRY_DISABLED: '1', REGISTRATION_TEST_MAIL_CAPTURE: 'false' };
const run = (args, extra = {}) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env: { ...env, ...extra } });
  child.on('error', reject); child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Command exited ${code}`)));
});
if (action === 'test' || action === 'seed') {
  await run(['--import', 'tsx', 'tests/checkout-order-details.test.ts']);
  await run(['--import', 'tsx', 'tests/checkout-order-details.integration.ts'], { KEEP_ORDERS_QA: action === 'seed' ? 'true' : 'false' });
} else if (action === 'dev' || action === 'browser') {
  const qa = JSON.parse(await readFile('.orders-qa.json', 'utf8'));
  const parsed = new URL(qa.uri);
  if (parsed.hostname !== '127.0.0.1' || parsed.port !== '27029' || !/^ypaa_orders_test_[a-f0-9]{32}$/.test(qa.database) || parsed.pathname !== `/${qa.database}`) throw new Error('Not an isolated Orders QA database.');
  const mongo = new MongoClient(qa.uri, { serverSelectionTimeoutMS: 5000 });
  try { await mongo.connect(); if ((await mongo.db('admin').command({ hello: 1 })).setName !== 'ypaaTest') throw new Error('Not the isolated ypaaTest replica set.'); }
  finally { await mongo.close(); }
  if (action === 'dev') await run(['node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', '3039'], { DATABASE_URI: qa.uri });
  else await run(['tests/checkout-order-details.browser.mjs']);
} else throw new Error('Usage: node scripts/local-checkout-orders.mjs test|seed|dev|browser');
