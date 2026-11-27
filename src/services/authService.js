import { api } from './api';

/**
 * Login ke backend: POST /api/auth/login
 * Return: { token, user } (bentuk sama seperti sebelumnya, jadi komponen lain tidak perlu diubah).
 */
export async function loginRequest({ identifier, password, role }) {
  const data = await api.post(
    '/auth/login',
    { identifier: identifier.trim(), password, role },
    { auth: false }
  );
  return { token: data.token, user: data.user };
}

/**
 * Pendaftaran akun mandiri: POST /api/auth/register
 * Akun disimpan di database backend.
 */
export async function registerRequest({ fullName, email, unit, role, password }) {
  return api.post(
    '/auth/register',
    { fullName: fullName.trim(), email: email.trim(), unit, role, password },
    { auth: false }
  );
}

/** Permintaan reset kata sandi: POST /api/auth/forgot-password */
export async function forgotPasswordRequest({ email }) {
  return api.post('/auth/forgot-password', { email: email.trim() }, { auth: false });
}

/** Data pengguna yang sedang login: GET /api/auth/me -> { user, permissions } */
export async function getMeRequest() {
  return api.get('/auth/me');
}

/** Akhiri sesi di backend: POST /api/auth/logout */
export async function logoutRequest() {
  return api.post('/auth/logout');
}
