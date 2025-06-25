import { CmsTenant } from '../../../api/content/types/tenant';
import { retirementApplicationStatusParams } from '../../../core/contexts/retirement/utils';

describe('retirementApplicationStatusParams', () => {
  it('should return the correct params when tenant is null', () => {
    const params = retirementApplicationStatusParams(null);
    expect(params).toEqual({
      preRetirementAgePeriod: 0,
      newlyRetiredRange: 0,
      retirementApplicationPeriod: 6,
    });
  });

  it('should return the correct params when tenant is not null', () => {
    const params = retirementApplicationStatusParams({
      preRetiremetAgePeriod: { value: 1 },
      newlyRetiredRange: { value: 2 },
    } as CmsTenant);
    expect(params).toEqual({
      preRetirementAgePeriod: 1,
      newlyRetiredRange: 2,
      retirementApplicationPeriod: 6,
    });
  });
});
