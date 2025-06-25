import { TransferSummaryBlock } from '../../../components';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/contexts/bereavement/BereavementSessionContext', () => ({
  useBereavementSession: jest.fn().mockReturnValue({ bereavementDelete: jest.fn() }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: {} }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));
jest.mock('../../../components/blocks/transferSummary/hooks', () => ({
  useTransferSummaryDetailsValues: jest.fn().mockReturnValue({
    parseConsent: jest.fn(),
    parseValue: jest.fn(),
    parseUserValue: jest.fn(),
    parsePensionWiseLabel: jest.fn(),
    parsePensionWiseValue: jest.fn(),
    parseFlexibleBenefitsValue: jest.fn(),
    loading: false,
  }),
}));

describe('TransferSummaryBlock', () => {
  it('should render Transfer summary block', () => {
    render(<TransferSummaryBlock id={'transfer-summary'} pageKey={''} parameters={[]} />);

    expect(screen.getByTestId('transfer-summary')).toBeTruthy();
  });
});
