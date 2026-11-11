// Sample project used by kit tests and CI. One real function, one brain.
export function greet(name) {
  return `hello, ${name}`;
}

if (import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1] ?? "").href) {
  console.log(greet("brainloom"));
}
