import "@global_models"
import data from './sample-data/init.json' with {type: 'json'}
import { Postmark } from './~plugin.ts'
import { assertEquals } from "jsr:@std/assert";

Deno.test('It should parse a postmark email', () => {
  const postmark = new Postmark()
  const email = postmark.parseEmail(data)
  assertEquals(email.to, data.To)
  assertEquals(email.from, data.From)
  assertEquals(email.subject, data.Subject)
})

Deno.test('It should parse attachments', () => {
  const postmark = new Postmark()
  const email = postmark.parseEmail(data)
  const attachments = email.parseAttachments()
  console.log(attachments.map(a => a.asCSV()))
  assertEquals(attachments.length, data.Attachments.length)
})
