import { getDb } from '../database/db.js';

export function logAudit({
  userId = null,
  userName = 'System',
  userRole = '',
  module,
  action,
  title,
  detail = '',
  ipAddress = '127.0.0.1',
  status = 'success',
  tone = 'slate',
}) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, user_role, module, action, title, detail, ip_address, status, tone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, userName, userRole, module, action, title, detail, ipAddress, status, tone);
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

export function createNotification({
  userId = null,
  roleTarget = null,
  category = 'info',
  tag = 'INFO',
  tagTone = 'sky',
  refCode = '',
  title,
  body,
  footnote = '',
  accent = 'navy',
  icon = 'megaphone',
  critical = 0,
  actions = [],
}) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO notifications (
        user_id, role_target, category, tag, tag_tone, ref_code,
        title, body, footnote, accent, icon, critical, actions_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      roleTarget,
      category,
      tag,
      tagTone,
      refCode,
      title,
      body,
      footnote,
      accent,
      icon,
      critical ? 1 : 0,
      JSON.stringify(actions)
    );
  } catch (err) {
    console.error('Notification error:', err.message);
  }
}
