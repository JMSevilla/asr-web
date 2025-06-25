import { DialogBox } from '../../components';
import { act, render, screen } from '../common';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

describe('DialogBox', () => {
  it('should render dialog box ', () => {
    const closeHandler = jest.fn();
    act(() => {
      render(
        <DialogBox
          loading={false}
          header="header_title"
          open={true}
          handleClose={closeHandler}
          data-testid="dialog-box"
        />,
      );
    });
    expect(screen.getByTestId('dialog-box')).toBeTruthy();
    expect(screen.getByTestId('CloseIcon')).toBeTruthy();
    expect(screen.getByText('header_title')).toBeTruthy();
  });
  it('should hide dialog box close button', () => {
    const closeHandler = jest.fn();
    act(() => {
      render(
        <DialogBox
          loading={false}
          header="header_title"
          open={true}
          handleClose={closeHandler}
          data-testid="dialog-box"
          hideCloseButton={true}
        />,
      );
    });
    console.debug();
    expect(screen.getByTestId('dialog-box')).toBeTruthy();
    expect(screen.queryByTestId('CloseIcon')).not.toBeInTheDocument();
  });
});
