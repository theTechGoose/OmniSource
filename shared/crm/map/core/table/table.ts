import axios from 'npm:axios';
import { Field } from "@lib/field/field.ts";
import { Sampleable } from "@lib/sampleable/sampleable.ts";

export class CrmTable extends Sampleable {
  fields: Field[] = [];
  constructor(public label: string, public id: string) {
    super()
  }

  fieldsAsIds() {
    console.log(`Getting field ids for ${this.label}`);
    return this.fields.map((field) => field.id);
  }

  asWriteable() {
    console.log(`Getting writeable fields for ${this.label}`);
    const writeable = this.fields.filter((field) => field.writeable);
    return this.wrapPayload(...writeable);
  }

  asAll() {
    console.log(`Getting all fields for ${this.label}`);
    return this.wrapPayload(...this.fields);
  }

  private wrapPayload(...fields: Field[]) {
    return fields.reduce((acc, field) => {
      acc[field.key.value] = field.serialize();
      return acc;
    }, {} as any)
  }

  async load() {
    await this.DO_NOT_USE_requestMap().then((res) => {
      this.fields = res.data.map((field: any) => new Field(field));
      return this.fields
    });
    return this
  }

  DO_NOT_USE_requestMap() {
  console.log(`Requesting table ${this.label}`);
  const headers =  JSON.parse(Deno.env.get("QB_SECRET") ?? "{}");
  const url = `https://api.quickbase.com/v1/fields?tableId=${this.id}&inclueFieldPerms=true`;
    console.log({url, headers });
  const payload =  axios.get(url, { headers });
  console.log(`Got data for ${this.label}`);
  return payload;
  }
}

