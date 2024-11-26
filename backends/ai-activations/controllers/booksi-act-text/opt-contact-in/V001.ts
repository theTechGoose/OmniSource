import { Postmark } from "@shared/denomite/integrations/postmark";
import { SlickText } from "@shared/denomite/integrations/slick-text";
import { λ } from "@shared/denomite";

export default async function (pm = λ(Postmark), st = λ(SlickText)) {
  type OptIn = InstanceType<typeof SlickText.interfaces.OptIn['interface']>;
  const email = await pm.getInboundEmail<OptIn>();
  const parser = email.attachments.get(0);
  const csv = parser.asCSV();
  for(const row of csv) {
    await st.optIn(row);
  }
}
