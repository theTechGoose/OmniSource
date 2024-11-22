import { Postmark } from "@denomite/builtins/postmark/~plugin.ts";
import { SlickText } from "@denomite/builtins/slick-text/mod.ts";
import {I} from '@denomite/builtins/utils/interface.ts'
import { $ } from "@denomite/loader";
type OptIn = I<typeof SlickText.interfaces.OptIn>

export default async function (pm = $(Postmark), st = $(SlickText)) {
  const email = pm.getInboundEmail<OptIn>();
  const parser = email.attachments.get(0);
  const csv = parser.asCSV();
  for(const row of csv) {
    await st.optIn(row);
  }
}
