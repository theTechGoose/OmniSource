import { CrmResponse } from '../../models/crm-response';
import { CrmTable } from '../../models/crm-table';

interface TranslateOptions {
  for: 'read' | 'write';
}

export function translateFieldToFid<T extends CrmTable>(fieldName: keyof T['all'], table: T) {
  const map = buildMap(table, { for: 'write' });
  return map[fieldName];
}

export function translateForWrite<T extends CrmTable>(config: Record<keyof T['writeFields'], any>, table: T) {
  const map = buildMap(table, { for: 'write' });
  const output = translate(config, map, table.label, {for: 'write'});
  return output
}

export function translateForRead<T extends CrmTable>(
  responseFromQuickbase: CrmResponse,
  table: T
): Array<Record<keyof T['all'], string | number>> {
  const map = buildMap(table, { for: 'read' });

  const output = responseFromQuickbase.data.map((record) => {
  return translate(record, map, table.label, {for: 'read'});
  })

  return output as Array<Record<keyof T['all'], string | number>>
}

function buildMap(table: CrmTable, options: TranslateOptions) {
  return Object.entries(table.all).reduce((acc, [key, value]) => {
    const isForRead = options.for === 'read';
    const newKey = isForRead ? value.id : key;
    const newValue = isForRead ? key : value.id;
    acc[newKey] = newValue;
    return acc;
  }, {} as any);
}

function translate(
  data: any,
  map: any,
  tableName: string,
  options: TranslateOptions
) {
  return Object.entries(data).reduce((acc, [key, content]) => {
    const isForRead = options.for === 'read';
    const value = isForRead ? (content as any).value : {value: content};
    const newKey = map[key];
    if (!newKey) {
      console.log(`No key found for ${key} on table ${tableName}`);
      return acc;
    }
    acc[newKey] = value;
    return acc;
  }, {} as any);
}
