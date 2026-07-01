import { openSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = openSync(resolve(root, "dev.log"), "a");
const err = openSync(resolve(root, "dev.error.log"), "a");

const child = spawn(process.execPath, [resolve(root, "scripts/dev.mjs")], {
  cwd: root,
  detached: true,
  windowsHide: true,
  stdio: ["ignore", out, err]
});

child.unref();
console.log(`Started ERP dev server with pid ${child.pid}`);
