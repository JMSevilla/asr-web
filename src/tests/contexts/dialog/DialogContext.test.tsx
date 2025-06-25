import '@testing-library/jest-dom/extend-expect';
import { DialogContextProvider, useDialogContext } from '../../../core/contexts/dialog/DialogContext';
import { act, fireEvent, render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

// Create a mockRouter object that we can update
const mockRouter = {
  loading: false,
  parsing: false,
  push: jest.fn(),
  parseUrlAndPush: jest.fn(),
  asPath: '/test-path',
};

jest.mock('../../../core/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: () => ({
    membership: null,
  }),
}));
jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
  }),
}));
jest.mock('../../../core/genesys', () => ({
  isWebChatActive: jest.fn().mockReturnValue(false),
}));

const TestConsumer = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialogContext();
  return (
    <div>
      <button onClick={() => openDialog({})}>Open Dialog</button>
      <button onClick={() => closeDialog()}>Close Dialog</button>
      {isDialogOpen && <span>Dialog is open</span>}
    </div>
  );
};

describe('DialogContextProvider', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <DialogContextProvider>
          <>Test Child</>
        </DialogContextProvider>,
      );
    });
  });

  it('provides context values', async () => {
    await act(async () => {
      render(
        <DialogContextProvider>
          <TestConsumer />
        </DialogContextProvider>,
      );
    });

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens and closes the dialog', async () => {
    await act(async () => {
      render(
        <DialogContextProvider>
          <TestConsumer />
        </DialogContextProvider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Open Dialog'));
    });
    expect(screen.getByText('Dialog is open')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('Close Dialog'));
    });
    expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
  });

  it('handles close correctly', async () => {
    await act(async () => {
      render(
        <DialogContextProvider>
          <TestConsumer />
        </DialogContextProvider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Open Dialog'));
    });
    expect(screen.getByText('Dialog is open')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('Close Dialog'));
    });
    expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
  });

  it('handles open correctly', async () => {
    await act(async () => {
      render(
        <DialogContextProvider>
          <TestConsumer />
        </DialogContextProvider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Open Dialog'));
    });
    expect(screen.getByText('Dialog is open')).toBeInTheDocument();
  });

  describe('dialogOnLoad functionality', () => {
    const mockDialogElement = {
      value: {
        elements: {
          header: { value: 'Test Header' },
          text: { value: 'Test Content' },
          panel: {
            value: {
              elements: {
                columns: {},
              },
            },
          },
        },
        type: 'Dialog' as const,
      },
    };

    beforeEach(() => {
      mockRouter.asPath = '/test-path';
    });

    it('opens dialog automatically when dialogOnLoad is provided', async () => {
      await act(async () => {
        render(
          <DialogContextProvider dialogOnLoad={mockDialogElement}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();
    });

    it('does not open dialog when dialogOnLoad has no elements', async () => {
      const emptyDialogElement = {
        value: {
          type: 'Dialog' as const,
        },
      };

      await act(async () => {
        render(
          <DialogContextProvider dialogOnLoad={emptyDialogElement}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
    });

    it('updates dialog when dialogOnLoad changes', async () => {
      const { rerender } = render(
        <DialogContextProvider>
          <TestConsumer />
        </DialogContextProvider>,
      );

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();

      await act(async () => {
        rerender(
          <DialogContextProvider dialogOnLoad={mockDialogElement}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();
    });

    it('closes dialog when dialogOnLoad is set to undefined', async () => {
      const { rerender } = render(
        <DialogContextProvider dialogOnLoad={mockDialogElement}>
          <TestConsumer />
        </DialogContextProvider>,
      );

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();

      await act(async () => {
        rerender(
          <DialogContextProvider dialogOnLoad={undefined}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
    });

    it('triggers handleClose on router path change', async () => {
      const initialPath = mockRouter.asPath;

      const { rerender } = render(
        <DialogContextProvider dialogOnLoad={mockDialogElement}>
          <TestConsumer />
        </DialogContextProvider>,
      );

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();

      mockRouter.asPath = '/new-path';

      await act(async () => {
        rerender(
          <DialogContextProvider dialogOnLoad={mockDialogElement}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();

      mockRouter.asPath = initialPath;
    });

    it('opens dialog with customOnClose handler', async () => {
      const customOnCloseMock = jest.fn();
      const dialogWithCustomClose = {
        ...mockDialogElement,
        customOnClose: customOnCloseMock,
      };

      await act(async () => {
        render(
          <DialogContextProvider dialogOnLoad={dialogWithCustomClose}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByText('Close Dialog'));
      });

      expect(customOnCloseMock).toHaveBeenCalled();
      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
    });
  });

  describe('loading state functionality', () => {
    const mockDialogElement = {
      value: {
        elements: {
          header: { value: 'Test Header' },
          text: { value: 'Test Content' },
          panel: {
            value: {
              elements: {
                columns: {},
              },
            },
          },
        },
        type: 'Dialog' as const,
      },
    };

    it('closes dialog when loading prop is true', async () => {
      const { rerender } = render(
        <DialogContextProvider dialogOnLoad={mockDialogElement}>
          <TestConsumer />
        </DialogContextProvider>,
      );

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();

      await act(async () => {
        rerender(
          <DialogContextProvider dialogOnLoad={mockDialogElement} loading={true}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
    });

    it('keeps dialog closed when loading is true even if dialogOnLoad is provided', async () => {
      await act(async () => {
        render(
          <DialogContextProvider dialogOnLoad={mockDialogElement} loading={true}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
    });

    it('reopens dialog when loading changes from true to false with dialogOnLoad', async () => {
      const { rerender } = render(
        <DialogContextProvider dialogOnLoad={mockDialogElement} loading={true}>
          <TestConsumer />
        </DialogContextProvider>,
      );

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();

      await act(async () => {
        rerender(
          <DialogContextProvider dialogOnLoad={mockDialogElement} loading={false}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();
    });

    it('handles forced close correctly when manually opening dialog then setting loading', async () => {
      const { rerender } = render(
        <DialogContextProvider>
          <TestConsumer />
        </DialogContextProvider>,
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Open Dialog'));
      });
      expect(screen.getByText('Dialog is open')).toBeInTheDocument();

      await act(async () => {
        rerender(
          <DialogContextProvider loading={true}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      expect(screen.queryByText('Dialog is open')).not.toBeInTheDocument();
    });

    it('prevents opening dialog with custom function when loading is true', async () => {
      const { rerender } = render(
        <DialogContextProvider loading={true}>
          <TestConsumer />
        </DialogContextProvider>,
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Open Dialog'));
      });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await act(async () => {
        rerender(
          <DialogContextProvider loading={false}>
            <TestConsumer />
          </DialogContextProvider>,
        );
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Open Dialog'));
      });

      expect(screen.getByText('Dialog is open')).toBeInTheDocument();
    });
  });
});
