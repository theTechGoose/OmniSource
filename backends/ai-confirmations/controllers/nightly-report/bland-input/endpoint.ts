import { NightlyReport } from "../~index.ts";
//import { Http, Postmark } from "@shared/framework/plugins";
//import {Logger} from "@shared/framework/logger"
//import { DataHandler } from "./services/data-handler/service.ts";
//import cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
//import { Inject, Body } from "@shared/framework/core";
//import { NoAuth } from "@shared/framework/auth";
//
//
@NightlyReport.Post("bland-input")
export class BlandInput {
  //pm = Inject(Postmark);
  //dh = Inject(DataHandler);
  //http = Inject(Http);
  //logger = Inject(Logger);

  handle(body: unknown) {
    console.log(this);

    return;
    if (typeof body !== "object") {
      return { message: "body needs to be an object" };
    }

    const isPostmarkAttachment = this.hasProperty(body, "Subject", "pma");
    const isCsv = this.hasProperty(body, "path", "csv");
    const isLink = this.hasProperty(
      body,
      "Subject",
      "pml",
      "Your Bland Call Export is Ready!",
    );
    //order matters because matcher is optional, sorting has been implemented howver, conflicts
    //between matchers will be resolved by the first one found
    const results = this.handleResults(isPostmarkAttachment, isCsv, isLink);
    this.logger.info(`Determining type of input`, { results });
    if (results.isError) new Error(results.errorMsg);
    return results.cb(body);
  }

  handleResults(...results: Array<PropertyCheckerResult>) {
    const sorted = results.sort((a) => a.matcher ? -1 : 1);
    const isError = sorted.every((r) => !r.result);
    let errorMsg = sorted.filter((r) => !r.result).map((r) => r.msg).join(" ");
    errorMsg = isError ? errorMsg + " No match found" : errorMsg;
    if (isError) throw new Error(errorMsg);
    const matched = sorted.find((r) => r.result);
    if (!matched) throw new Error("No match found");
    return {
      isError,
      type: matched.type,
      key: matched.key,
      matcher: matched.matcher,
      errorMsg,
      cb: matched.cb,
    };
  }

  hasProperty(
    obj: unknown,
    key: string,
    type: "pma" | "pml" | "csv",
    matcher?: string,
  ) {
    const cbs = {
      pma: this.fromPostmarkAttachment.bind(this),
      pml: this.fromPostmarkLink.bind(this),
      csv: this.fromFileCsv.bind(this),
    };
    const pc = new PropertyChecker({ type, key, matcher, cb: cbs[type] });
    if (typeof obj !== "object") return pc.run("body needs to be an object");
    if (!obj) return pc.run("body is empty");
    const value = obj[key as keyof typeof obj];
    if (matcher && value === matcher) return pc.run();
    return (key in obj) ? pc.run() : pc.run(`not found`);
  }

  async fromPostmarkLink(_body: unknown) {
    const email = _body as InboundPostmarkEmail;
    const $ = cheerio.load(email.HtmlBody);
    const hrefList: string[] = [];
    $("a").each((_: any, element: any) => {
      const href = $(element).attr("href");
      if (href) hrefList.push(href);
    });
    const href = hrefList.find((h) => h.includes("exports-global"));

    const csv = await this.http.request({
      method: "GET",
      url: href,
    });
    return csv;

    const parsed = this.dh.parseData(csv.data);
    return parsed;

    //await this.dh.saveCalls(parsed);
    //return ;
  }

  async fromFileCsv(_body: unknown) {
    interface CsvInput {
      path: string;
    }
    const body = _body as CsvInput;
    const file = this.dh.getFile(body.path);
    const parsed = this.dh.parseData(file);
    await this.dh.saveCalls(parsed);
    return { message: "ok" };
  }


  async fromPostmarkAttachment(_email: unknown) {
    const email = _email as InboundPostmarkEmail;
    const parsedEmail = this.pm.parseEmail(email);
    if (!parsedEmail) return { message: "No CSV attachment found" };
    const filtered = parsedEmail.parseAttachments().filter(".csv");
    for (const csv of filtered) {
      await this.dh.saveCalls(csv.asCSV());
    }
    return { message: "ok" };
  }
}


interface PropertyCheckerInput {
  type: string;
  key: string;
  matcher: string | undefined;
  cb: any;
}

type PropertyCheckerResult = PropertyCheckerInput & {
  msg: string | null;
  result: boolean;
};

class PropertyChecker {
  constructor(private pci: PropertyCheckerInput) {}
  run(msg?: string): PropertyCheckerResult {
    const { type, key, matcher, cb } = this.pci;
    const result = !msg;
    return {
      type: type,
      key: key,
      matcher: matcher,
      result,
      msg: result ? `${type}::${key}::${msg}` : null,
      cb,
    };
  }
}
