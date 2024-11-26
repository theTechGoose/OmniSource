import {BasicLogger} from '../kit/basic.ts';
import {Dependency} from '@root/core/resolution/core/_mod.ts';


@Dependency
export class Logger extends BasicLogger {}

