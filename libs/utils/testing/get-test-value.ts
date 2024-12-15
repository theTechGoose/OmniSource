import { glob } from "#glob";
import { withTryCatch } from "../higher-order-functions/mod.ts";
import { assertEquals } from "#std/assert";
import {
  access,
  mkdir,
  readdir,
  readFile,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { getProjectRoot } from "../core/mod.ts";
import { pad, thrw } from "../mod.ts";
import { dirname, fromFileUrl } from "#std";

export class TestValueManager {
  private dirname: string;
  private sampleCache: Record<string, { value: string; dir: string }> = {};
  private noCacheFlag = false;
  constructor(private meta: string, private quiet = false) {
    this.dirname = fromFileUrl(this.meta);
  }

  setNoCacheFlag() {
    this.noCacheFlag = true;
  }

  private async exists(path: string) {
    const [exists] = await withTryCatch(async () => {
      await access(path);
      const stats = await stat(path);
      return stats.isDirectory();
    });
    const output = !!exists;
    return output;
  }

  private async sampleFile(_name: string) {
    const name = _name.includes(":::") ? _name.split(":::")[0] : _name;
    if (this.sampleCache[name]) return this.sampleCache[name];
    const projectRoot = await getProjectRoot(this.dirname);
    this.log(`found project root: ${projectRoot}`);
    if (!projectRoot) throw new Error("Project root not found");
    const testDataFolder = join(projectRoot, "test-data");
    let [filePath] = await glob(`**/${name}*.json`, {
      cwd: testDataFolder,
      absolute: true,
    });
    if (!filePath) filePath = join(testDataFolder, name, `${name}:::000.json`);
    const payload = {
      value: filePath,
      dir: dirname(filePath),
    };
    this.sampleCache[name] = payload;
    return payload;
  }

  private async determineVersion(name: string, forNew = false) {
    const inc = (num: number) => forNew ? num + 1 : num;
    if (this.noCacheFlag) return 0
    const [key, version] = name.split(":::");
    if (version) {
      const earlyOutput =  Number(version)
      this.log(`early output: ${earlyOutput}`);
      return earlyOutput;
    }
    const { value, dir } = await this.sampleFile(key);
    if (!value) return inc(0);
    const exists = await this.exists(dir);
    if (!exists) return inc(0);
    const files = await readdir(dir);
    if (!files[0]) return inc(0);
    const parsedFileVersions = files.map((f) => {
      const [key, version] = f.split(":::");
      const outputVersion = +(version.split(".")[0])
      return {
        key,
        number: outputVersion,
        file: f,
      };
    }).sort((a, b) => a.number - b.number);
    const latestVersion = parsedFileVersions.reverse()[0];
    if(latestVersion.number === 0) return inc(0);
    return inc(latestVersion.number);
  }

  private async buildVersionPath(_name: string, version: number) {
    const name = _name.includes(":::") ? _name.split(":::")[0] : _name;
    const sample = await this.sampleFile(name);
    const { dir } = sample;
    const paddedVersion = pad(version, 6);
    return join(dir, `${name}:::${paddedVersion}.json`);
  }

  async get(_name: string, _version: number) {
    const [file] = await withTryCatch(async () => {
      const name = `${_name}:::${_version}`;
      const version = await this.determineVersion(name);
      const filePath = await this.buildVersionPath(name, version);
      console.log(`[TEST SAMPLER]::latest version: ${version}`);
      const [file, err] = await withTryCatch(async () => {
        const fileContent = await readFile(filePath, "utf-8");
        this.log(`found file: ${filePath}`);
        return {
          parsed: JSON.parse(fileContent),
          raw: fileContent,
        };
      });
      if (!file) thrw("File not found");
      this.log(`returning content: ${file.raw}`);
      return file.parsed;
    });
    return file;
  }

  async setValue(key: string, value: any) {
    this.log(`setting value for ${key}`);
    const version = await this.determineVersion(key);
    const sample = await this.sampleFile(key);
    const exists = await this.exists(sample.dir);
    if (!exists) await mkdir(sample.dir, { recursive: true });
    const latestVersionPath = await this.buildVersionPath(key, version);
    const [fileStats] = await withTryCatch(async () => await stat(latestVersionPath))
    if (version === 0 && fileStats && fileStats.isFile()) await unlink(latestVersionPath);
    const [latestRawVersionContent] = await withTryCatch(async () => {
      return await readFile(latestVersionPath, "utf-8");
    });

    const latestVersionContent = JSON.parse(latestRawVersionContent ?? "{}");
    const [isSame, err] = withTryCatch(() => {
      assertEquals(latestVersionContent, value)
      return true
    });
    this.log(`is same: ${isSame}`);
    if (isSame) return;
    const newVersion = await this.determineVersion(key, true);
    const newVersionPath = await this.buildVersionPath(key, newVersion);
    console.log(`[TEST SAMPLER]::new version: ${newVersion}`);
    await writeFile(newVersionPath, JSON.stringify(value, null, 2));
  }

  log(message: string) {
    if (this.quiet) return;
    console.log(message);
  }
}
