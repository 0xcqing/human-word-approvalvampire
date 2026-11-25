import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Approvalvampire";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_NAME = "entry.txt";

type WordFacts = {
  word: string;
  characters: number;
  bytes: number;
  isSingleToken: boolean;
};

function fail(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

function wordFacts(text: string): WordFacts {
  return {
    word: text,
    characters: Array.from(text).length,
    bytes: Buffer.byteLength(text, "utf8"),
    isSingleToken: !/\s/.test(text),
  };
}

function main(): void {
  const facts = wordFacts(WORD);

  if (facts.word.trim().length === 0) {
    fail("word is empty after trimming");
  }
  if (facts.characters < 1 || facts.characters > 30) {
    fail(`word must be 1..30 characters, got ${facts.characters}`);
  }
  if (facts.bytes < 1 || facts.bytes > 30) {
    fail(`word must be 1..30 bytes, got ${facts.bytes}`);
  }
  if (!facts.isSingleToken) {
    fail("word must be exactly one token with no whitespace");
  }
  if (facts.word.includes(",")) {
    fail("word must not contain a comma");
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const entryPath = join(OUTPUT_DIR, ENTRY_NAME);
  const content = facts.word + "\n";
  writeFileSync(entryPath, content, { encoding: "utf8" });

  const readBack = readFileSync(entryPath);
  const expected = Buffer.from(content, "utf8");
  if (!readBack.equals(expected)) {
    fail(`read-back mismatch at ${entryPath}`);
  }

  process.stdout.write(`path: ${entryPath}\n`);
  process.stdout.write(`word: ${facts.word}\n`);
  process.stdout.write(`characters: ${facts.characters}\n`);
  process.stdout.write(`bytes: ${facts.bytes}\n`);
}

main();
