import { DeleteJourneysBlock } from '../../components/blocks/DeleteJourneysBlock';
import * as apiHooks from '../../core/hooks/useApi';
import { useRouter } from '../../core/router';
import { render } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ asPath: '/page' }) }));
jest.mock('../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: () => ({ loading: false, refresh: jest.fn() }),
}));

describe('DeleteJourneysBlock', () => {
  it('should call correct api calls', () => {
    const deleteRetirementFn = jest.fn();
    const deleteBereavementFn = jest.fn();
    const deleteGenericFn = jest.fn();
    jest.spyOn(apiHooks, 'useApi').mockImplementation(apiFn => {
      apiFn({
        content: {
          urlFromKey: jest.fn(),
        },
        mdp: {
          retirementJourneyDelete: deleteRetirementFn,
          bereavementEnd: deleteBereavementFn,
          genericJourneyDelete: deleteGenericFn,
        },
      } as any);
      return { result: { data: { url: '/page' } } } as any;
    });
    render(<DeleteJourneysBlock pageKey="page" parameters={[{ key: 'journeys', value: 'retirement;generic' }]} />);
    expect(deleteRetirementFn).toHaveBeenCalledTimes(1);
    expect(deleteBereavementFn).toHaveBeenCalledTimes(0);
    expect(deleteGenericFn).toHaveBeenCalledTimes(1);
  });

  it('should not call api calls on wrong page', () => {
    const deleteRetirementFn = jest.fn();
    const deleteBereavementFn = jest.fn();
    const deleteGenericFn = jest.fn();
    jest.spyOn(apiHooks, 'useApi').mockImplementation(apiFn => {
      apiFn({
        content: {
          urlFromKey: jest.fn(),
        },
        mdp: {
          retirementJourneyDelete: deleteRetirementFn,
          bereavementEnd: deleteBereavementFn,
          genericJourneyDelete: deleteGenericFn,
        },
      } as any);
      return { result: { data: { url: '/page' } } } as any;
    });
    jest.mocked(useRouter).mockReturnValue({ asPath: '/wrong-page' } as any);
    render(<DeleteJourneysBlock pageKey="page" parameters={[{ key: 'journeys', value: 'retirement;generic' }]} />);
    expect(deleteRetirementFn).not.toHaveBeenCalled();
    expect(deleteBereavementFn).not.toHaveBeenCalled();
    expect(deleteGenericFn).not.toHaveBeenCalled();
  });
});
