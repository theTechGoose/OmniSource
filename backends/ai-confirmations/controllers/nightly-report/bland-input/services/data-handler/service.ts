//import { Dep } from "@shared/framework/core";
//import type { DbHandler } from "@shared/framework/plugins";
//import { Buffer } from "node:buffer";
//import { readFileSync } from "node:fs";
//import papa from "npm:papaparse";
//import { withTryCatch } from "@shared/utils";
//
//@Dep
//export class DataHandler {
//  constructor(private db: DbHandler) {}
//  parseData(data: string) {
//    const buff = Buffer.from(data, "base64");
//    const decoded = this.isBase64(data) ? buff.toString("utf8") : data;
//    return papa.parse(decoded, { header: true }).data;
//  }
//
//  isBase64(str: string): boolean {
//    const [data] = withTryCatch(() => btoa(atob(str)));
//    return !!data;
//  }
//
//  getFile(path: string) {
//    return readFileSync(path, "utf8");
//  }
//
//  async saveCalls(_rows: Array<BlandCallRecord>) {
//    const rows = _rows.filter((r) => r.c_id);
//    const op1 = this.db.createOperation(rows)
//      .addPathFragment("bland-calls-by-uid")
//      .addPathFragment((r: BlandCallRecord) => r.c_id)
//      .makeWrite();
//
//    const op2 = this.db.createOperation(rows.map((r) => r.c_id))
//      .addPathFragment("bland-calls-by-date")
//      .addPathFragment(new Date().getTime())
//      .makeWrite();
//
//    const op3 = this.db.createOperation(rows.map((r) => {
//      return {
//        c_id: r.c_id,
//        inbound: r.inbound,
//        from: r.from,
//        to: r.to,
//      };
//    }))
//      .addPathFragment("bland-calls-by-phone-number")
//      .addPathFragment((r) => r.inbound ? r.from : r.to)
//      .makeWrite();
//
//    const results = await this.db.executeOperation(op1, op2, op3);
//    this.db.tearDown();
//    return results;
//  }
//
//  listCallsByDate(start: Date, end: Date) {
//    const op = this.db.createOperation()
//      .addPathFragment("bland-calls-by-date")
//      .makeRead()
//      .limit(100)
//      .start(["'", start.getTime()])
//      .end(["'", end.getTime()]);
//
//    return this.db.executeOperation(op);
//  }
//
//  retrieveCalls(c_id: string) {
//    const op = this.db.createOperation()
//      .addPathFragment("bland-calls-by-uid")
//      .addPathFragment(c_id)
//      .makeRead();
//
//    return this.db.executeOperation(op);
//  }
//}
