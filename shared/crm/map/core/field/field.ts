import _ from 'npm:lodash';
import {NON_WRITEABLE_FIELDS} from '@settings';
import { CrmKey } from "@lib/crm-key/crm-key.ts";

export class Field {
  appearsByDefault!: boolean;
  audited!: boolean;
  bold!: boolean;
  doesDataCopy!: boolean;
  fieldHelp!: string;
  fieldType!: string;
  findEnabled!: boolean;
  id!: number;
  label!: string;
  mode!: string;
  noWrap!: boolean;
  properties!: Properties;
  required!: boolean;
  unique!: boolean;
  writeable: boolean; 
  key: CrmKey;

  constructor(fields: any) {
    Object.assign(this, fields);
    this.writeable = !NON_WRITEABLE_FIELDS.includes(this.fieldType);
    this.key = new CrmKey(this.label);
  }

  serialize() {
    const copy = _.cloneDeep(this);
    return copy;
  }
}

export interface Properties {
  allowNewChoices: boolean;
  carryChoices: boolean;
  defaultValue: string;
  displayCheckboxAsText: boolean;
  doesTotal: boolean;
  foreignKey: boolean;
  formula: string;
  primaryKey: boolean;
  sortAsGiven: boolean;
}
