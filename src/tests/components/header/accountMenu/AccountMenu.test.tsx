import { MenuItem, SubMenuItem } from '../../../../api/content/types/menu';
import { Membership } from '../../../../api/mdp/types';
import { AccountMenu } from '../../../../components/header/accountMenu/AccountMenu';
import { useDialogContext } from '../../../../core/contexts/dialog/DialogContext';
import { useRouter } from '../../../../core/router';
import { fireEvent, render, screen, waitFor } from '../../../common';

jest.mock('../../../../components/header/accountMenu/AccountMenuList', () => ({
  AccountMenuList: jest.fn(
    ({ accountItem, onItemClick }: { accountItem?: MenuItem; onItemClick: (item: SubMenuItem) => void }) => (
      <div data-testid="mock-account-menu-list">
        {accountItem?.elements.subMenuItems?.values?.map((item: SubMenuItem, idx: number) => (
          <button key={idx} data-testid={`menu-item-${item.elements.name.value}`} onClick={() => onItemClick(item)}>
            {item.elements.name.value}
          </button>
        ))}
      </div>
    ),
  ),
}));

// Suppress JSDOM navigation errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.toString().includes('Error: Not implemented: navigation')) {
    return;
  }
  originalConsoleError(...args);
};

jest.mock('../../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../../core/contexts/dialog/DialogContext', () => ({
  useDialogContext: jest.fn(),
}));

jest.mock('../../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('../../../../core/hooks/useScroll', () => ({
  useScroll: jest.fn().mockReturnValue({
    enableScroll: jest.fn(),
    disableScroll: jest.fn(),
  }),
}));

jest.mock('../../../../components/header/accountMenu/hooks', () => ({
  useContentScroller: jest.fn().mockReturnValue({
    ref: { current: null },
    bottomReached: false,
  }),
}));

describe('AccountMenu', () => {
  const mockOnClosed = jest.fn();
  const mockOnLogout = jest.fn();
  const mockPush = jest.fn();
  const mockOpenDialog = jest.fn();

  // Create a mock Membership with all required properties
  const mockMember: Membership = {
    forenames: 'John',
    surname: 'Doe',
    referenceNumber: '12345',
    status: 'active',
    dateJoinedScheme: '2020-01-01',
    age: 30,
    floorRoundedAge: 30,
    normalRetirementAge: 65,
    hasAdditionalContributions: false,
    category: 'standard',
    dateOfBirth: null,
    title: null,
    normalRetirementDate: null,
    datePensionableServiceCommenced: null,
    dateOfLeaving: null,
    transferInServiceYears: null,
    transferInServiceMonths: null,
    totalPensionableServiceYears: null,
    totalPensionableServiceMonths: null,
    finalPensionableSalary: null,
    schemeName: '',
    membershipNumber: null,
    insuranceNumber: null,
    payrollNumber: null,
    dateLeftScheme: null,
    datePensionableServiceStarted: null,
  };

  const mockAccountItem: MenuItem = {
    elements: {
      name: { value: 'Account' },
      position: { value: { selection: 'Account', label: 'Account' } },
      subMenuItems: {
        values: [
          {
            elements: {
              name: { value: 'Profile' },
              link: { value: '/profile' },
              icon: { value: 'person' },
              nestedItems: { values: [] },
              relatedLinks: { value: '' },
              buttonAsMenuItem: { value: { elements: {} } },
            },
            type: 'SubMenuItem',
          },
          {
            elements: {
              name: { value: 'Settings' },
              link: { value: '/settings' },
              icon: { value: 'settings' },
              nestedItems: { values: [] },
              relatedLinks: { value: '' },
              buttonAsMenuItem: { value: { elements: {} } },
            },
            type: 'SubMenuItem',
          },
          {
            elements: {
              name: { value: 'Dialog Item' },
              link: { value: '' },
              icon: { value: 'info' },
              nestedItems: { values: [] },
              relatedLinks: { value: '' },
              buttonAsMenuItem: { value: { elements: {} } },
              openDialog: { value: { elements: { dialogId: { value: 'test-dialog' } } } } as any,
            },
            type: 'SubMenuItem',
          },
        ],
      },
      orderNo: { value: 1 },
      link: { value: '' },
      relatedLinks: { value: '' },
    },
    type: 'MenuItem',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    jest.mocked(useDialogContext).mockReturnValue({
      openDialog: mockOpenDialog,
    } as any);
  });

  it('renders correctly when open', () => {
    render(
      <AccountMenu
        member={mockMember}
        open={true}
        anchorEl={document.createElement('div')}
        accountItem={mockAccountItem}
        onClosed={mockOnClosed}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByTestId('mock-account-menu-list')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <AccountMenu
        member={mockMember}
        open={false}
        anchorEl={document.createElement('div')}
        accountItem={mockAccountItem}
        onClosed={mockOnClosed}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.queryByTestId('mock-account-menu-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  it('navigates when menu item with link is clicked', async () => {
    render(
      <AccountMenu
        member={mockMember}
        open={true}
        anchorEl={document.createElement('div')}
        accountItem={mockAccountItem}
        onClosed={mockOnClosed}
        onLogout={mockOnLogout}
      />,
    );

    // Click the mock Profile button created by our mock component
    fireEvent.click(screen.getByTestId('menu-item-Profile'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
      expect(mockOnClosed).toHaveBeenCalled();
    });
  });

  it('opens dialog when menu item with openDialog is clicked', async () => {
    render(
      <AccountMenu
        member={mockMember}
        open={true}
        anchorEl={document.createElement('div')}
        accountItem={mockAccountItem}
        onClosed={mockOnClosed}
        onLogout={mockOnLogout}
      />,
    );

    // Click the mock Dialog Item button created by our mock component
    fireEvent.click(screen.getByTestId('menu-item-Dialog Item'));

    await waitFor(() => {
      expect(mockOpenDialog).toHaveBeenCalled();
      expect(mockOnClosed).toHaveBeenCalled();
    });
  });

  it('calls onLogout when logout button is clicked', () => {
    render(
      <AccountMenu
        member={mockMember}
        open={true}
        anchorEl={document.createElement('div')}
        accountItem={mockAccountItem}
        onClosed={mockOnClosed}
        onLogout={mockOnLogout}
      />,
    );

    fireEvent.click(screen.getByTestId('logout-button'));

    expect(mockOnClosed).toHaveBeenCalled();
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('renders without member information when member is null', () => {
    render(
      <AccountMenu
        member={null}
        open={true}
        anchorEl={document.createElement('div')}
        accountItem={mockAccountItem}
        onClosed={mockOnClosed}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.queryByText('member_number')).not.toBeInTheDocument();

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });
});
