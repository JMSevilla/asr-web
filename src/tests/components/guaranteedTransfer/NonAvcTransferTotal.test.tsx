import { NonAvcTransferTotal } from '../../../components/blocks/guaranteedTransfer/NonAvcTransferTotal';
import { render, screen } from '../../common';

const DEFAULT_PROPS = {
  prefix: 'test-prefix',
  totalGuaranteedTransferValue: 15,
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

describe('NonAvcTransferTotal', () => {
  it('render non avc transfer component', () => {
    render(<NonAvcTransferTotal {...DEFAULT_PROPS} />);

    expect(screen.queryByTestId('transfer-quote-value-non-AVCs')).toBeTruthy();
  });

  it('should render non avc transfer values and texts', () => {
    render(<NonAvcTransferTotal {...DEFAULT_PROPS} />);

    expect(screen.getByText('[[currency:GBP]]15.00')).toBeTruthy();
    expect(screen.getByText('[[test-prefix_value_non_AVCs]]')).toBeTruthy();
    expect(screen.getByText('[[test-prefix_value_non_AVCs_text]]')).toBeTruthy();
  });
});
