import { Logger } from "@root/features/logger/core/_mod.ts";
import {withTryCatch} from "@shared/utils";
import axios, {AxiosError, AxiosRequestConfig, type AxiosResponse} from 'npm:axios';
import {Request} from '../_base.ts'
import {Dependency} from '@root/core/resolution/_mod.ts';


@Dependency
export class Http {
  constructor(private logger: Logger) {}
  request(req: Request) {
    const {requestUrl, type, headers, payload} = req;
    return this._request({
      url: requestUrl,
      method: type,
      headers,
      data: payload
    });
  }

  _request(req: AxiosRequestConfig) {
    const [success, fail] = [this.handleSuccess.bind(this), this.handleError.bind(this)];
    return axios(req).then(success).catch(fail);
  } 

  private handleSuccess(res: AxiosResponse) {
    const [payload] = withTryCatch(() => JSON.parse(res.config.data))
    this.logger.debug(`Request was successful`, { 
      url: res.config.url,
      status: res.status,
      headers: res.headers,
      payload,
      response: res.data
    });
    return res
}

// 
  private handleError(err: AxiosError) {
    if(!err) throw new Error(`axios threw an error but did not get an error in handler`)
    const {config, response} = err;
    if(!config) throw new Error(`axios error did not have a config object`)
    const [payload] = withTryCatch(() => JSON.parse(config.data))
    this.logger.error(`Request failed`, {
      url: config.url,
      status: response?.status,
      payload,
      requestHeaders: config.headers,
      responseHeaders: response?.headers,
      responseData: err.response?.data
    });
    throw new Error(err.message)
  }
}
