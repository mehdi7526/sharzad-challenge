export function browserApiUrl(path: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4210';
  return `${baseURL.replace(/\/$/, '')}${path}`;
}

export const browserApiHeaders = { 'Access-Control-Allow-Origin': 'http://127.0.0.1:3210' };
