import papaparse from "npm:papaparse";
import {thrw, chkProps} from '@shared/utils'
import { Buffer } from "node:buffer";

export class InboundEmail<T> {
  to: string;
  from: string;
  subject: string;
  attachments: AttachmentList<T>;
  constructor(private e: InboundPostmarkEmail) {
    this.to = e.To;
    this.from = e.From;
    this.subject = e.Subject;
    this.attachments = this.parseAttachments();
  }

  private validate(email: unknown) {
    const propsToCheck = ["To", "From", "Subject", "Attachments"];
    const isEmail = chkProps(email, ...propsToCheck);
    if(!isEmail) thrw("Inbound email webhook is not valid");
  }

  private parseAttachments() {
    this.validate(this.e);
    const output = this.e.Attachments.map((a) => new AttachmentParser<T>(a));
    return new AttachmentList(output);
  }
}

class AttachmentList<T> {
  constructor(private list: Array<AttachmentParser<T>>) {}

  get length() {
    return this.list.length;
  }

  get(id: number | string): AttachmentParser<T> {
    let out = this.list.find((l) => l.name === id);
    if(typeof id === 'number') out = this.list[id];
    if(!out) thrw("Attachment not found");
    return out;
  }

  filter(matcher: string) {
    return this.list.filter((f) => f.name.includes(matcher));
  }

  map(fn: (a: AttachmentParser<T>) => any) {
    return this.list.map(fn);
  }
}

class AttachmentParser<T> {
  name: string;
  content: string;
  constructor(a: Attachment) {
    this.name = a.Name;
    this.content = Buffer.from(a.Content, "base64").toString("utf-8");
  }

  asString(): string {
    return this.content;
  }

  asCSV(): Array<T> {
    const str = this.asString();
    return papaparse.parse(str, { header: true }).data;
  }
}
