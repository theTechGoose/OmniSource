import {getGitRoot} from "@shared/utils";
import json from '../deno.json' with {type: 'json'}
import {readFileSync} from "node:fs";
import {execSync} from "node:child_process";

const cwd = getGitRoot();

function getProdCfg() {
  const path = `${cwd}/prod.cfg`;
  const cfg = readFileSync(path, {encoding: 'utf8'});
  return cfg.split('\n').filter(Boolean).map(l => `backends/${l}`)
}

function validate(cfg: Array<string>) {
  const {workspace} = json;
  const invalid = cfg.filter(l => !workspace.includes(l));

  console.log(cfg)
  console.log(invalid)
  if(invalid.length) {
    throw new Error(`Invalid backends: ${invalid.join(', ')}`);
  }
  return
}

function buildCommand(cfg: Array<string>) {
  const commands = cfg.map(l => `"cd ${l} && deno task prod"`)
  return `concurrently ${commands.join(' ')}`
}

function run() {
  const cfg = getProdCfg();
  validate(cfg);
  const command = buildCommand(cfg);
  console.log(command)
  execSync(command, {cwd, stdio: 'inherit'});
}

run()








