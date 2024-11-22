
export function extractLoadedClasses(fn: Function): string[] {
  const stringified = fn.toString();
  const paramsRegex = /\(.+\)/
  const [match] = stringified.match(paramsRegex) ?? [];
  if (!match) return [];
  const params = match;
  const dependencyRegex = /\$\((\w+)\)/g
  const paramsArray = recursiveRegex(dependencyRegex, params);
  return paramsArray;
}

function recursiveRegex(regex: any, input: string, matches = [] as any) {
  const [_, match] = safeMatch(regex, input);
  if (!match) return matches;
  matches.push(match);
  return recursiveRegex(regex, input, matches);
}


function safeMatch(regex: any, input: string) {
  return regex.exec(input) ?? [];
}
