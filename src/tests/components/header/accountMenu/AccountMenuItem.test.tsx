import { SubMenuItem } from '../../../../api/content/types/menu';
import { AccountMenuItem } from '../../../../components/header/accountMenu/AccountMenuItem';
import { fireEvent, render, screen } from '../../../common';

jest.mock('eva-icons', () => ({
  ...jest.requireActual('eva-icons'),
  replace: jest.fn(),
}));

// Suppress JSDOM navigation errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.toString().includes('Error: Not implemented: navigation')) {
    return;
  }
  originalConsoleError(...args);
};

describe('AccountMenuItem', () => {
  const mockOnItemClick = jest.fn();
  const mockOnToggle = jest.fn();

  const mockItem: SubMenuItem = {
    elements: {
      name: { value: 'Test Item' },
      link: { value: '/test-link' },
      icon: { value: 'test-icon' },
      nestedItems: {
        values: [],
      },
      relatedLinks: { value: '' },
      buttonAsMenuItem: { value: { elements: {} } },
    },
    type: 'SubMenuItem',
  };

  const mockItemWithNestedItems: SubMenuItem = {
    elements: {
      name: { value: 'Parent Item' },
      link: { value: '/parent-link' },
      icon: { value: 'parent-icon' },
      nestedItems: {
        values: [
          {
            elements: {
              name: { value: 'Nested Item' },
              link: { value: '/nested-link' },
              icon: { value: 'nested-icon' },
              nestedItems: {
                values: [],
              },
              relatedLinks: { value: '' },
              buttonAsMenuItem: { value: { elements: {} } },
            },
            type: 'SubMenuItem',
          },
        ],
      },
      relatedLinks: { value: '' },
      buttonAsMenuItem: { value: { elements: {} } },
    },
    type: 'SubMenuItem',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with basic props', () => {
    render(<AccountMenuItem item={mockItem} index={0} onItemClick={mockOnItemClick} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByTestId('account-menu-item-0')).toBeInTheDocument();
  });

  it('calls onItemClick when clicked', () => {
    render(<AccountMenuItem item={mockItem} index={0} onItemClick={mockOnItemClick} />);

    fireEvent.click(screen.getByText('Test Item'));
    expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
  });

  it('calls onItemClick when Enter key is pressed', () => {
    render(<AccountMenuItem item={mockItem} index={0} onItemClick={mockOnItemClick} />);

    fireEvent.keyDown(screen.getByText('Test Item').closest('[tabindex="0"]')!, { code: 'Enter' });
    expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
  });

  it('calls onToggle when item with nested items is clicked', () => {
    render(
      <AccountMenuItem
        item={mockItemWithNestedItems}
        index={0}
        onItemClick={mockOnItemClick}
        onToggle={mockOnToggle}
      />,
    );

    fireEvent.click(screen.getByText('Parent Item'));
    expect(mockOnToggle).toHaveBeenCalled();
    expect(mockOnItemClick).not.toHaveBeenCalled();
  });

  it('renders nested items when isOpen is true', () => {
    render(
      <AccountMenuItem
        item={mockItemWithNestedItems}
        index={0}
        onItemClick={mockOnItemClick}
        onToggle={mockOnToggle}
        isOpen={true}
      />,
    );

    expect(screen.getByText('Nested Item')).toBeInTheDocument();
  });

  it('doesnt render nested items when isOpen is false', () => {
    render(
      <AccountMenuItem
        item={mockItemWithNestedItems}
        index={0}
        onItemClick={mockOnItemClick}
        onToggle={mockOnToggle}
        isOpen={false}
      />,
    );

    expect(screen.queryByText('Nested Item')).not.toBeInTheDocument();
  });

  it('renders with nested prop correctly', () => {
    render(<AccountMenuItem item={mockItem} index={0} onItemClick={mockOnItemClick} nested />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
});
