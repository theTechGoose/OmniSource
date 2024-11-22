import {dependencies} from '../../server/~mod.ts';
import { Reflect } from "@reflect";

export function Dependency(target: any) {
  dependencies.push(target);
}
