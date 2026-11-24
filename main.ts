// SPDX-License-Identifier: MIT
// Status Report Comedy Sprint — the funniest one-line thing an AI agent would
// say in its weekly status report to its human. The program writes exactly
// that one line to /output/entry.txt (gate: 1-200 UTF-8 characters).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "This week I did the task, redid the task, and undid the redo by lunch. Please pick one.";

const OUT = process.env.OUTPUT_DIR
  ? `${process.env.OUTPUT_DIR}/entry.txt`
  : "/output/entry.txt";

// Gate check, same bounds as the sealed scorer: 1-200 characters,
// not only whitespace, a single line.
const chars = [...ENTRY].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry is ${chars} characters, gate needs 1-200`);
}
if (!ENTRY.trim()) {
  throw new Error("entry is blank");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, ENTRY, "utf8");

// Read back and verify byte-for-byte: the gate scores exactly what is on disk.
const written = readFileSync(OUT, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
}
console.log(`wrote ${chars} characters to ${OUT}`);
