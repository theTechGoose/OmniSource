import { BlandRequest } from "../_base.ts";

type webhookEvents = 'call'
type blandVoice = 'Alexa'

export const SendCallDto = class {
      from ='+18432795984';
      voice: blandVoice = 'Alexa' 
      interruption_threshold: number = 100
      phone_number!: string;
      pathway_id!: string;
      sensitive_voicemail_detection!: boolean;
      wait_for_greeting!: boolean;
      request_data!: Record<string, string | number>; //data for the bot to use in the call
      record!: boolean; //record call
      max_duration!: number //seconds
      webhook!: string;
      webhook_events!: Array<webhookEvents>
      analysis_schema!:  Record<string, string>;
      constructor(config: any) {
        Object.assign(this, config)
      }
}

export class BlandSendCallRequest extends BlandRequest {
  static interface = SendCallDto;
  type = "POST";
  route = "https://api.bland.ai/v1/calls";
  constructor(public payload: Partial<InstanceType<typeof SendCallDto>>) {
    super();
  }
}
