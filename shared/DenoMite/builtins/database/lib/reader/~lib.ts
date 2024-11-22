import type { operationType } from "@global_models";

interface ReaderPayload {
  type: Omit<operationType, 'write'>;
  start: Array<string | number> | null;
  end: Array<string | number> | null;
  limit: number | null;
  path: Array<string>;
}

export class Reader {
  public readonly type = 'read' as const
  private _start = null as Array<string | number> | null;
  private _end = null as Array<string | number> | null;
  private _limit = null as number | null;
  payload: ReaderPayload | null = null;
  constructor(private path: Array<string>) {}

  start(start: Array<string | number>) {
    this._start = this.replaceWithPath(start)
    return this;
  }

  end(end: Array<string | number>) {
    this._end = this.replaceWithPath(end)
    return this;
  }

  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  replaceWithPath(testArr: Array<string | number>) {
    const [first] = testArr
    const [last] = testArr.slice(-1)
    if(first === "'") return [...this.path, last]
    return testArr
  }

  exec() {
    const isList = !!this._start || !!this._end || !!this._limit;
    
    this.payload = {
      type: isList ? 'list' : 'read' as any,
      start: this._start,
      end: this._end,
      limit: this._limit,
      path: this.path
    }
    return this.payload;
  }
}
