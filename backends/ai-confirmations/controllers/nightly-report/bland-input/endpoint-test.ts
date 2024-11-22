import {Ctx} from '@denomite/builtins/ctx/mod.ts';
import {Logger} from '@denomite/builtins/logger/~index.ts'
import {$} from '@denomite/loader'

export default function(ctx = $(Ctx), logger = $(Logger)) { 
  logger.info(ctx.root.request.url.toString())
}
