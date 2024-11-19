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
