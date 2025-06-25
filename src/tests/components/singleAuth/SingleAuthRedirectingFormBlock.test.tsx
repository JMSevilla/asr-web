import { useTokenEnrichedValue } from '../../../cms/inject-tokens';
import { SingleAuthRedirectingFormBlock } from '../../../components/blocks/singleAuth/SingleAuthRedirectingFormBlock';
import { useRouter } from '../../../core/router';
import { render, waitFor } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../cms/inject-tokens', () => ({
  useTokenEnrichedValue: jest.fn(),
}));

describe('SingleAuthRedirectingFormBlock', () => {
  const mockPush = jest.fn();
  const mockParseUrlAndPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      parseUrlAndPush: mockParseUrlAndPush,
    });

    (useTokenEnrichedValue as jest.Mock).mockImplementation(value => value);
  });

  test('should not redirect when nextPage is empty', () => {
    (useTokenEnrichedValue as jest.Mock).mockReturnValue('');

    render(<SingleAuthRedirectingFormBlock id="test-id" parameters={[{ key: 'success_next_page', value: '' }]} />);

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockParseUrlAndPush).not.toHaveBeenCalled();
  });

  test('should redirect to external URL when nextPage is a valid URL', async () => {
    const externalUrl = 'https://example.com/path';
    (useTokenEnrichedValue as jest.Mock).mockReturnValue(externalUrl);

    render(
      <SingleAuthRedirectingFormBlock id="test-id" parameters={[{ key: 'success_next_page', value: externalUrl }]} />,
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(externalUrl);
      expect(mockParseUrlAndPush).not.toHaveBeenCalled();
    });
  });

  test('should redirect to internal route when nextPage is not a URL', async () => {
    const internalPath = '/dashboard';
    (useTokenEnrichedValue as jest.Mock).mockReturnValue(internalPath);

    render(
      <SingleAuthRedirectingFormBlock id="test-id" parameters={[{ key: 'success_next_page', value: internalPath }]} />,
    );

    await waitFor(() => {
      expect(mockParseUrlAndPush).toHaveBeenCalledWith(internalPath);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test('should render nothing to the DOM', () => {
    const { container } = render(
      <SingleAuthRedirectingFormBlock id="test-id" parameters={[{ key: 'success_next_page', value: '/some-path' }]} />,
    );

    expect(container.firstChild).toBeNull();
  });
});
