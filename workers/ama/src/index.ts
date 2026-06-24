export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  ALLOWED_ORIGIN: string;
}

const MIN_LEN = 10;
const MAX_LEN = 500;

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const reqOrigin = request.headers.get('Origin') ?? '';
    const allowedOrigin = env.ALLOWED_ORIGIN;
    const isDev =
      reqOrigin.startsWith('http://localhost:') || reqOrigin.startsWith('http://127.0.0.1:');
    const effectiveOrigin = isDev ? reqOrigin : allowedOrigin;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(effectiveOrigin) });
    }

    if (!isDev && reqOrigin !== allowedOrigin) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, effectiveOrigin);
    }

    const ct = request.headers.get('Content-Type') ?? '';
    if (!ct.includes('application/json')) {
      return jsonResponse({ error: 'Expected application/json' }, 415, effectiveOrigin);
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, effectiveOrigin);
    }

    // Honeypot — bots fill this; humans don't.
    if (body.website) {
      return jsonResponse({ ok: true }, 200, effectiveOrigin);
    }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (question.length < MIN_LEN) {
      return jsonResponse(
        { error: `Question must be at least ${MIN_LEN} characters.` },
        400,
        effectiveOrigin,
      );
    }
    if (question.length > MAX_LEN) {
      return jsonResponse(
        { error: `Question must be ${MAX_LEN} characters or fewer.` },
        400,
        effectiveOrigin,
      );
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
    const issueBody = name ? `**Asked by:** ${name}` : undefined;

    const ghRes = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        'User-Agent': 'vincenttaverna-ama/1.0',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: question,
        ...(issueBody ? { body: issueBody } : {}),
        labels: ['ama'],
      }),
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text().catch(() => '');
      // oxlint-disable-next-line no-console
      console.error('GitHub API error', ghRes.status, errText);
      return jsonResponse(
        { error: 'Could not submit your question. Please try again.' },
        502,
        effectiveOrigin,
      );
    }

    const issue = (await ghRes.json()) as { number: number };
    return jsonResponse({ ok: true, issue: issue.number }, 200, effectiveOrigin);
  },
};
