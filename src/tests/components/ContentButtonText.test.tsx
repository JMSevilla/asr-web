import { ContentButtonText } from '../../components/blocks/ContentButtonText';
import { act, render, screen } from '../common';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

describe('ContentButtonText', () => {
  it('should render button text', () => {
    act(() => {
      render(<ContentButtonText text={'Button'} />);
    });
    expect(screen.queryByText('Button')).toBeInTheDocument();
  });
});
