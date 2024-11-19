import { Dep } from "@core";
import { Logger } from "@logger";
import { Operation, Reader, Writer } from "@db/lib/~index.ts";

@Dep("kv")
export class DbHandler {
  constructor(private logger: Logger) {}
  private _kv!: Deno.Kv;
  get location() {
    return Deno.env.get("KV_LOCATION");
  }

  getKv() {
    if (this._kv) return this._kv;
    this.logger.info(`Connecting to KV store at "${this.location}"`);
    return Deno.openKv(this.location).then((kv) => {
      this._kv = kv;
      return kv;
    });
  }

  tearDown() {
    if (this._kv) {
      this._kv.close();
      this._kv = undefined as any;
    }
  }

  createOperation<T>(data: Array<T> = []) {
    return new Operation(data);
  }

  cloneUntilFragment(op: Operation, fragment?: string | ((x: any) => any)) {
    const clone = new Operation(op['data']);
    const clonedPath = op.clonePath();
    for (const f of clonedPath) {
      clone.addPathFragment(f);
      if (!fragment && f instanceof Function) break;
      if (f === fragment) break;
    }
    return clone;
  }

  async executeOperation(...ops: Array<Reader | Writer<any>>) {
    const kv = await this.getKv();
    const writeRequests = ops.filter((op) => op instanceof Writer);
    const $ = this.executeWriteOperation(kv, ...writeRequests);
    const readRequests = ops.filter((op) => op instanceof Reader);
    const $$ = this.executeReadOperation(kv, ...readRequests);
    const [writes, reads] = await Promise.all([$, $$]);
    return { reads, writes };
  }

  executeReadOperation(kv: Deno.Kv, ...op: Array<Reader>) {
    return Promise.all(op.map((p) => {
      return this.executeSingleReadOperation(kv, p);
    }));
  }

  private async executeSingleReadOperation<T>(kv: Deno.Kv, op: Reader) {
    const payload = op.exec();
    const { path, type, limit, end, start } = payload;
    const method = type === "list" ? "list" : "get";
    if (method === "get") return kv[method](path);
    const config = {} as Record<
      string,
      string | number | Array<string | number>
    >;
    if (limit) config.limit = limit;
    if (end) config.end = end;
    if (start) config.start = start;
    const itt = kv[method]({ prefix: path, ...config });
    const query = [];
    for await (const res of itt) query.push(res);
    return query;
  }

  private executeWriteOperation<T>(kv: Deno.Kv, ...ops: Array<Writer<T>>) {
    return Promise.all(ops.map((p) => {
      return this.executeSingleWriteOperation(kv, p);
    })).catch(() => this.cleanUpOnWriteError(kv, ops));
  }

  private executeSingleWriteOperation<T>(kv: Deno.Kv, op: Writer<T>) {
    const payload = op.exec();
    return Promise.all(payload.map((p) => {
      return kv.set(p.path, p.value);
    }));
  }


  private cleanUpOnWriteError<T>(kv: Deno.Kv, ops: Array<Writer<T>>) {
    return ops.map((op) => {
      return this.cleanUpSingleWriteError(kv, op);
    });
  }

  private cleanUpSingleWriteError<T>(kv: Deno.Kv, op: Writer<T>) {
    return (_e: unknown) => {
      const payload = op.exec();
      const e = _e as Error;
      return Promise.all(payload.map((p) => {
        return kv.delete(p.path);
      })).then(() => {
        this.logger.info(`write operation for db path failed`);
        throw new Error(e.message);
      });
    };
  }
}
