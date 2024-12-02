import { Bland } from "@shared/denomite/integrations/bland";
import { OakCtx, λ } from "@shared/denomite";

export default async function (bland = λ(Bland), ctx = λ(OakCtx)) {
  const body = await ctx.body
  const phone_number = body.phone_number;
  const pathway_id = "034bf0f2-8f3f-4bb0-90d8-6f74a9683f80";
  await bland.sendCall({
    pathway_id,
    from: "+18432795984",
    phone_number,
    max_duration: 5,
  });
}
