export const ROLES = {
  UNIT_PRODI: 'unit_prodi',
  BKPU: 'bkpu',
  WAKIL_REKTOR_2: 'wakil_rektor_2',
  YAYASAN: 'yayasan',
  REKTOR: 'rektor',
  ADMINISTRATOR: 'administrator',
};

export const ROLE_LABELS = {
  [ROLES.UNIT_PRODI]: 'Unit / Prodi',
  [ROLES.BKPU]: 'BKPU',
  [ROLES.WAKIL_REKTOR_2]: 'Wakil Rektor II',
  [ROLES.YAYASAN]: 'Yayasan',
  [ROLES.REKTOR]: 'Rektor',
  [ROLES.ADMINISTRATOR]: 'Administrator',
};

// Tujuan redirect setelah login. Ganti path ini saat dashboard tiap role dibuat.
export const ROLE_HOME = {
  [ROLES.UNIT_PRODI]: '/dashboard/unit',
  [ROLES.BKPU]: '/dashboard/bkpu',
  [ROLES.WAKIL_REKTOR_2]: '/dashboard/wakil-rektor-2',
  [ROLES.YAYASAN]: '/dashboard/yayasan',
  [ROLES.REKTOR]: '/dashboard/rektor',
  [ROLES.ADMINISTRATOR]: '/dashboard/administrator',
};

// Opsi dropdown "Masuk Sebagai" pada halaman Login
export const LOGIN_ROLE_OPTIONS = [
  { value: ROLES.UNIT_PRODI, label: 'Unit/Prodi' },
  { value: ROLES.BKPU, label: 'BKPU' },
  { value: ROLES.WAKIL_REKTOR_2, label: 'WR2' },
  { value: ROLES.YAYASAN, label: 'Yayasan' },
  { value: ROLES.REKTOR, label: 'Rektor' },
  { value: ROLES.ADMINISTRATOR, label: 'Administrator' },
];