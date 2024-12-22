import { readFileSync } from "fs";

export const loadFile = (path: string): string =>
  readFileSync(path, "utf-8").trim();
