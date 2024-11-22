import {BasicLogger} from './basic.ts';
import {Dependency} from '@decorators/dependencies/~mod.ts';


@Dependency
export class Logger extends BasicLogger {
  
}

