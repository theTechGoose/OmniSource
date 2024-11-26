import { IParsedEndpoint, } from "@root/core/server/models.ts";
import {AdapterInstance} from "@root/models.ts";

export abstract class ServerPlugin {
  abstract keywords: Array<string>
  protected targets: Array<IParsedEndpoint> = []
  constructor(protected adapter: AdapterInstance, private endpoints: Array<IParsedEndpoint>) {}

  filter() {
    this.targets = this.endpoints.filter((endpoint) => {
      return this.keywords.includes(endpoint.verb.toLowerCase())
    })
  }

  abstract apply(): Promise<void>

}
