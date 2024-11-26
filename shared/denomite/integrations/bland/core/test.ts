import { λ } from "@root/_mod.ts";
import {Bland} from "./_mod.ts";

Deno.test('it should trigger a bland call', async () => {

  λ.vault.manifest.init()
  const bland = λ(Bland)
  const res = await bland.sendCall({
    phone_number: '+18438557133',
    pathway_id: '034bf0f2-8f3f-4bb0-90d8-6f74a9683f80',
    sensitive_voicemail_detection: true,
    wait_for_greeting: true,
    request_data: {
      name: 'John Doe',
      age: 30
    },
    record: true,
    max_duration: 60,
    webhook: 'https://webhook.site/',
    webhook_events: ['call'],
    analysis_schema: {
      name: 'string',
      age: 'number'
    }
  })
  console.log(res)
})
