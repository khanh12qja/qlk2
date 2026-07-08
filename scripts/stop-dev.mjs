import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");

for (const name of ["web", "api", "mongo"]) {
  const pidPath = resolve(root, `dev.${name}.pid`);
  if (!existsSync(pidPath)) {
    continue;
  }

  const pid = readFileSync(pidPath, "utf8").trim();
  if (!pid) {
    continue;
  }

  spawnSync("taskkill", ["/PID", pid, "/T", "/F"], { shell: true, stdio: "inherit" });
}
