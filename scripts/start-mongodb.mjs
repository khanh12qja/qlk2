import { mkdirSync, openSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mongoRoot = resolve(root, ".local/mongodb/mongodb-win32-x86_64-windows-8.0.26");
const dbPath = resolve(root, ".local/mongodb/data/db");
const logPath = resolve(root, ".local/mongodb/logs/mongod.log");

mkdirSync(dbPath, { recursive: true });
mkdirSync(resolve(root, ".local/mongodb/logs"), { recursive: true });

const out = openSync(logPath, "a");
const mongod = spawn(resolve(mongoRoot, "bin/mongod.exe"), ["--dbpath", dbPath, "--bind_ip", "127.0.0.1", "--port", "27017"], {
  cwd: root,
  detached: true,
  windowsHide: true,
  stdio: ["ignore", out, out]
});

mongod.unref();
console.log(`Started MongoDB with pid ${mongod.pid}`);
