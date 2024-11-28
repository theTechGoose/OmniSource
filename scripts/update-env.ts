import {readFileSync} from "node:fs";
import axios from "#axios";
import {getGitRoot} from "@shared/utils";


const root = getGitRoot();
const envFile = `${root}/.env.prod`
const env = readFileSync(envFile, {encoding: 'utf8'});

function envToJson(file: string) {
  return file.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    return {...acc, [key]: value}
  }, {})
}

const json = envToJson(env);

await axios.post('https://deploy.ngrok.app/update-env', json)





