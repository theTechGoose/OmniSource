import type {Endpoint} from '../../endpoint/~mod.ts';
import type {Resolver} from '../../resolver/~mod.ts';

export abstract class Adapter {
  constructor() {}
  abstract register(e: Endpoint<any>, r: Resolver): void;
  abstract addMiddleware(m: Function): void;
  abstract finalize(): Promise<void>;
  abstract setup(): void;
}


