import { ComponentProps } from 'react';
import { CmsTokens } from '../../../api/types';
import { LTAUsedPercentageBlock } from '../../../components';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof LTAUsedPercentageBlock> = {
  formKey: 'key',
};
const MOCKED_TOKENS: Partial<CmsTokens> = { chosenLtaPercentage: 60, remainingLtaPercentage: 40 };

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ loading: false, cmsTokens: null }),
}));

describe('LTAUsedPercentageBlock', () => {
  it('should not render when cmsTokens is null', () => {
    render(<LTAUsedPercentageBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('lta-used-percentage-block')).toBeFalsy();
  });

  it('should display loader', () => {
    jest.mocked(useContentDataContext).mockReturnValueOnce({ loading: true } as any);
    render(<LTAUsedPercentageBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('lta-used-percentage-loader')).toBeTruthy();
  });

  it('should display chosenLtaPercentage and remainingLtaPercentage values', () => {
    jest.mocked(useContentDataContext).mockReturnValueOnce({ cmsTokens: MOCKED_TOKENS, loading: false } as any);
    render(<LTAUsedPercentageBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('lta-used-percentage-block')).toBeTruthy();
    expect(screen.queryByText(`${MOCKED_TOKENS.chosenLtaPercentage}%`)).toBeTruthy();
    expect(screen.queryByText(`${MOCKED_TOKENS.remainingLtaPercentage}%`)).toBeTruthy();
  });
});
