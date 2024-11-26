export function getArg(name: string) {
  const arg = Deno.args.find((a) => a.startsWith("--" + name));
  return arg?.split("=")[1] ?? "err";
}
