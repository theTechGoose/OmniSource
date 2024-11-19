import type { CrmTable } from "../table/table.ts";

const crmFileTypes = {
  "master-index": {
    ext: "ts",
  },
  "metadata": {
    ext: "ts",
  },
  "sample": {
    ext: "json",
  },
};

interface TableMetadata {
  label: string;
  id: string;
  all: Record<string, any>;
  writeable: Record<string, any>;
  fieldIndex: Record<string, any>;
}

export class Writer {
  private tables: CrmTable[] = [];
  private _currentTable: CrmTable | null = null;

  get tablePath() {
    return `${this.distPath}/tables`;
  }

  private get currentTable() {
    if (!this._currentTable) throw new Error("No current table set");
    return this._currentTable;
  }

  private set currentTable(table: CrmTable) {
    this.tables.push(table);
    this._currentTable = table;
  }

  constructor(private distPath: string) {}

  private buildPathToTable(type: keyof typeof crmFileTypes) {
    const fileType = crmFileTypes[type];
    return `${this.tablePath}/${type}.${fileType.ext}`;
  }

  async registerTables(...tables: Array<CrmTable>) {
    await this.createFolder();
    const $ = tables.map(this.saveTable.bind(this));
    await Promise.all($);
    return this;
  }

  private async saveTable(table: CrmTable) {
    this.currentTable = table;
    await table.load();
    const fs = await import("node:fs");
    const tablePath = this.buildPathToTable("metadata");
    const payload: TableMetadata = {
      label: table.label,
      id: table.id,
      all: table.asAll(),
      writeable: table.asWriteable(),
      fieldIndex: table.fieldsAsIds(),
    };
    const final = this.valueAsVariableExport(payload, table.id);
    fs.writeFileSync(tablePath, final);
  }

  private valueAsVariableExport(value: any, key: string) {
    return `export const ${key} = ${JSON.stringify(value, null, 2)};`;
  }

  private async createFolder() {
    const fs = await import("node:fs");
    if (!fs.existsSync(this.tablePath)) {
      fs.mkdirSync(this.tablePath, { recursive: true });
    }
  }

  async cleanUp() {
    const path = await import("node:path");
    const fs = await import("node:fs");
    const masterIndexPath = path.join(this.distPath, "master-index.ts");
    const masterIndex = this.tables.map((t) => {
      const tablePath = this.buildPathToTable("metadata");
      const relativePath = path.relative(this.distPath, tablePath);
      const i = `import { ${t.id} } from './${relativePath}'`;
      const e = `export const ${t.label} = ${t.id};\n`;
      const ef = `export { ${t.id} } from './${relativePath}'`;
      return { i, ef, e };
    }).reduce((acc, formatted) => {
      acc[0].push(formatted.i);
      acc[1].push(formatted.ef);
      acc[2].push(formatted.e);
      return acc;
    }, [[], [], []] as Array<Array<any>>);
    const toWrite = masterIndex.map((i) => i.join("\n")).join("\n\n");
    fs.writeFileSync(masterIndexPath, toWrite);
  }
}
