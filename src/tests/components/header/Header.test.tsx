import { Membership } from '../../../api/mdp/types';
import { Header } from '../../../components';
import { useAuthContext } from '../../../core/contexts/auth/AuthContext';
import { useDialogContext } from '../../../core/contexts/dialog/DialogContext';
import { useRouter } from '../../../core/router';
import { act, fireEvent, render, screen, waitFor } from '../../common';

const DEFAULT_USER: Membership = {
  forenames: 'name',
  surname: 'surname',
  status: 'active',
  referenceNumber: 'refNumber',
  age: 100,
  dateOfBirth: null,
  title: null,
  normalRetirementAge: 80,
  floorRoundedAge: 80,
  normalRetirementDate: null,
  datePensionableServiceCommenced: null,
  dateOfLeaving: null,
  transferInServiceYears: null,
  transferInServiceMonths: null,
  totalPensionableServiceYears: null,
  totalPensionableServiceMonths: null,
  finalPensionableSalary: null,
  schemeName: 'scheme',
  membershipNumber: null,
  insuranceNumber: null,
  payrollNumber: null,
  dateJoinedScheme: null,
  dateLeftScheme: null,
  hasAdditionalContributions: false,
  category: 'category',
  datePensionableServiceStarted: null,
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: DEFAULT_USER }, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    result: { data: null },
    loading: false,
    execute: () => Promise.resolve({ result: { data: null } }),
  }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '', staticRoutes: { hub: '/hub', home: '/home' } }),
}));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({ useAuthContext: jest.fn() }));

jest.mock('../../../core/contexts/tasks/TaskListContext', () => ({
  useTaskListContext: jest.fn().mockReturnValue({
    incompleteTasks: [],
    showTaskListBell: false,
    taskListDisplayValues: {},
    loading: false,
  }),
}));

jest.mock('../../../core/contexts/dialog/DialogContext', () => ({
  useDialogContext: jest.fn().mockReturnValue({ openDialog: jest.fn() }),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({}),
}));

describe('Header', () => {
  const mockFn = jest.fn();

  it('shows authenticated parts for authenticated users', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);
    render(<Header tenant={null} menuData={{ value: [] }} onLogout={mockFn} membershipData={DEFAULT_USER} />);

    expect(screen.queryAllByText(`${DEFAULT_USER.forenames?.[0]} ${DEFAULT_USER.surname?.[0]}`)).toBeTruthy();
  });

  it('opens menu for authenticated users', async () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);
    render(<Header tenant={null} menuData={{ value: [] }} onLogout={mockFn} membershipData={DEFAULT_USER} />);
    const accountMenuButton = screen.queryByTestId('account-menu-button');
    accountMenuButton && fireEvent.click(accountMenuButton);

    await waitFor(() => {
      expect(screen.queryByTestId('logout-button')).toBeTruthy();
    });
  });

  it('logs user out', async () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true } as any);
    const logoutFn = jest.fn();
    render(<Header tenant={null} menuData={{ value: [] }} onLogout={logoutFn} membershipData={DEFAULT_USER} />);
    const accountMenuButton = screen.queryByTestId('account-menu-button');
    accountMenuButton && fireEvent.click(accountMenuButton);
    const logoutButton = screen.queryByTestId('logout-button');
    logoutButton && fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(logoutFn).toBeCalled();
    });
  });

  it('hides authenticated parts from unauthenticated users', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false } as any);
    render(<Header tenant={null} menuData={{ value: [] }} onLogout={mockFn} membershipData={null} />);
    expect(screen.queryByTestId('account-menu-button')).toBeFalsy();
  });

  it('renders navigation menu items with correct links when menu is provided', async () => {
    const push = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ push, staticRoutes: {}, asPath: 'path' } as any);
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false } as any);
    render(
      <Header
        tenant={null}
        membershipData={null}
        menuData={{
          value: [
            {
              elements: {
                name: { value: 'test-item' },
                link: { value: 'test' },
                position: { value: { selection: 'Left', label: 'Left' } },
                orderNo: { value: 1 },
                relatedLinks: { value: 'test' },
              },
              type: 'NavigationMenuItem',
            },
            {
              elements: {
                name: { value: 'test-item-2' },
                link: { value: 'https://test' },
                position: { value: { selection: 'Right', label: 'Right' } },
                orderNo: { value: 1 },
                relatedLinks: { value: 'test2' },
              },
              type: 'NavigationMenuItem',
            },
          ],
        }}
        onLogout={mockFn}
      />,
    );

    const item1 = screen.queryByText('test-item');
    const item2 = screen.queryByText('test-item-2');

    expect(item1).toBeTruthy();
    expect(item2).toBeTruthy();

    await act(async () => {
      item1 && fireEvent.click(item1);
    });

    expect(push).toBeCalledWith('/test');

    await act(async () => {
      item2 && fireEvent.click(item2);
    });

    expect(push).toBeCalledWith('https://test');
  });

  it('opens modal when clicking on logo and logo_dialog is present', async () => {
    const openDialog = jest.fn();
    jest.mocked(useDialogContext).mockReturnValue({ openDialog } as any);
    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={null}
      />,
      undefined,
      {
        dialogs: [{ elements: { dialogKey: { value: 'logo_dialog' } } } as any],
      },
    );
    const logo = screen.queryByTestId('header_logo_button');
    await act(async () => {
      logo && fireEvent.click(logo);
    });

    expect(openDialog).toBeCalled();
  });

  it('opens modal when clicking on cobranding logo and logo_dialog is present', async () => {
    const openDialog = jest.fn();
    jest.mocked(useDialogContext).mockReturnValue({ openDialog } as any);
    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={null}
      />,
      undefined,
      {
        dialogs: [{ elements: { dialogKey: { value: 'logo_dialog' } } } as any],
      },
    );
    const logo = screen.queryByTestId('cobranding_logo_button');
    await act(async () => {
      logo && fireEvent.click(logo);
    });

    expect(openDialog).toBeCalled();
  });

  it('hides navigation and account menu when hideNavigation is true', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true, isSingleAuth: true } as any);
    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={DEFAULT_USER}
        hideNavigation={true}
      />,
    );

    expect(screen.queryByTestId('account-menu-button')).toBeFalsy();
  });

  it('hides navigation and account menu when user is in single auth and not authenticated', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false, isSingleAuth: true } as any);
    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={null}
      />,
    );

    expect(screen.queryByTestId('account-menu-button')).toBeFalsy();
  });

  it('shows navigation and hides account menu when user is in not in single auth and not authenticated', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false, isSingleAuth: false } as any);
    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={null}
      />,
    );

    expect(screen.queryByTestId('account-menu-button')).toBeFalsy();
  });

  it('shows navigation when user is authenticated and not in single auth', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true, isSingleAuth: false } as any);
    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={DEFAULT_USER}
      />,
    );

    expect(screen.queryByTestId('account-menu-button')).toBeTruthy();
  });

  it('shows navigation when user is authenticated and in single auth', async () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: true, isSingleAuth: true } as any);

    render(
      <Header
        tenant={{ headerText: { value: '' } } as any}
        menuData={{ value: [] }}
        onLogout={mockFn}
        membershipData={DEFAULT_USER}
      />,
    );

    expect(screen.queryByTestId('account-menu-button')).toBeTruthy();
  });
});
