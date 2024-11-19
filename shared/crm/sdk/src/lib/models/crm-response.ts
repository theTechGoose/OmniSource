
export interface CrmResponse {
    data:     Array<CrmField>;
    fields:   Field[];
    metadata: Metadata;
}

export interface CrmField { [key: string]: Datum }

export interface Datum {
    value: number | string;
}

interface Field {
    id:    number;
    label: string;
    type:  string;
}

interface Metadata {
    totalRecords: number;
    numRecords:   number;
    numFields:    number;
    skip:         number;
}
