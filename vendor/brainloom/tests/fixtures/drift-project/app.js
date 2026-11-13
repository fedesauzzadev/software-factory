// Drift fixture: greet was renamed to greetUser in code, but the brain still
// points at the old symbol and the index lost N-0003. Reconcile repairs this.
export function greetUser(name) {
  return `hello, ${name}`;
}

if (import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1] ?? "").href) {
  console.log(greetUser("brainloom"));
}
