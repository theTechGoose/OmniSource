import { nanoid } from "npm:nanoid";
import {fileURLToPath} from 'node:url';

export function getStackTrace(): FileStack {
  const err = new Error(nanoid());
  const input = err.stack;
  // Regular expression to match file paths with line and column numbers
  if (!input) return new FileStack([]);
  const regex = /file:\/\/[^\s)]+:\d+:\d+/g;
  // Use match() to find all occurrences
  const matches = input.match(regex);
  // Return the matches or an empty array if no matches are found
  return new FileStack(matches ?? []);
}

class FileStack {

  constructor(public stack: Array<string> = []) {}

  get first() {
    return this.stack.reverse()[0];
  }

  urlToPath(url: string) {
    return fileURLToPath(url);
  }

  scrubPath(p: string) {
    return p.split(":").slice(0, -2).join("");
  }
}
