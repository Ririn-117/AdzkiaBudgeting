export function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
}

export function errorHandler(err, _req, res, _next) {
  if (err?.name === 'MulterError') {
    return res.status(400).json({ message: `Gagal mengunggah berkas: ${err.message}` });
  }
  const status = err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server.';
  if (status >= 500) {
    console.error('[Server Error]', err);
  }
  res.status(status).json({ message });
}
