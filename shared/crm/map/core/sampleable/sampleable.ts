
  export abstract class Sampleable {
  async createSample(location: string, callback: string, ...args: any[]) {
    const fs = await import('node:fs')
    const url = await import('node:url')
    const path = await import("node:path")
    //@ts-ignore
    const cb = this[callback].bind(this);
    const data = await cb(...args);
    const fullFile = url.fileURLToPath(location);
    const dir = fullFile.split('/').slice(0, -1).join('/');
    const fullPath = path.join(dir,'sample.json') 
    console.log('Writing sample data to ', path);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  }
  }
