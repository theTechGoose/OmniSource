import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getProjectRoot } from "../core/mod.ts";
import { fromFileUrl } from "#std";
import { withTryCatch } from "@libs/utils";
import { execSync } from "node:child_process";

export class TestValueManager<T extends string> {
  private dirname: string;
  private _mockCwd: Promise<string> = null as any;
  constructor(private meta: string, readonly names: Array<T>) {
    this.dirname = fromFileUrl(this.meta);
  }

  get mockCwd() {
    if (this._mockCwd) return this._mockCwd;
    return getProjectRoot(this.dirname);
  }

  get testFolder() {
    return this.mockCwd.then((root) => {
      return join(root, "test-data");
    });
  }

  file(ext: "json" | "ts", ...path: Array<string>) {
    const processedPath = [...path];
    processedPath[processedPath.length - 1] += `.${ext}`;
    return this.testFolder.then((folder) => join(folder, ...processedPath));
  }

  async get(name: T) {
    const path = await this.file("json", name);
    const [_file] = await withTryCatch(() => readFile(path, "utf8"));

    const update = async (change: any) => {
      const payload = JSON.stringify(change, null, 2);
      await this.copyToClipboard(_file);
      await writeFile(path, payload);
    };

    const [file] = withTryCatch(() => JSON.parse(_file ?? "{}"));

    return [file, update] as const;
  }

  shellEscape(arg: string) {
    return `'${arg.replace(/'/g, `'\\''`)}'`;
  }

  copyToClipboard(_text?: string) {
    if(!_text) return Promise.resolve("");
    const text = this.shellEscape(_text);
    return new Promise((resolve) => {
      console.log(text);
      execSync(`echo ${text} | pbcopy`);
      resolve("");
    });
  }
}
