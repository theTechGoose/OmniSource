import { Http } from "../http/~plugin.ts";
import {sleep} from '@utils';
import type {SlickTextRequest} from './base-request.ts';
import {SlickTextOptIn, type slickTextOptInDto} from './requests/slick-text-opt-in.ts';
import {Dependency} from '../../core/decorators/dependencies/~mod.ts';


@Dependency
export class SlickText {
  private async runRequest(req: SlickTextRequest) {
    const axiosRequest = await this.http.request(req)
    if(!axiosRequest) throw new Error(`axios request failed`)
    const rateLimitReset = req.checkRateLimit(axiosRequest.headers)
    if(rateLimitReset) await sleep(rateLimitReset);
    return axiosRequest.data;
  }

  constructor(private http: Http) {}

  optIn(dto: slickTextOptInDto) {
    const req = new SlickTextOptIn(dto);
    return this.runRequest(req);
  }
}
