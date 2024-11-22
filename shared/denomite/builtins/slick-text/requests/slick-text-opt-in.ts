import { SlickTextRequest } from "../base-request.ts";

const dto = class {
      firstName!: string;
      lastName!: string;
      phoneNumber!: string;
      email!: string;
      city!: string;
      state!: string;
      zip!: string;
  }


export class SlickTextOptIn extends SlickTextRequest {
  static interface = dto; 
  type = "POST";
  route = "/contacts";

  constructor(public payload: InstanceType<typeof dto>) {
    super();
  }

}
