import _ from "npm:lodash";
import { Reader } from "@db/lib/reader/~lib.ts";
import { Writer } from "@db/lib/writer/~lib.ts";
import {pathFragment, pathFunction} from "@db/models.ts"


export class Operation<T = unknown> {
  collapsedPath: Array<Array<string | number>> = [];
  protected path: Array<pathFragment<unknown>> = [];
  constructor(private data?: Array<T>) {}

  addPathFragment(fragment: pathFragment<any>) {
    this.path.push(fragment as pathFragment<unknown>);
    return this
  }

  clonePath() {
    return _.cloneDeep(this.path);
  }

  makeWrite() {
    if(!this.data) throw new Error('No data provided to write operation')
    const collapsedPath = this.serialize(this.data);
    return new Writer(this.data, collapsedPath);
  }

  makeRead() {
    const collapsedPath = this.serialize();
    return new Reader(collapsedPath);
  }

  protected serialize<T>(data?: Array<T>) {
    if (!data) {
      return this.path.map((p, i) => this.handlePathCoorsion(p, i));
    }
    this.collapsedPath = data.map((d) => {
      return this.path.map((p, i) => {
        return this.handlePathCoorsion(p, i, d);
      });
    });
    const output = _.cloneDeep(this.collapsedPath);
    return output;
  }

  private handlePathCoorsion<T>(p: pathFragment<T>, i: number, data?: T) {
    if (typeof p !== "function") return p.toString();
    this.handlePathCoorsionError(i, p, data);
    return this.callPathFunction(p, i, data);
  }

  private callPathFunction<T>(p: pathFragment<T>, i: number, _data?: unknown) {
    const data = _data as T;
    if (typeof p !== "function") return p;
    const output = data ? p(data) : p(null);
    console.log({p: p.toString(), data, output, i})
    if (typeof output === "string" || typeof output === "number") return output;
    console.log(output)
    throw new Error(
      `Function in path of Operation must return a string or number. Index: ${i}`,
    );

  }

  private handlePathCoorsionError<T>(i: number, p: pathFunction<T>, data?: T) {
    if (data || p.length === 0) return;
    throw new Error(
      `Passed function in kv operation path, but have no data. Index: ${i}`,
    );
  }
}
