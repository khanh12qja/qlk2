import { mkdirSync, openSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mongoRoot = resolve(root, ".local/mongodb/mongodb-win32-x86_64-windows-8.0.26");
const dbPath = resolve(root, ".local/mongodb/data/dev-27019");
const logPath = resolve(root, ".local/mongodb/logs/mongod-27019.log");

mkdirSync(dbPath, { recursive: true });
mkdirSync(resolve(root, ".local/mongodb/logs"), { recursive: true });

const out = openSync(logPath, "a");
const mongod = spawn(resolve(mongoRoot, "bin/mongod.exe"), [
  "--dbpath",
  dbPath,
  "--bind_ip",
  "127.0.0.1",
  "--port",
  "27019",
  "--wiredTigerCacheSizeGB",
  "0.25",
  "--setParameter",
  "diagnosticDataCollectionEnabled=false"
], {
  cwd: root,
  detached: true,
  windowsHide: true,
  stdio: ["ignore", out, out]
});

mongod.unref();
console.log(`Started MongoDB with pid ${mongod.pid}`);
