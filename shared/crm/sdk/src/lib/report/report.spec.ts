import { hosts } from 'configs';
import { HostManager } from "utils"
const hostManager = new HostManager(hosts)
const bridge = hostManager.getBridge()
bridge.connectServiceAccount()
import { CrmReport } from './report';



it('should get a report', async () => {
    const tableId = 'bt649a9ed'
    const crmReport = CrmReport.getFromTableById(tableId, '1')
    const report = await crmReport.get()
    console.log(report.translation)
})
