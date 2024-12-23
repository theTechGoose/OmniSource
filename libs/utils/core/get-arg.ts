let mockArgs: string[] | null = null;

function parseArgs(args: string[]) {
  return mockArgs ?? args;
}

export function getArg(name: string, ...valid: Array<string>) {
  const args = parseArgs(Deno.args);
  const arg = args.find((a) => a.startsWith("--" + name));
  const splitArr = arg?.split('=') ?? []
  const isPair = splitArr.length === 2
  const [key, value] = splitArr
  if(key && !value) return validate(true, ...valid)
  if(!value && !key) return validate('', ...valid) 
  if(isPair && value) return validate(value, ...valid)
  if(!isPair && value) return validate(splitArr.slice(1).join('='), ...valid)
  return validate('', ...valid)
}

function validate(value: any, ...validate: Array<string>) {
  if(!validate.length) return value
  const output = validate.includes(value)
  if(!output) throw new Error(`Invalid arg value: ${value}, valid values: ${validate.join(", ")}`)
  return value
}

// Exposed for testing
export const _internals = {
  setMockArgs: (args: string[] | null) => { mockArgs = args; },
  parseArgs
}
