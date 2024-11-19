import { CrmTable } from '../models/crm-table';
import { queries } from '../helpers/queries';
import axios from 'axios';
import {
  translateFieldToFid,
  translateForRead,
  translateForWrite,
} from '../helpers/translate/translate';
import * as fields from '../field-logic';
import { normalizeAllValidatorNames, normalizeValidatorNames } from '../helpers/normalize-validator-names';
import { getLogger } from 'logging';
import {crmBridge} from 'type-bridge';

export interface SetReturn<T> {
    data:     Partial<T>[];
    metadata: SetMetadata;
}

export interface SetMetadata {
    createdRecordIds:              number[];
    totalNumberOfRecordsProcessed: number;
    unchangedRecordIds:            number[];
    updatedRecordIds:              number[];
}

type CrmQueryStart<T extends CrmTable> = (
  field: keyof T['all'],
  operator: keyof typeof queries,
  value: string
) => TableQuery<T>;

type CrmQueryFunction<T extends CrmTable> = (
  field: keyof T['all'],
  operator: keyof typeof queries,
  value: string
) => TableQuery<T>;

export class Table<T extends CrmTable> {
  constructor(private headers: any, private table: T) {}

  query: CrmQueryStart<T> = (field, operator, value) => {
    const actualOperator = queries[operator];
    const fieldFid = translateFieldToFid(field, this.table);
    return new TableQuery(
      this.headers,
      this.table,
      `{${fieldFid}.${actualOperator}.${value}}`
    );
  };

  async set(...fieldConfigs: Array<crmBridge.CrmWriteConfig<T>>): Promise<SetReturn<crmBridge.CrmRead<T>>> {
    const cooreced = this.coorceForWrite(fieldConfigs);
    const validationResult = this.validateWrite(cooreced);
    if (validationResult.length > 0) {
      const errors = validationResult.map(
        ({ field, value, fieldMetaData, recordIdMessage }) => {
          return `${recordIdMessage}, Field ${field} with value ${value} failed validation for field type ${fieldMetaData.fieldType}`;
        }
      );
      throw new Error(errors.join('\n'));
    }
    const url = 'https://api.quickbase.com/v1/records';
    const tableId = this.table.tableId;
    const headers = this.headers;
    const body = {
      to: tableId,
      data: this.formatForWrite(cooreced),
    };

    const logger = getLogger({options: {tag: 'crm'}})
    try {
    logger.debug(`Setting data in table ${this.table.tableId}`, 'crm', {body, headers: {...headers, Authorization: ''}, url })
    const { data } = await axios.post(url, body, { headers });
    return data;
    } catch(e: any) {
      logger.error(`Error setting data in table ${this.table.tableId}`, 'crm', {body, headers: {...headers, Authorization: ''}, url, error: e.response.data})
      throw new Error(e)
    }
  }

  private validateWrite(fieldConfigs: Array<crmBridge.CrmWriteConfig<T>>) {
    return fieldConfigs
      .map((fieldConfig) => {
        return Object.entries(fieldConfig)
          .map(([field, value]) => {
            const fieldMetaData = this.table.writeFields[field];
            const [recIdName] =
              Object.entries(this.table.all).find(
                ([_, value]) => value.id === 3
              ) || [];
            const recId = fieldConfig[recIdName ?? 'any'];
            const normalizedObj = normalizeAllValidatorNames(fields);
            const fieldKey = normalizeValidatorNames(fieldMetaData.fieldType);
            const fieldLogic = normalizedObj[fieldKey];
            return {
              validationResult: fieldLogic.validator(value, fieldMetaData),
              field,
              value,
              recordIdMessage: recId
                ? `Record ID: ${recId}`
                : 'No Record ID provided',
              fieldMetaData,
            };
          })
          .filter(({ validationResult }) => !validationResult);
      })
      .flat();
  }

  private coorceForWrite(fieldConfigs: Array<crmBridge.CrmWriteConfig<T>>) {
    return fieldConfigs.map((fieldConfig) => {
      return Object.entries(fieldConfig).reduce((acc, [field, value]) => {
        const fieldMetaData = this.table.writeFields[field];
        const normalizedObj = normalizeAllValidatorNames(fields);
        const fieldKey = normalizeValidatorNames(fieldMetaData.fieldType)
        const fieldLogic = normalizedObj[fieldKey];

        acc[field] = fieldLogic.coorcer(value, fieldMetaData);
        return acc;
      }, {} as any);
    });
  }

  private formatForWrite(fieldConfigs: Array<crmBridge.CrmWriteConfig<T>>) {
    return fieldConfigs.map((fieldConfig) => {
      const formatted = Object.entries(fieldConfig).reduce(
        (acc, [field, value]) => {
          const fieldMetaData = this.table.writeFields[field];
          const normalizedObj = normalizeAllValidatorNames(fields);
            const fieldKey = normalizeValidatorNames(fieldMetaData.fieldType);
            const fieldLogic = normalizedObj[fieldKey];


          acc[field] = fieldLogic.formatter(value, fieldMetaData);
          return acc;
        },
        {} as any
      );
      return translateForWrite(formatted, this.table);
    });
  }
}

class TableQuery<T extends CrmTable> {
  private queries: Array<string> = [];
  constructor(private headers: any, private table: T, querySeed: string) {
    this.queries.push(querySeed);
  }

  and: CrmQueryFunction<T> = (field, operator, value) => {
    const actualOperator = queries[operator];
    const fid = translateFieldToFid(field, this.table);
    this.queries.push('AND');
    this.queries.push(`{${fid}.${actualOperator}.${value}}`);
    return this;
  };

  or: CrmQueryFunction<T> = (field, operator, value) => {
    const actualOperator = queries[operator];
    this.queries.push('OR');
    const fieldFid = translateFieldToFid(field, this.table);

    this.queries.push(`{${fieldFid}.${actualOperator}.${value}}`);
    return this;
  };

  async find(selectOverride?: Array<number>): Promise<Array<crmBridge.CrmRead<T>>> {
    const logger = getLogger({options: {autoInit: true}})
    const url = 'https://api.quickbase.com/v1/records/query';
    const query = this.queries.join('');
    const tableId = this.table.tableId;
    const selectFields = this.table.ids;
    const headers = this.headers;
    const body = {
      from: tableId,
      select: selectOverride ? selectOverride : selectFields,
      where: query,
    };
    logger.debug(`Querying data in table ${this.table.tableId}`, 'crm', {body, url})
    const response = await axios.post(url, body, { headers });
    return translateForRead(response.data, this.table);
  }
}
