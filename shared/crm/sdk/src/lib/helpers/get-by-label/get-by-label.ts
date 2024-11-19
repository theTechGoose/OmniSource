import * as crm from 'crm-assets';
import {crmBridge} from 'type-bridge';
const tableMap = crm.tableMap;

type tableNames = keyof typeof tableMap;

 function getByLabelTable(label: tableNames): crmBridge.CrmTable {
  const tableCode = tableMap[label];
  const crmCopy = {...crm} as any;
  return crmCopy[tableCode];
}

 function getByLabelField<T extends Object>(table: T, field: keyof T): crmBridge.CrmField {
  const tableCopy = {...table} as any;
  return tableCopy['all'][field];
}

export const getByLabel = {
  table: getByLabelTable,
  field: getByLabelField
}

