import { CmsTenant } from '../../../api/content/types/tenant';

export const retirementApplicationStatusParams = (tenant: CmsTenant | null) => ({
  preRetirementAgePeriod: tenant?.preRetiremetAgePeriod?.value ?? 0,
  newlyRetiredRange: tenant?.newlyRetiredRange?.value ?? 0,
  retirementApplicationPeriod: 6,
});
