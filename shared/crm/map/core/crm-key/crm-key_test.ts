import {CrmKey} from './crm-key.ts';
import { assertEquals } from "jsr:@std/assert";


Deno.test("it should normalize a crm key",  () => {
  const ultimateTest = 'SunRise@9am_Wild-Moon#42!RainCloud^Forest$Peak3'
  const crmKey = new CrmKey(ultimateTest);
  assertEquals(crmKey.sanitizedLabel, 'sunRiseAtNineAmUnderscoreWildDashMoonHashFourTwoExclamationRainCloudCaretForestDollarPeakThree')
});
