import { getSession, clearSession } from '../utils/authStorage';

// Default '/api' -> diteruskan Vite proxy ke backend (lihat vite.config.js).
// Bisa dioverride lewat VITE_API_URL, mis. http://localhost:5000/api
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Pembungkus fetch: otomatis menambahkan token Bearer, parsing JSON,
 * dan melempar ApiError berisi pesan dari backend bila respons gagal.
 */
export async function apiRequest(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const finalHeaders = { Accept: 'application/json', ...headers };
  if (body !== undefined && !isForm) finalHeaders['Content-Type'] = 'application/json';

  const token = auth ? getSession()?.token : null;
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.', 0);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    // Token kedaluwarsa / sesi dicabut -> hapus sesi lokal
    if (res.status === 401 && token) clearSession();
    throw new ApiError(data?.message || `Permintaan gagal (HTTP ${res.status}).`, res.status, data);
  }
  return data;
}

export const api = {
  get: (path, opts) => apiRequest(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => apiRequest(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => apiRequest(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => apiRequest(path, { ...opts, method: 'DELETE' }),
};
