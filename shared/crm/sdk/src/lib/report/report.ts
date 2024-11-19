import axios from 'axios';
import { CrmTable } from '../models/crm-table';
import { translateForRead } from '../helpers/translate/translate';
import { CrmResponse, CrmField, Datum } from '../models/crm-response';
import { getSecret } from "utils"
import  * as tables from 'crm-assets';

const crmSecretSource = 'projects/792057068420/secrets/CRM_KEY/versions/1'

interface ReportOptions {
  forceRefresh: boolean;
}

export class CrmReport<T extends CrmTable> {
    headers = null as Record<string, string>
  get url() {
    const { tableId } = this.table;
    return `https://api.quickbase.com/v1/reports/${this.reportId}/run?tableId=${tableId}`;
  }
  private cache = null as CrmResponse;
  constructor(
    private table: T,
    private reportId: string,
  ) {}

    static getFromTableById(id: string, reportId: string) {
        const table = tables[id]
        return new CrmReport(table, reportId)
    }

  async get(options?: ReportOptions) {
    const secret = await getSecret(crmSecretSource)
    this.headers = JSON.parse(secret)
    if (this.cache && !options?.forceRefresh) {
      return new Translator(this.cache, this.table);
    }
    const { headers } = this;
    const reportResponse = await axios.post(this.url, {}, { headers });
    this.cache = reportResponse.data;
    return new Translator(this.cache, this.table);
  }
}

class Translator<T extends CrmTable> {
  get translation() {
    return translateForRead(this._value, this.table);
  }

  get value() {
    return this._value.data.map(this.unwrapRecord.bind(this));
  }

  constructor(private _value: CrmResponse, private table: T) {}

  private unwrapRecord(record: CrmField) {
    return Object.entries(record).reduce((acc, [key, value]) => {
      acc[key] = this.unwrapField(value as Datum );
      return acc;
    }, {});
  }

  private unwrapField(field: { value: string | number }) {
    return field.value;
  }
}
