import { parentPort, workerData } from 'node:worker_threads';
import mysql from 'mysql2/promise';

const { port, signal } = workerData;

let pool = null;
let currentCfgKey = '';
let txConn = null;

function normalizeSql(rawSql) {
  let sql = String(rawSql);

  // Translate SQLite datetime helpers to MySQL
  sql = sql.replace(/datetime\(\s*'now'\s*,\s*'-1 day'\s*\)/gi, 'DATE_SUB(NOW(), INTERVAL 1 DAY)');
  sql = sql.replace(/datetime\(\s*'now'\s*\)/gi, 'NOW()');

  // Translate SQLite UPSERT to MySQL ON DUPLICATE KEY UPDATE
  if (/ON\s+CONFLICT\s*\([^)]+\)\s*DO\s+UPDATE\s+SET/i.test(sql)) {
    sql = sql.replace(/ON\s+CONFLICT\s*\([^)]+\)\s*DO\s+UPDATE\s+SET/gi, 'ON DUPLICATE KEY UPDATE');
    sql = sql.replace(/excluded\.([a-zA-Z0-9_]+)/g, 'VALUES($1)');
  }

  // Quote reserved column `key` in system_configs queries if unquoted
  if (/\bsystem_configs\b/i.test(sql)) {
    sql = sql.replace(/\(\s*key\s*,/gi, '(`key`,');
    sql = sql.replace(/WHERE\s+key\s*=/gi, 'WHERE `key` =');
    sql = sql.replace(/ORDER\s+BY\s+tab\s*,\s*key\b/gi, 'ORDER BY tab, `key`');
  }

  return sql;
}

function normalizeParam(val) {
  if (val === undefined) return null;
  if (typeof val === 'boolean') return val ? 1 : 0;
  // Convert ISO 8601 strings (e.g. 2026-11-27T07:05:19.123Z) to MySQL DATETIME format
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val)) {
    return val.slice(0, 19).replace('T', ' ');
  }
  return val;
}

async function ensurePool(cfg) {
  const key = `${cfg.host}:${cfg.port}:${cfg.user}:${cfg.database}`;
  if (pool && currentCfgKey === key) return pool;

  if (txConn) {
    try { txConn.release(); } catch {}
    txConn = null;
  }
  if (pool) {
    try { await pool.end(); } catch {}
    pool = null;
  }

  // Ensure target database exists in MySQL
  const bootstrap = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
  });
  const safeDb = String(cfg.database).replace(/[^a-zA-Z0-9_]/g, '');
  await bootstrap.query(
    `CREATE DATABASE IF NOT EXISTS \`${safeDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrap.end();

  pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: safeDb,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
    dateStrings: true,
  });

  // Enable PIPES_AS_CONCAT on every connection so `a || b` works as CONCAT in MySQL/MariaDB
  pool.on('connection', (conn) => {
    conn.query("SET SESSION sql_mode = CONCAT(@@sql_mode, ',PIPES_AS_CONCAT')");
  });

  currentCfgKey = key;
  return pool;
}

async function handleMessage({ action, cfg, sql, params = [] }) {
  if (action === 'close') {
    if (txConn) {
      try { txConn.release(); } catch {}
      txConn = null;
    }
    if (pool) {
      await pool.end();
      pool = null;
      currentCfgKey = '';
    }
    return true;
  }

  const activePool = await ensurePool(cfg);

  if (action === 'begin') {
    if (!txConn) {
      txConn = await activePool.getConnection();
      await txConn.query("SET SESSION sql_mode = CONCAT(@@sql_mode, ',PIPES_AS_CONCAT')");
    }
    await txConn.beginTransaction();
    return true;
  }

  if (action === 'commit') {
    if (txConn) {
      await txConn.commit();
      txConn.release();
      txConn = null;
    }
    return true;
  }

  if (action === 'rollback') {
    if (txConn) {
      try { await txConn.rollback(); } catch {}
      txConn.release();
      txConn = null;
    }
    return true;
  }

  const target = txConn || activePool;
  const finalSql = normalizeSql(sql);
  const finalParams = params.map(normalizeParam);

  if (action === 'exec') {
    const statements = finalSql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await target.query(stmt);
    }
    return true;
  }

  if (action === 'get') {
    const [rows] = await target.query(finalSql, finalParams);
    return Array.isArray(rows) ? rows[0] : undefined;
  }

  if (action === 'all') {
    const [rows] = await target.query(finalSql, finalParams);
    return Array.isArray(rows) ? rows : [];
  }

  if (action === 'run') {
    const [result] = await target.query(finalSql, finalParams);
    return {
      changes: Number(result?.affectedRows ?? 0),
      lastInsertRowid: Number(result?.insertId ?? 0),
    };
  }

  throw new Error(`Unknown action: ${action}`);
}

port.on('message', async (msg) => {
  try {
    const result = await handleMessage(msg);
    port.postMessage({ ok: true, result });
  } catch (err) {
    port.postMessage({ ok: false, error: err?.message || String(err), code: err?.code });
  } finally {
    Atomics.store(signal, 0, 1);
    Atomics.notify(signal, 0, 1);
  }
});

parentPort?.postMessage('ready');
