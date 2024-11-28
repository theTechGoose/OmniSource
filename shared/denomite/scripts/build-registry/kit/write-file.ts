const fs = await import("node:fs");

export async function writeFile(registryPath: string, payload: string, type?: 'quiet:' | ':dry' | 'quiet:dry') {
  const [isQuiet, isDry] = type?.split(':') ?? []
  if(!isQuiet) log(registryPath, payload)
  if (isDry) return;
  fs.writeFileSync(registryPath, payload);
}

export function determineType(isQuiet: boolean | string, isDry: boolean | string) {
  if (isQuiet && isDry) return 'quiet:dry'
  if (isQuiet) return 'quiet:'
  if (isDry) return ':dry'
  return undefined
}

function log(registryPath: string,  payload: string) {
    const shortPath = registryPath.split('backends')[1]
    console.log(`--- Writing to ${shortPath.trim()} ---`);
    console.log(payload.trim());
    console.log("            --- End of file ---");
}
