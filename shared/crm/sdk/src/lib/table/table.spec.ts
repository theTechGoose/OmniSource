import { getGenericSecret } from '@Server-Utils/utilities';
import { Table } from './table';
import { btudupdrb } from '@ai-monsters/crm-assets';

    const secretSource = 'projects/959628264057/secrets/CRM_KEY/versions/1'

describe('crm-table', () => {
  it('should have a CrmTable interface', async () => {
    let secret = await getGenericSecret(secretSource)
    secret = JSON.parse(secret)
    const applicants = new Table(secret, btudupdrb)
    const response = await applicants.set({ officeIntDateTime: 'hello'})
  })

  it('should read a table', async () => {
    let secret = await getGenericSecret(secretSource)
    secret = JSON.parse(secret)
    const applicants = new Table(secret, btudupdrb)
    const query = await applicants.query('officeIntDateTime', 'is', 'poop').find();
  })

})
