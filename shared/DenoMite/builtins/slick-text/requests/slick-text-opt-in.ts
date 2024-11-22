import {SlickTextRequest} from '../base-request.ts';

export interface slickTextOptInDto { 
  firstName: string, 
  lastName: string,
  phoneNumber: string,
  email: string,
  city: string,
  state: string,
  zip: string
}

export class SlickTextOptIn extends SlickTextRequest {
  type = "POST";
  route = "/contacts"
  constructor(public payload: slickTextOptInDto) {
    super();
  }
}


