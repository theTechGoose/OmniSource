import { Http } from "@root/infrastructure/http/_mod.ts";
import {Dependency} from '@root/core/resolution/_mod.ts';
import {BlandSendCallRequest, SendCallDto} from "../kit/send-call.ts";
import {BlandRequest} from "../_base.ts";


@Dependency
export class Bland {
  static interfaces = {
    SendCall: BlandSendCallRequest
  }

  private async runRequest(req: BlandRequest) {
    const axiosRequest = await this.http.request(req)
    if(!axiosRequest) throw new Error(`axios request failed`)
    return axiosRequest.data;
  }

  constructor(private http: Http) {}

  sendCall(dto: Partial<InstanceType<typeof SendCallDto>>) {
    // setting defaults by newing up the SendCallDto
    const payload = new SendCallDto(dto);
    const req = new BlandSendCallRequest(payload);
    return this.runRequest(req);
  }
}
