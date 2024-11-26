import { Http } from "@root/infrastructure/http/_mod.ts";
import {sleep} from '@shared/utils';
import {SlickTextRequest} from '../_base.ts';
import {SlickTextOptIn, OptInDto} from '../kit/slick-text-opt-in.ts';
import {Dependency} from '@root/core/resolution/_mod.ts';


@Dependency
export class SlickText {
  static interfaces = {
    OptIn: SlickTextOptIn
  }

  private async runRequest(req: SlickTextRequest) {
    const axiosRequest = await this.http.request(req)
    if(!axiosRequest) throw new Error(`axios request failed`)
    const rateLimitReset = req.checkRateLimit(axiosRequest.headers)
    if(rateLimitReset) await sleep(rateLimitReset);
    return axiosRequest.data;
  }

  constructor(private http: Http) {}

  optIn(dto: InstanceType<typeof OptInDto>) {
    const req = new SlickTextOptIn(dto);
    return this.runRequest(req);
  }
}
