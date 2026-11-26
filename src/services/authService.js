import { ROLES } from '../constants/roles';

// DATA DUMMY, hanya untuk pengembangan. Hapus saat backend siap.
// Password dibandingkan di sisi klien, jadi ini TIDAK AMAN dan TIDAK terhubung ke backend.
const MOCK_USERS = [
  { id: 1, username: 'unit', email: 'unit@adzkia.ac.id', password: 'password123', name: 'Dr. Rahmat Hidayat, M.Pd', role: ROLES.UNIT_PRODI },
  { id: 2, username: 'bkpu', email: 'bkpu@adzkia.ac.id', password: 'password123', name: 'Ahmad Dani, S.E', role: ROLES.BKPU },
  { id: 3, username: 'wr2', email: 'wr2@adzkia.ac.id', password: 'password123', name: 'Dr. H. Muhammad Alfian, M.Si', role: ROLES.WAKIL_REKTOR_2 },
  { id: 4, username: 'yayasan', email: 'yayasan@adzkia.ac.id', password: 'password123', name: 'Prof. Dr. H. Irwan Prayitno, M.Sc.', role: ROLES.YAYASAN },
  { id: 5, username: 'rektor', email: 'rektor@adzkia.ac.id', password: 'password123', name: 'Prof. Dr. H. Anhar, S.T., M.T.', role: ROLES.REKTOR },
  { id: 6, username: 'admin', email: 'admin@adzkia.ac.id', password: 'password123', name: 'Administrator', role: ROLES.ADMINISTRATOR },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login (MOCK). Nanti ganti isi fungsi ini dengan panggilan REST API, misalnya:
 *   const res = await fetch(`${API_URL}/auth/login`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ identifier, password, role }),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json(); // { token, user: { id, name, role } }
 * Bentuk return harus tetap { token, user } agar bagian lain tidak perlu diubah.
 */
export async function loginRequest({ identifier, password, role }) {
  await wait(900);

  const key = identifier.trim().toLowerCase();
  const found = MOCK_USERS.find(
    (u) => (u.username === key || u.email === key) && u.password === password
  );

  if (!found) {
    throw new Error('Email/username atau kata sandi salah.');
  }
  if (role && found.role !== role) {
    throw new Error('Peran yang dipilih tidak sesuai dengan akun Anda.');
  }

  const user = { ...found };
  delete user.password;
  return { token: `mock-token-${user.id}-${Date.now()}`, user };
}
/**
 * Pendaftaran akun (MOCK). Data TIDAK disimpan ke mana pun.
 * Nanti ganti dengan POST ke REST API, misalnya `${API_URL}/auth/register`.
 */
export async function registerRequest({ fullName, email, unit, role, password }) {
  await wait(1000);

  const key = email.trim().toLowerCase();
  if (MOCK_USERS.some((u) => u.email === key)) {
    throw new Error('Email tersebut sudah terdaftar.');
  }

  return {
    message:
      'Pendaftaran berhasil diajukan. Akun Anda akan diverifikasi oleh Administrator sebelum dapat digunakan.',
  };
}

/**
 * Permintaan reset kata sandi (MOCK). Tidak ada email yang dikirim.
 * Nanti ganti dengan POST ke REST API, misalnya `${API_URL}/auth/forgot-password`.
 * Pesan sengaja sama untuk email terdaftar maupun tidak.
 */
export async function forgotPasswordRequest({ email }) {
  await wait(900);
  return {
    message: `Jika ${email.trim()} terdaftar, tautan untuk mengatur ulang kata sandi akan dikirim ke email tersebut.`,
  };
}