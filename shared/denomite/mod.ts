import {Server} from './core/server/~mod.ts'
import {OakAdapter} from './core/server/adapter/oak/~mod.ts'
import {Resolver} from './core/resolver/~mod.ts'
import {Controller} from './core/decorators/controller/~mod.ts'
import {Dependency} from './core/decorators/dependencies/~mod.ts'
import {NoAuth} from './core/auth/implementations/no-auth.ts'
export * as builtins from './builtins/~index.ts'



export default {
  Server,
  OakAdapter,
  Resolver,
  Controller,
  Dependency,
  NoAuth,
}

/**
  * this function runs a thing
  * @param apple - this is an apple
  **/
function test(apple: string) {}


