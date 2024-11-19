import { CrmTable } from "@lib/table/table.ts";
import {Writer} from '@lib/writer/writer.ts';
import {WRITE_FILE_PATH} from '@settings';
const writer = new Writer(WRITE_FILE_PATH)

/* ----------------------------------------- */

writer.registerTables(
  new CrmTable('dateLegs', 'bpb28qsnn')
)

/* ---------------------------------------- */


await writer.cleanUp()
