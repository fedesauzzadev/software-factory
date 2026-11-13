// fake agent for smoke.mjs --agent plumbing tests. Simulates an agent that
// applied the triage skill in its cwd (the throwaway fixture copy).
// "--noop" anywhere in argv = simulate an agent that did nothing (fail case).
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";

const prompt = process.argv[process.argv.length - 1] ?? "";
if (process.argv.includes("--noop")) {
  console.log("fake agent: noop");
  process.exit(0);
}
if (!prompt.includes("triage")) {
  console.log("fake agent: no fixture work for this skill");
  process.exit(0);
}
mkdirSync("brain/nodes", { recursive: true });
writeFileSync("brain/nodes/N-0004.md", `---
id: N-0004
title: Default greet name to world
type: fix
size: S
status: planned
slice:
depends_on: []
affects: []
replaces: []
contracts_touched: []
code: ["app.js -> greet"]
reversibility: easy
decisions: []
acceptance_criteria:
  - "node app.js prints hello, world when no name is given"
verification:
  level: ""
  tests: ""
  functional: ""
  evidence: ""
date: 2026-11-10
---

## Context
Fixture artifact created by the fake smoke agent.
`);
appendFileSync("brain/index.md", "\n| N-0004 | Default greet name to world | fix | S | planned | code: app.js -> greet |\n");
console.log("fake agent: created N-0004 and registered it in index.md");
