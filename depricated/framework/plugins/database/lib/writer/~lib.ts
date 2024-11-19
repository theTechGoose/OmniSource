import {collapsedPathFragment} from '@db/models.ts';

interface writePayload<T> {
  path: Array<collapsedPathFragment>;
  value: T;
}

export class Writer<T = unknown> {
  public readonly type = 'write' as const
  private payload: Array<writePayload<T>> = [];

  constructor(private data: Array<T>, private paths: Array<Array<collapsedPathFragment>>) { }

  exec(cb?: ((r: T) => any)) {
    if(!this.data?.length) throw new Error("No data to write");
    const values = this.data.map(d => cb ? cb(d) : d);
    this.payload = values.map((v, i) => ({path: this.paths[i], value: v}));
    return this.payload;
  }
}



