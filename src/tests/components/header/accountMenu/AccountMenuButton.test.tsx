import { AccountMenuButton } from '../../../../components/header/accountMenu/AccountMenuButton';
import { fireEvent, render, screen } from '../../../common';

describe('AccountMenuButton', () => {
  const mockOnClicked = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with user initials', () => {
    render(<AccountMenuButton open={false} userInitials="AB" onClicked={mockOnClicked} />);

    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.getByTestId('account-menu-button')).toBeInTheDocument();
  });

  it('calls onClicked when button is clicked', () => {
    render(<AccountMenuButton open={false} userInitials="AB" onClicked={mockOnClicked} />);

    fireEvent.click(screen.getByTestId('account-menu-button'));
    expect(mockOnClicked).toHaveBeenCalledTimes(1);
  });

  it('sets aria-expanded attribute based on open prop', () => {
    const { rerender } = render(<AccountMenuButton open={false} userInitials="AB" onClicked={mockOnClicked} />);

    const button = screen.getByTestId('account-menu-button');
    expect(button).not.toHaveAttribute('aria-expanded');

    rerender(<AccountMenuButton open={true} userInitials="AB" onClicked={mockOnClicked} />);

    expect(screen.getByTestId('account-menu-button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-controls attribute when open is true', () => {
    const { rerender } = render(<AccountMenuButton open={false} userInitials="AB" onClicked={mockOnClicked} />);

    expect(screen.getByTestId('account-menu-button')).not.toHaveAttribute('aria-controls', 'account-menu');

    rerender(<AccountMenuButton open={true} userInitials="AB" onClicked={mockOnClicked} />);

    expect(screen.getByTestId('account-menu-button')).toHaveAttribute('aria-controls', 'account-menu');
  });
});
