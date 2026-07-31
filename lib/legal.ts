import fs from "node:fs";
import path from "node:path";

// Reads a legal text file from content/legal at build time (static export).
// These files are exact copies of the app's assets/legal/*.txt.
export function readLegal(file: string): string {
  const p = path.join(process.cwd(), "content", "legal", file);
  return fs.readFileSync(p, "utf8");
}
