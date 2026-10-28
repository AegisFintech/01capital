import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { onRequestPost } from '../functions/api/submit-deck.js';

const ENV = {
  BREVO_API_KEY: 'test-key',
  BREVO_DEALFLOW_LIST_ID: '7',
  BREVO_SENDER_EMAIL: 'noreply@01.capital',
  BREVO_SENDER_NAME: '01 Capital',
  DEALS_INBOX_EMAIL: 'deals@01.capital',
  TURNSTILE_SECRET_KEY: 'secret',
};

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical <Engines>',
  website: 'https://example.com',
  lookingFor: 'both',
  pillar: 'fintech',
  stage: 'seed',
  raiseUsd: '2,000,000',
  country: 'Singapore',
  oneLiner: 'Programmable treasury for exporters.',
  deckUrl: 'https://docsend.com/view/abc',
  source: 'X',
  language: 'ko',
  consent: true,
  'cf-turnstile-response': 'token',
};

let calls;
let responses;
const realFetch = globalThis.fetch;
const realError = console.error;

beforeEach(() => {
  calls = [];
  responses = {};
  console.error = () => {};
  globalThis.fetch = async (url, init = {}) => {
    const key = String(url);
    calls.push({ url: key, init, body: typeof init.body === 'string' ? JSON.parse(init.body) : init.body });
    if (key.includes('turnstile')) return Response.json(responses.turnstile ?? { success: true });
    if (key.endsWith('/contacts')) return responses.contacts ?? new Response(null, { status: 201 });
    if (key.endsWith('/smtp/email')) return (responses.email?.shift?.() ?? new Response('{"messageId":"1"}', { status: 201 }));
    throw new Error(`Unexpected fetch ${key}`);
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
});

const post = (body, env = ENV, headers = { 'content-type': 'application/json' }) =>
  onRequestPost({
    request: new Request('https://www.01.capital/api/submit-deck', {
      method: 'POST',
      headers,
      body: typeof body === 'string' || body instanceof URLSearchParams ? body : JSON.stringify(body),
    }),
    env,
  });

test('saves the contact, emails the deals inbox and confirms to the founder', async () => {
  const response = await post(VALID);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });

  assert.deepEqual(calls.map((c) => c.url), [
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    'https://api.brevo.com/v3/contacts',
    'https://api.brevo.com/v3/smtp/email',
    'https://api.brevo.com/v3/smtp/email',
  ]);

  const contact = calls[1];
  assert.equal(contact.init.headers['api-key'], 'test-key');
  assert.deepEqual(contact.body.listIds, [7]);
  assert.equal(contact.body.updateEnabled, true);
  assert.equal(contact.body.attributes.COMPANY, 'Analytical <Engines>');
  assert.equal(contact.body.attributes.DECK_URL, 'https://docsend.com/view/abc');

  const deals = calls[2].body;
  assert.deepEqual(deals.to, [{ email: 'deals@01.capital' }]);
  assert.deepEqual(deals.replyTo, { email: 'ada@example.com', name: 'Ada Lovelace' });
  assert.equal(deals.subject, 'New deck: Analytical <Engines> (Fintech, Seed)');
  assert.match(deals.htmlContent, /Analytical &lt;Engines&gt;/);
  assert.doesNotMatch(deals.htmlContent, /<Engines>/);

  const confirmation = calls[3].body;
  assert.deepEqual(confirmation.to, [{ email: 'ada@example.com', name: 'Ada Lovelace' }]);
  assert.equal(confirmation.subject, '피치덱을 잘 받았습니다');
  assert.deepEqual(confirmation.replyTo, { email: 'deals@01.capital' });
});

test('accepts form-encoded submissions', async () => {
  const form = new URLSearchParams({ ...VALID, consent: 'yes' });
  const response = await post(form, ENV, { 'content-type': 'application/x-www-form-urlencoded' });
  assert.equal(response.status, 200);
});

test('rejects invalid fields and names them', async () => {
  const response = await post({ ...VALID, email: 'not-an-email', stage: 'series-z', deckUrl: 'javascript:alert(1)', consent: false });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.error, 'validation');
  assert.deepEqual(body.fields.sort(), ['consent', 'deckUrl', 'email', 'stage']);
  assert.equal(calls.length, 0);
});

test('requires the required fields', async () => {
  const response = await post({ consent: true });
  const body = await response.json();
  assert.deepEqual(body.fields.sort(), ['company', 'country', 'deckUrl', 'email', 'lookingFor', 'name', 'oneLiner', 'pillar', 'stage']);
});

test('quietly drops submissions that fill in the honeypot', async () => {
  const response = await post({ ...VALID, fax: 'spam' });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 0);
});

test('rejects a failed spam check without calling Brevo', async () => {
  responses.turnstile = { success: false };
  const response = await post(VALID);
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'captcha');
  assert.equal(calls.length, 1);
});

test('rejects a missing spam-check token', async () => {
  const { 'cf-turnstile-response': _, ...withoutToken } = VALID;
  const response = await post(withoutToken);
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test('fails closed when Turnstile is not configured', async () => {
  const { TURNSTILE_SECRET_KEY: _, ...env } = ENV;
  const response = await post(VALID, env);
  assert.equal(response.status, 500);
  assert.equal(calls.length, 0);
});

test('allows skipping Turnstile only when explicitly enabled for local development', async () => {
  const { TURNSTILE_SECRET_KEY: _, ...env } = ENV;
  const response = await post(VALID, { ...env, ALLOW_MISSING_TURNSTILE: 'true' });
  assert.equal(response.status, 200);
  assert.ok(calls.every((c) => !c.url.includes('turnstile')));
});

test('returns 500 when Brevo settings are missing', async () => {
  const response = await post(VALID, { ...ENV, BREVO_API_KEY: '' });
  assert.equal(response.status, 500);
  assert.equal(calls.length, 0);
});

test('still notifies the deals inbox when saving the contact fails', async () => {
  responses.contacts = new Response('{"message":"Attribute COMPANY does not exist"}', { status: 400 });
  const response = await post(VALID);
  assert.equal(response.status, 200);
  const deals = calls.find((c) => c.url.endsWith('/smtp/email')).body;
  assert.match(deals.textContent, /Saving this founder to Brevo failed/);
});

test('reports an error when the deals email cannot be sent', async () => {
  responses.email = [new Response('{"message":"sender not verified"}', { status: 400 })];
  const response = await post(VALID);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).error, 'delivery');
});

test('rejects oversized requests', async () => {
  const response = await post(VALID, ENV, { 'content-type': 'application/json', 'content-length': '50000' });
  assert.equal(response.status, 413);
});

test('falls back to English for unknown languages', async () => {
  const response = await post({ ...VALID, language: 'fr' });
  assert.equal(response.status, 400);
  const ok = await post({ ...VALID, language: '' });
  assert.equal(ok.status, 200);
  assert.equal(calls.at(-1).body.subject, "We've received your deck");
});
