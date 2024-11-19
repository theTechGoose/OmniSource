import { getByLabel } from './get-by-label';
describe('Path: get-by-label.spec.ts', () => {
  it('should get the table by label', () => {
    const table = getByLabel('applicants')
    console.log(table)
  })
});
