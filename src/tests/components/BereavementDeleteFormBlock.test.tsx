import { BereavementDeleteFormBlock } from '../../components';
import { useBereavementSession } from '../../core/contexts/bereavement/BereavementSessionContext';
import { render } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/contexts/bereavement/BereavementSessionContext', () => ({
  useBereavementSession: jest.fn().mockReturnValue({ bereavementDelete: jest.fn() }),
}));

describe('BereavementDeleteFormBlock', () => {
  it('should call bereavementDelete function on load', () => {
    const deleteFn = jest.fn();
    jest.mocked(useBereavementSession).mockReturnValue({ bereavementDelete: deleteFn } as any);
    render(<BereavementDeleteFormBlock />);
    expect(deleteFn).toHaveBeenCalledTimes(1);
  });
});
