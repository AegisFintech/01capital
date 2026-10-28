#!/usr/bin/env node
// Serves dist/ locally, roughly the way Cloudflare Pages does: clean URLs,
// _redirects, 404.html, and the deck form function (with a mock Brevo unless
// real keys are set in the environment).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const redirects = (await readFile(path.join(DIST, '_redirects'), 'utf8').catch(() => ''))
  .split('\n')
  .map((line) => line.trim().split(/\s+/))
  .filter((parts) => parts.length >= 2 && !parts[0].startsWith('#'));

const { onRequestPost } = await import(pathToFileURL(path.join(ROOT, 'functions/api/submit-deck.js')).href);
const env = {
  BREVO_API_KEY: process.env.BREVO_API_KEY ?? 'local-mock',
  BREVO_DEALFLOW_LIST_ID: process.env.BREVO_DEALFLOW_LIST_ID ?? '1',
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL ?? 'noreply@01.capital',
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME ?? '01 Capital',
  DEALS_INBOX_EMAIL: process.env.DEALS_INBOX_EMAIL ?? 'deals@01.capital',
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? '',
  ALLOW_MISSING_TURNSTILE: process.env.TURNSTILE_SECRET_KEY ? 'false' : 'true',
};
if (env.BREVO_API_KEY === 'local-mock') {
  // Without real keys, log the Brevo calls instead of sending them.
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (String(url).startsWith('https://api.brevo.com/')) {
      console.log(`[mock brevo] ${init.method} ${url}\n${init.body}\n`);
      return new Response(JSON.stringify({ id: 1, messageId: 'mock' }), { status: 201 });
    }
    return realFetch(url, init);
  };
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/submit-deck') {
    const body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
    const request = new Request(url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? body : undefined });
    const response = req.method === 'POST' ? await onRequestPost({ request, env }) : new Response('Method not allowed', { status: 405 });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }

  const redirect = redirects.find(([from]) => from === url.pathname);
  if (redirect) {
    res.writeHead(Number(redirect[2] ?? 302), { location: redirect[1] });
    res.end();
    return;
  }

  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    if (!url.pathname.endsWith('/') && !path.extname(url.pathname)) {
      res.writeHead(308, { location: `${url.pathname}/${url.search}` });
      res.end();
      return;
    }
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    res.end(await readFile(path.join(DIST, '404.html')));
  }
}).listen(PORT, () => console.log(`Previewing dist/ at http://localhost:${PORT}`));
