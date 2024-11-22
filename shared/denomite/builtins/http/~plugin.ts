import '@global_models';
import { Logger } from "../logger/~index.ts";
import axios, {AxiosError, AxiosRequestConfig, type AxiosResponse} from 'npm:axios';
import {Request} from './base.ts'
import {Dependency} from '../../core/decorators/dependencies/~mod.ts';


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
    this.logger.debug(`Request was successful`, { 
      url: res.config.url,
      status: res.status,
      headers: res.headers,
      payload: res.config.data,
      response: res.data
    });
    return res
}

  private handleError(err: AxiosError) {
    if(!err) throw new Error(`axios threw an error but did not get an error in handler`)
    const {config, response} = err;
    if(!config) throw new Error(`axios error did not have a config object`)
    this.logger.error(`Request failed`, {
      url: config.url,
      status: response?.status,
      payload: config.data,
      responseHeaders: response?.headers,
      responseData: err.response?.data
    });
    throw new Error(err.message)
  }
}
