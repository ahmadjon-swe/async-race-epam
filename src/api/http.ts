import { BASE_URL } from '../utils/constants';
import type { Paginated } from '../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number>;
}

function buildUrl(path: string, params?: Record<string, string | number>): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

async function requestPaginated<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<Paginated<T>> {
  const url = buildUrl(path, params);

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }

  const total = Number(response.headers.get('X-Total-Count') ?? 0);
  const items = (await response.json()) as T[];
  return { items, total };
}

export { request, requestPaginated };
