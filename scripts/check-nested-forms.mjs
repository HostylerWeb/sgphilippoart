#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");

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
    if (entry.endsWith(".tsx") || entry.endsWith(".jsx")) {
      files.push(path);
    }
  }

  return files;
}

function findNestedForms(source) {
  const issues = [];
  const openForm = /<form\b/gi;
  const closeForm = /<\/form>/gi;
  const tokens = [];

  for (const match of source.matchAll(openForm)) {
    tokens.push({ index: match.index, type: "open" });
  }
  for (const match of source.matchAll(closeForm)) {
    tokens.push({ index: match.index, type: "close" });
  }

  tokens.sort((a, b) => a.index - b.index);

  let depth = 0;
  for (const token of tokens) {
    if (token.type === "open") {
      depth += 1;
      if (depth > 1) {
        const line = source.slice(0, token.index).split("\n").length;
        issues.push(line);
      }
      continue;
    }

    depth = Math.max(0, depth - 1);
  }

  return issues;
}

const files = walk(SRC);
const failures = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const lines = findNestedForms(source);
  if (lines.length > 0) {
    failures.push({
      file: relative(ROOT, file),
      lines,
    });
  }
}

if (failures.length > 0) {
  console.error("Nested <form> elements detected:");
  for (const failure of failures) {
    console.error(`  ${failure.file}:${failure.lines.join(", ")}`);
  }
  process.exit(1);
}

console.log("No nested <form> elements found.");
