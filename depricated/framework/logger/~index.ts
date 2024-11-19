import {BasicLogger} from './basic.ts'
import { Dep } from "@core";

@Dep('logger', { mechanisam: (message: string) => console.log(message) })
export class Logger extends BasicLogger {}

