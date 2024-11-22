import papaparse from "npm:papaparse";
import { Buffer } from "node:buffer"

export class InboundEmail {
  to: string;
  from: string;
  subject: string;
  constructor(private e: InboundPostmarkEmail) {
    this.to = e.To;
    this.from = e.From;
    this.subject = e.Subject;
  }

  parseAttachments() {
    const output = this.e.Attachments.map(a => new AttachmentParser(a));
    return new AttachmentList(output)
  }
}

class AttachmentList {
  constructor(private list: Array<AttachmentParser>) {}

  get length() {
    return this.list.length;
  }

  filter(matcher: string) {
    return this.list.filter(f => f.name.includes(matcher))
  }

  map(fn: (a: AttachmentParser) => any) {
    return this.list.map(fn)
  }
}

class AttachmentParser {
  name: string;
  content: string;
  constructor(a: Attachment) {
    this.name = a.Name;
    this.content = Buffer.from(a.Content, 'base64').toString('utf-8');
  }

  asString(): string {
    return this.content;
  }

  asCSV<T extends any>(): Array<T> { 
    const str = this.asString();
    return papaparse.parse(str, {header: true}).data;
  }
}



