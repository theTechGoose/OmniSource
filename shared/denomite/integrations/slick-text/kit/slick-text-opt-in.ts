import { SlickTextRequest } from "../_base.ts";

export const OptInDto = class {
  [key: string]: string | number;
  action = 'OPTIN';
  textword = 4248239
  activation_value!: string
  destination!: string
  last_message!: string
  ai_response!: string
  date_set!: string;
  firstName!: string;
  lastName!: string;
  number!: string;
  phone_number!: string;
  email!: string;
  city!: string;
  state!: string;
  zip!: string;
}



export class SlickTextOptIn extends SlickTextRequest {
  static interface = OptInDto;
  type = "POST";
  route = "/contacts";

  constructor(public payload: InstanceType<typeof OptInDto>) {
    super();
  }
}
