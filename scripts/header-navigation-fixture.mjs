// Disposable, database-free QA app using the actual site components and styles.
import { cp, mkdtemp, mkdir, realpath, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixture = await mkdtemp(join(tmpdir(), 'ypaa-header-navigation-'));
const port = process.env.HEADER_NAVIGATION_TEST_PORT || '3038';
await mkdir(join(fixture, 'app'), { recursive: true });
await mkdir(join(fixture, 'components/site'), { recursive: true });
await mkdir(join(fixture, 'lib'), { recursive: true });
await symlink(await realpath(join(root, 'node_modules')), join(fixture, 'node_modules'));
for (const file of ['SiteFrame.tsx', 'HeaderNavigation.tsx', 'HeaderNavigation.module.css', 'TenantThemeProvider.tsx', 'CartLink.tsx', 'cart-store.ts', 'navigation-warning.ts']) await cp(join(root, 'components/site', file), join(fixture, 'components/site', file));
await cp(join(root, 'lib/header-navigation.ts'), join(fixture, 'lib/header-navigation.ts'));
await cp(join(root, 'app/globals.css'), join(fixture, 'app/globals.css'));
await cp(join(root, 'postcss.config.mjs'), join(fixture, 'postcss.config.mjs'));
await writeFile(join(fixture, 'package.json'), JSON.stringify({ name: 'header-navigation-qa', private: true, type: 'module' }));
await writeFile(join(fixture, 'next.config.mjs'), 'export default { experimental: { cpus: 1 }, allowedDevOrigins: ["127.0.0.1"] };');
await writeFile(join(fixture, 'app/layout.tsx'), `import './globals.css';
export const metadata = { title: 'Header navigation QA fixture' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
`);
await writeFile(join(fixture, 'app/page.tsx'), `"use client";
import { SiteFrame } from '../components/site/SiteFrame';
import { TenantThemeProvider, defaultTenantTheme } from '../components/site/TenantThemeProvider';
import { normalizeHeaderNavigation } from '../lib/header-navigation';
const navigation = normalizeHeaderNavigation([
  { id: 'duplicate', label: 'Parent', url: '/#parent', children: [
    { id: 'duplicate-child', label: 'Child one', url: '/#child-one' },
    { id: 'duplicate-child', label: 'Child two', url: '/#child-two' },
    { label: 'External child', url: 'https://example.invalid/child', newTab: true },
    { label: 'Warning child', url: 'https://example.invalid/warning', newTab: true, showWarning: true },
    { label: 'Disabled child', url: '/program' },
    { label: 'Invalid child', url: 'javascript:alert(1)' },
  ] },
  { id: 'duplicate', label: 'Second parent', url: '/#second', children: [{ label: 'Second child', url: '/#second-child' }] },
  { label: 'Flat link', url: '/#flat' },
  { label: 'Empty group', url: '/#empty', children: [] },
  { label: 'Register', url: '/#register', style: 'button' },
  { label: 'Book a hotel room', url: '/#hotel', style: 'button', appearance: 'outline' },
]);
export default function Page() { return <TenantThemeProvider settings={{ ...defaultTenantTheme, headerNavigation: navigation }}><SiteFrame mainId="fixture-main"><main id="fixture-main" style={{ minHeight: '110vh', padding: '160px 24px' }}><h1>Header navigation QA fixture</h1><p>Synthetic navigation data. No CMS reads or writes.</p><button type="button">Outside control</button><div id="parent">Parent destination</div><div id="child-one">Child destination</div></main></SiteFrame></TenantThemeProvider>; }
`);
console.log(`Fixture: ${fixture}\nURL: http://127.0.0.1:${port}`);
const server = spawn(process.execPath, [join(fixture, 'node_modules/next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', port], { cwd: fixture, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', (code) => process.exit(code ?? 0));
