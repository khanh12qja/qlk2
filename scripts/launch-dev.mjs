import { existsSync, mkdirSync, openSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ports = {
  mongo: "27019",
  api: "4015",
  web: "3015"
};

const nodeBin = dirname(process.execPath);
const binPath = resolve(root, "node_modules/.bin");
const env = {
  ...process.env,
  PATH: `${nodeBin};${binPath};${process.env.PATH ?? ""}`,
  NEXT_PUBLIC_API_BASE_URL: `http://localhost:${ports.api}/api`
};

function findMongod() {
  const where = spawnSync("where", ["mongod.exe"], { shell: true, encoding: "utf8" });
  const first = where.stdout?.split(/\r?\n/).find(Boolean);
  if (first && existsSync(first)) {
    return first;
  }

  const candidates = [
    "C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe",
    "C:/Program Files/MongoDB/Server/7.0/bin/mongod.exe",
    resolve(root, ".local/mongodb/mongodb-win32-x86_64-windows-8.0.26/bin/mongod.exe")
  ];

  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error("Khong tim thay mongod.exe");
  }

  return found;
}

function openLog(name) {
  const logPath = resolve(root, `dev.${name}.log`);
  return openSync(logPath, "a");
}

function startProcess(name, command, args, options = {}) {
  const out = openLog(name);
  const child = spawn(command, args, {
    cwd: options.cwd ?? root,
    detached: true,
    windowsHide: false,
    shell: options.shell ?? false,
    env,
    stdio: ["ignore", out, out]
  });

  child.unref();
  writeFileSync(resolve(root, `dev.${name}.pid`), String(child.pid));
  console.log(`${name}: pid ${child.pid}`);
}

mkdirSync(resolve(root, ".local/mongodb/data/dev-27019"), { recursive: true });
mkdirSync(resolve(root, ".local/mongodb/logs"), { recursive: true });

const mongod = findMongod();
startProcess("mongo", mongod, [
  "--dbpath",
  resolve(root, ".local/mongodb/data/dev-27019"),
  "--bind_ip",
  "127.0.0.1",
  "--port",
  ports.mongo,
  "--wiredTigerCacheSizeGB",
  "0.25",
  "--setParameter",
  "diagnosticDataCollectionEnabled=false",
  "--logpath",
  resolve(root, ".local/mongodb/logs/mongod-27019.log"),
  "--logappend"
]);

startProcess("api", process.execPath, [
  resolve(root, "node_modules/@nestjs/cli/bin/nest.js"),
  "start",
  "--watch"
], {
  cwd: resolve(root, "apps/api")
});

startProcess("web", process.execPath, [
  resolve(root, "node_modules/next/dist/bin/next"),
  "dev",
  "-p",
  ports.web
], {
  cwd: resolve(root, "apps/web")
});

console.log("");
console.log(`MongoDB: mongodb://localhost:${ports.mongo}/aluminium_glass_erp`);
console.log(`API:     http://localhost:${ports.api}/api`);
console.log(`Web:     http://localhost:${ports.web}`);
console.log("");
console.log("Neu chua vao duoc ngay, doi 10-20 giay roi refresh trinh duyet.");
