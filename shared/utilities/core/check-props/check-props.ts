import { thrwErr } from "../throw/throw.ts";

export function chkProps(obj: any, props: Array<string>) {
  if (!obj) return thrwErr("Object must be an object");
  if (typeof obj !== "object") return thrwErr("Object must be an object");
  const propChecker = new PropChecker(obj);
  return props.every(propChecker.check);
}

class PropChecker {
  constructor(private obj: any) {}
  check(prop: string) {
    return this.obj.hasOwnProperty(prop);
  }
}
