const RAW = import.meta.env.VITE_API_URL ?? '';
const BASE = RAW.replace(/\/$/, ''); // remove trailing slash

export async function apiGet(path: string): Promise<any> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function apiPost(path: string, body: any): Promise<any> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }
  return res.json();
}
