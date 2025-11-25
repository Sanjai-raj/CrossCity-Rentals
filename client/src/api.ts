const RAW = import.meta.env.VITE_API_URL ?? '';
const BASE = RAW.replace(/\/$/, ''); // remove trailing slash

export async function apiGet(path: string): Promise<any> {
  const url = `${BASE}${path}`;
  const token = localStorage.getItem('mcs_token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include'
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function apiPost(path: string, body: any): Promise<any> {
  const url = `${BASE}${path}`;
  const token = localStorage.getItem('mcs_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }
  return res.json();
}
