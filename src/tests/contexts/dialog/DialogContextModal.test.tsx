import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { TenantContextProvider } from '../../../core/contexts/TenantContext';
import { DialogContextModal } from '../../../core/contexts/dialog/DialogContextModal';
import { render, waitFor } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));
jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({}),
}));
jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {
      data: {
        expirationDate: '2023-12-19T08:19:29.097184+00:00',
      },
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({}),
}));
jest.mock('../../../core/contexts/contentData/useCachedCmsTokens', () => ({
  useCachedCmsTokens: jest.fn().mockReturnValue({}),
}));
jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: { contentAccessKey: 'contentAccessKey' }, loading: false }),
}));
jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({
    page: null,
  }),
}));

const dialogElement = {
  value: {
    elements: {
      callToAction: {
        values: [],
      },
      closeDialogButtonText: {
        elementType: 'text',
        value: 'Cancel',
      },
      dataSourceUrl: {
        elementType: 'text',
        value: 'url',
      },
      dialogKey: {
        elementType: 'text',
        value: 'save_exit',
      },
      header: {
        elementType: 'text',
        value: 'Are you sure you want to exit?',
      },
      text: {
        elementType: 'formattedtext',
        value: '<p>We will save your application until [[data-date:expirationDate]].</p>',
      },
    },
    type: 'Dialog',
  },
} as any;
const renderedText = 'We will save your application until 19 Dec 2023.';

describe('DialogContextModal', () => {
  it('should render modal content', () => {
    const { queryByTestId } = render(
      <DialogContextModal
        dialogElement={dialogElement}
        isButtonLoading={false}
        handleButtonClick={() => {}}
        handleClose={() => {}}
      />,
    );
    expect(queryByTestId('modal-content')).toBeInTheDocument();
    expect(queryByTestId('websession-label-content-header')).not.toBeInTheDocument();
    expect(queryByTestId('websession-label-content')).not.toBeInTheDocument();
  });

  it('should render modal content with loaded data', async () => {
    const { queryByTestId } = render(
      <TenantContextProvider
        tenant={{ logoutUrl: null, primaryColor: { value: '#000' }, tenantUrl: { value: '' } } as any}
        authMethod={null as any}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DialogContextModal
            dialogElement={dialogElement}
            sourceUrl={dialogElement.value.elements.dataSourceUrl.value}
            isButtonLoading={false}
            handleButtonClick={() => {}}
            handleClose={() => {}}
          />
        </LocalizationProvider>
      </TenantContextProvider>,
    );
    await waitFor(() => {
      expect(queryByTestId('modal-content')?.textContent?.trim()).toEqual(renderedText);
    });
  });
});
