import { DbHandler } from '/~plugin.ts'
import { Logger } from "@logger";
import {Resolver} from '@lib';

const resolverInstance = Resolver.resolveWithCurrentInstance__Danger__(Logger)
const logger = resolverInstance.get()

Deno.test('It should connect to a KV store', () => {
  const db = new DbHandler(logger)
  console.log(db.location)
})

Deno.test('It should create an operation', () => {
  const db = new DbHandler(logger)
  const operation = db.createOperation()
  console.log(operation)
})

Deno.test('It should execute an operation', async () => {
  const db = new DbHandler(logger)
  const operation = db.createOperation([{a: 'a', b: 'b'}, {a: 'x', b: 'b'}])
  operation.addPathFragment('a')
  operation.addPathFragment('b')
  operation.addPathFragment((x) => x.a)
  const write = operation.makeWrite()
  const result = await db.executeOperation(write)
  console.log(result)
  db.tearDown()
})

Deno.test('It should execute a read operation', async () => {
  const db = new DbHandler(logger)
  const operation = db.createOperation([{a: 'a', b: 'b'}])
  operation.addPathFragment('a')
  operation.addPathFragment('b')
  operation.addPathFragment('c')
  const write = operation.makeWrite()
  const result = await db.executeOperation(write)
  console.log(result)

  const operation2 = db.cloneUntilFragment(operation, 'b')
  operation2.addPathFragment('x')
  const write2 = operation2.makeWrite()
  const result2 = await db.executeOperation(write2)
  console.log(result2)

  const operation3 = db.cloneUntilFragment(operation, 'b')
  const read = operation3.makeRead()
  read.limit(2)
  const result3 = await db.executeOperation(read)
  console.log(result3)
  db.tearDown()
})
