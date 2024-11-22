import {
  Context,
} from "jsr:@oak/oak@17.1.3";

// Create the class
export class Ctx {
  body!: any;
  constructor(public root: Context) {
    this.body = root.request.body.json();
  }
}

