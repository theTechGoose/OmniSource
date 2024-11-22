import './registry.ts'
import Denomite from "@denomite"
const { Controller, Dependency } = Denomite
export { Controller, Dependency }
const oak = new Denomite.OakAdapter('/ai-conf', 8000)
const resolver = new Denomite.Resolver()
const server = new Denomite.Server(oak, resolver)
server.addMiddleware(async (ctx: any, next: any) => {
  const url = ctx.request.url
  console.log(url)
  next()
})
await server.start()


 


///.....................ai-confnightly-report/V001/hello-world"
//http://localhost:8000/ai-confnightly-report/V001/hello-world"
//
