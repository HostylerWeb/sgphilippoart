#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, "src", "app");

const FUNCTION_PROP_PATTERN = /\b[A-Za-z_][\w]*=\{\s*\([^)]*\)\s*=>/g;

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...walk(path));
      continue;
    }
    if (entry.endsWith(".tsx")) {
      files.push(path);
    }
  }

  return files;
}

function isClientFile(source) {
  return /^\s*["']use client["'];?/m.test(source);
}

const issues = [];

for (const file of walk(APP)) {
  const source = readFileSync(file, "utf8");
  if (isClientFile(source)) continue;

  const matches = source.match(FUNCTION_PROP_PATTERN);
  if (!matches) continue;

  for (const match of matches) {
    issues.push({ file, match });
  }
}

if (issues.length > 0) {
  console.error("Server route files must not pass inline functions to Client Components:\n");
  for (const { file, match } of issues) {
    console.error(`  ${file.replace(ROOT, "")}: ${match}`);
  }
  console.error(
    "\nPass serializable data instead (e.g. currency settings) and format inside the client component.",
  );
  process.exit(1);
}

console.log("No server-to-client function props found.");
