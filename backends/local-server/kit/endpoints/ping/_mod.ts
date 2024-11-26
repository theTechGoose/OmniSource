import { Context } from "#oak";

export const ping = (ctx:Context) => {
  ctx.response.body = {message: 'pong'}
  ctx.response.status = 200
}
