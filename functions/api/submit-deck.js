// Cloudflare Pages Function: POST /api/submit-deck
//
// Validates a deck submission, checks Cloudflare Turnstile, saves the founder as a
// Brevo contact, emails the deals inbox and sends the founder a confirmation.
// Settings come from environment variables; see .env.example and docs/DEPLOY.md.

const BREVO_API = 'https://api.brevo.com/v3';
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_BODY_BYTES = 20_000;

const LABELS = {
  lookingFor: { investment: 'Investment', incubation: 'Incubation', both: 'Investment and incubation' },
  pillar: { fintech: 'Fintech', blockchain: 'Blockchain', ai: 'AI', other: 'Other' },
  stage: {
    'pre-seed': 'Idea or pre-seed',
    seed: 'Seed',
    'series-a': 'Series A',
    'series-b-plus': 'Series B or later',
    established: 'Established business',
  },
  language: { en: 'English', 'zh-Hant': 'Traditional Chinese', ko: 'Korean', ja: 'Japanese' },
};

const FIELDS = {
  name: { label: 'Name', required: true, max: 120 },
  email: { label: 'Email', required: true, max: 200, type: 'email' },
  company: { label: 'Company', required: true, max: 120 },
  website: { label: 'Website', max: 300, type: 'url' },
  lookingFor: { label: 'Looking for', required: true, options: Object.keys(LABELS.lookingFor) },
  pillar: { label: 'Pillar', required: true, options: Object.keys(LABELS.pillar) },
  stage: { label: 'Stage', required: true, options: Object.keys(LABELS.stage) },
  raiseUsd: { label: 'Raising (USD)', max: 40 },
  country: { label: 'Country', required: true, max: 80 },
  oneLiner: { label: 'One-liner', required: true, max: 280 },
  deckUrl: { label: 'Deck', required: true, max: 500, type: 'url' },
  source: { label: 'Heard about us via', max: 200 },
  language: { label: 'Language', options: Object.keys(LABELS.language) },
};

const CONFIRMATION = {
  en: {
    subject: "We've received your deck",
    greeting: 'Hi {name},',
    body: "Thank you for sending us {company}. We read every submission, and if there's a fit, we'll reply within 10 business days.",
    signoff: 'The 01 Capital team',
  },
  'zh-Hant': {
    subject: '我們已收到您的簡報',
    greeting: '{name} 您好：',
    body: '感謝您與我們分享 {company}。我們會閱讀每一份投稿；如果合適，我們將在 10 個工作天內回覆您。',
    signoff: '零壹資本團隊',
  },
  ko: {
    subject: '피치덱을 잘 받았습니다',
    greeting: '{name}님, 안녕하세요.',
    body: '{company}에 대한 자료를 보내 주셔서 감사합니다. 저희는 모든 제출 자료를 검토하며, 적합하다고 판단되면 영업일 기준 10일 이내에 회신드리겠습니다.',
    signoff: '01 Capital 팀 드림',
  },
  ja: {
    subject: 'ピッチ資料を受け付けました',
    greeting: '{name} 様',
    body: '{company} についての資料をお送りいただき、ありがとうございます。いただいた資料はすべて拝見しており、ご縁がある場合は 10 営業日以内にご連絡いたします。',
    signoff: '01 Capital チーム',
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  const missing = ['BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'DEALS_INBOX_EMAIL'].filter((key) => !env[key]);
  if (missing.length) {
    console.error(`submit-deck: missing settings ${missing.join(', ')}`);
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'too_large' }, 413);
  }

  let input;
  try {
    input = await readBody(request);
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Bots fill in the hidden "fax" field. Report success and do nothing.
  if (typeof input.fax === 'string' && input.fax.trim()) return json({ ok: true });

  const { data, errors } = validate(input);
  if (errors.length) return json({ ok: false, error: 'validation', fields: errors }, 400);

  const captcha = await verifyTurnstile(input['cf-turnstile-response'], request, env);
  if (!captcha.ok) return json({ ok: false, error: captcha.error }, captcha.status);

  // The deals inbox email is what matters most, so a failed contact sync
  // is reported inside that email instead of failing the submission.
  const contact = await saveContact(data, env);
  const notified = await sendEmail(env, notificationEmail(data, env, contact));
  if (!notified.ok) return json({ ok: false, error: 'delivery' }, 502);

  await sendEmail(env, confirmationEmail(data, env));
  return json({ ok: true });
}

async function readBody(request) {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid JSON body');
    return body;
  }
  return Object.fromEntries((await request.formData()).entries());
}

export function validate(input) {
  const data = {};
  const errors = [];
  for (const [name, rule] of Object.entries(FIELDS)) {
    const value = typeof input[name] === 'string' ? input[name].trim() : '';
    data[name] = value;
    if (!value) {
      if (rule.required) errors.push(name);
      continue;
    }
    const invalid =
      (rule.max && value.length > rule.max) ||
      (rule.options && !rule.options.includes(value)) ||
      (rule.type === 'email' && !EMAIL_PATTERN.test(value)) ||
      (rule.type === 'url' && !isWebUrl(value));
    if (invalid) errors.push(name);
  }
  if (![true, 'true', 'yes', 'on'].includes(input.consent)) errors.push('consent');
  data.language ||= 'en';
  return { data, errors };
}

function isWebUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) {
    // Only for local development; production must set TURNSTILE_SECRET_KEY.
    if (env.ALLOW_MISSING_TURNSTILE === 'true') return { ok: true };
    console.error('submit-deck: TURNSTILE_SECRET_KEY is not set');
    return { ok: false, error: 'not_configured', status: 500 };
  }
  if (typeof token !== 'string' || !token) return { ok: false, error: 'captcha', status: 400 };

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.append('remoteip', ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY, { method: 'POST', body });
    const result = await response.json();
    return result.success ? { ok: true } : { ok: false, error: 'captcha', status: 400 };
  } catch (error) {
    console.error(`submit-deck: Turnstile check failed: ${error}`);
    return { ok: false, error: 'captcha_unavailable', status: 503 };
  }
}

async function saveContact(data, env) {
  const listId = Number(env.BREVO_DEALFLOW_LIST_ID);
  return brevo(env, '/contacts', {
    email: data.email,
    updateEnabled: true,
    attributes: {
      FULLNAME: data.name,
      COMPANY: data.company,
      WEBSITE: data.website,
      LOOKING_FOR: data.lookingFor,
      PILLAR: data.pillar,
      STAGE: data.stage,
      RAISE_USD: data.raiseUsd,
      COUNTRY: data.country,
      ONE_LINER: data.oneLiner,
      DECK_URL: data.deckUrl,
      SOURCE: data.source,
      LANGUAGE: data.language,
    },
    ...(Number.isInteger(listId) && listId > 0 ? { listIds: [listId] } : {}),
  });
}

function sendEmail(env, message) {
  return brevo(env, '/smtp/email', {
    sender: { name: env.BREVO_SENDER_NAME || '01 Capital', email: env.BREVO_SENDER_EMAIL },
    ...message,
  });
}

async function brevo(env, path, payload) {
  try {
    const response = await fetch(BREVO_API + path, {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) return { ok: true };
    const detail = (await response.text()).slice(0, 300);
    console.error(`submit-deck: Brevo ${path} returned ${response.status}: ${detail}`);
    return { ok: false, status: response.status, detail };
  } catch (error) {
    console.error(`submit-deck: Brevo ${path} failed: ${error}`);
    return { ok: false, status: 0, detail: String(error) };
  }
}

function notificationEmail(data, env, contact) {
  const display = (name) => LABELS[name]?.[data[name]] ?? data[name];
  const rows = Object.entries(FIELDS)
    .filter(([name]) => data[name])
    .map(([name, rule]) => [rule.label, display(name)]);
  const warning = contact.ok
    ? ''
    : `Saving this founder to Brevo failed (${contact.status || 'network error'}: ${contact.detail}). Add them to the deal-flow list by hand.`;

  const htmlRows = rows
    .map(([label, value]) => {
      const cell = /^https?:\/\//.test(value) ? `<a href="${escapeHtml(value)}">${escapeHtml(value)}</a>` : escapeHtml(value);
      return `<tr><th align="left" style="padding:6px 16px 6px 0;color:#666;font-weight:600;vertical-align:top">${escapeHtml(label)}</th><td style="padding:6px 0">${cell}</td></tr>`;
    })
    .join('');

  return {
    to: [{ email: env.DEALS_INBOX_EMAIL }],
    replyTo: { email: data.email, name: data.name },
    subject: `New deck: ${data.company} (${display('pillar')}, ${display('stage')})`,
    htmlContent: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">${
      warning ? `<p style="padding:12px;background:#fff4e5;border:1px solid #f0a35a">${escapeHtml(warning)}</p>` : ''
    }<p>A founder submitted a deck on 01.capital. Reply to this email to answer them.</p><table cellspacing="0" cellpadding="0">${htmlRows}</table></div>`,
    textContent: [
      warning,
      'A founder submitted a deck on 01.capital. Reply to this email to answer them.',
      '',
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ]
      .filter((line, i) => line || i > 0)
      .join('\n'),
  };
}

function confirmationEmail(data, env) {
  const copy = CONFIRMATION[data.language] ?? CONFIRMATION.en;
  const fill = (text) => text.replace('{name}', data.name).replace('{company}', data.company);
  const fillHtml = (text) => text.replace('{name}', escapeHtml(data.name)).replace('{company}', escapeHtml(data.company));
  return {
    to: [{ email: data.email, name: data.name }],
    replyTo: { email: env.DEALS_INBOX_EMAIL },
    subject: copy.subject,
    htmlContent: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111"><p>${fillHtml(copy.greeting)}</p><p>${fillHtml(copy.body)}</p><p>${escapeHtml(copy.signoff)}</p></div>`,
    textContent: `${fill(copy.greeting)}\n\n${fill(copy.body)}\n\n${copy.signoff}`,
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
