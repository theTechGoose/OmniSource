import { Logger } from "@logger";
import { Dep } from "@core";
import axios, {AxiosError, AxiosRequestConfig, type AxiosResponse} from 'npm:axios';


@Dep('http')
export class Http {
  constructor(private logger: Logger) {}

  request(req: AxiosRequestConfig) {
    const [success, fail] = [this.handleSuccess.bind(this), this.handleError.bind(this)];
    return axios(req).then(success).catch(fail);
  } 

  handleSuccess(res: AxiosResponse) {
    this.logger.debug(`Request was successful`, { 
      url: res.config.url,
      status: res.status,
      headers: res.headers,
      payload: res.config.data,
      response: res.data
    });
    return res.data
  }

  handleError(err: AxiosError) {
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

