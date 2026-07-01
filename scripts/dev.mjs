import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  { name: "api", args: ["run", "dev", "--workspace", "@erp/api"] },
  { name: "web", args: ["run", "dev", "--workspace", "@erp/web"] }
];

const children = processes.map((item) => {
  const child = spawn(npmCommand, item.args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${item.name} exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
});

function shutdown() {
  for (const child of children) {
    child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
