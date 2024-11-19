import { getSecret, addMemoization } from 'utils'
import {Table} from './lib/table/table'
export * from './lib/report/report'


import {btudupdrb, bt6i6abf4, btud6gf85, bt649a9ed, bt649cru6, applications, contacts, dispositions, talenttrackcalls, talenttracktexts, talenttrackcontacts, texts, recruiters, dateleg, packagesummary, payments, masterreservations} from 'crm-assets'

const crmSecretSource = 'projects/792057068420/secrets/CRM_KEY/versions/1'


export const getPackageSummaryTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, packagesummary)
})

export const getMasterReservationsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, masterreservations)
})

export const getDatelegTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, dateleg)
})

export const getPaymentsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, payments)
})


export const getApplicantsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, btudupdrb)
})


export const getRecruitersTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, recruiters)
})


export const getDispositionTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, dispositions)
})

export const getTextsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, texts)
})

export const getContactsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, contacts)
})

export const getApplicationsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, applications)
})

export const getCallsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, bt6i6abf4)
})

export const getDepartmentsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, btud6gf85)
})


export const getLinksTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, bt649a9ed)
})

export const getLinkEventTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, bt649cru6)

})


export const getTalentTrackCallsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, talenttrackcalls)
})

export const getTalentTrackTextTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, talenttracktexts)
})


export const getTalentTrackContactsTable = addMemoization(async () => {
  let secret = await getSecret(crmSecretSource)
  secret = JSON.parse(secret)
  return new Table(secret, talenttrackcontacts)
})
