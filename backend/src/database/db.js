import { Worker, MessageChannel, receiveMessageOnPort } from 'node:worker_threads';
import { env } from '../config/env.js';

let worker = null;
let port = null;
let signal = null;
let dbFacade = null;

function getMysqlConfig() {
  return {
    host: env.dbHost || '127.0.0.1',
    port: Number(env.dbPort || 3306),
    user: env.dbUser || 'root',
    password: env.dbPassword ?? '',
    database: env.dbName || 'adzkia_ebudgeting',
  };
}

function ensureWorker() {
  if (worker) return;
  const { port1, port2 } = new MessageChannel();
  signal = new Int32Array(new SharedArrayBuffer(4));
  port = port1;

  worker = new Worker(new URL('./mysqlWorker.js', import.meta.url), {
    workerData: { port: port2, signal },
    transferList: [port2],
  });
  worker.unref();
}

function callMysql(action, sql = '', params = []) {
  ensureWorker();
  Atomics.store(signal, 0, 0);
  port.postMessage({ action, cfg: getMysqlConfig(), sql, params });
  Atomics.wait(signal, 0, 0);

  const packet = receiveMessageOnPort(port);
  const msg = packet?.message;
  if (!msg) {
    throw new Error('Tidak ada respons dari worker MySQL.');
  }
  if (!msg.ok) {
    const err = new Error(msg.error || 'Kesalahan query MySQL.');
    err.code = msg.code;
    throw err;
  }
  return msg.result;
}

function createFacade() {
  return {
    exec(sql) {
      return callMysql('exec', sql);
    },
    prepare(sql) {
      return {
        get(...params) {
          return callMysql('get', sql, params);
        },
        all(...params) {
          return callMysql('all', sql, params);
        },
        run(...params) {
          return callMysql('run', sql, params);
        },
      };
    },
    close() {
      return closeDb();
    },
  };
}

export function getDb() {
  if (!dbFacade) {
    dbFacade = createFacade();
  }
  return dbFacade;
}

export function runTransaction(fn) {
  const db = getDb();
  callMysql('begin');
  try {
    const result = fn(db);
    callMysql('commit');
    return result;
  } catch (err) {
    try { callMysql('rollback'); } catch {}
    throw err;
  }
}

export function closeDb() {
  if (worker) {
    try { callMysql('close'); } catch {}
    try { worker.terminate(); } catch {}
    worker = null;
    port = null;
    signal = null;
  }
  dbFacade = null;
}
