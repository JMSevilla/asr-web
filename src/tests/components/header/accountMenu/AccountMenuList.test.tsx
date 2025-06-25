import { MenuItem } from '../../../../api/content/types/menu';
import { AccountMenuList } from '../../../../components/header/accountMenu/AccountMenuList';
import { fireEvent, render, screen } from '../../../common';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEmptyElement(): R;
    }
  }
}

// Extend Jest matchers
expect.extend({
  toBeEmptyElement(received) {
    const pass = !received || received.children.length === 0;
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be an empty element`,
    };
  },
});

jest.mock('../../../../components/header/accountMenu/AccountMenuItem', () => ({
  AccountMenuItem: jest.fn(({ item, index, isOpen, onToggle, onItemClick }) => (
    <div data-testid={`menu-item-${index}`}>
      <span data-testid={`menu-item-name-${index}`}>{item.elements.name.value}</span>
      <span data-testid={`menu-item-open-${index}`}>{isOpen ? 'open' : 'closed'}</span>
      <button data-testid={`menu-item-toggle-${index}`} onClick={onToggle}>
        Toggle
      </button>
      <button data-testid={`menu-item-click-${index}`} onClick={() => onItemClick(item)}>
        Click
      </button>
    </div>
  )),
}));

describe('AccountMenuList', () => {
  const mockOnItemClick = jest.fn();

  const mockAccountItem: MenuItem = {
    elements: {
      name: { value: 'Account' },
      position: { value: { selection: 'Account', label: 'Account' } },
      subMenuItems: {
        values: [
          {
            elements: {
              name: { value: 'Menu Item 1' },
              link: { value: '/link1' },
              icon: { value: 'icon1' },
              nestedItems: { values: [] },
              relatedLinks: { value: '' },
              buttonAsMenuItem: { value: { elements: {} } },
            },
            type: 'SubMenuItem',
          },
          {
            elements: {
              name: { value: 'Menu Item 2' },
              link: { value: '/link2' },
              icon: { value: 'icon2' },
              nestedItems: { values: [] },
              relatedLinks: { value: '' },
              buttonAsMenuItem: { value: { elements: {} } },
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
  });

  it('renders menu items correctly', () => {
    render(<AccountMenuList accountItem={mockAccountItem} onItemClick={mockOnItemClick} />);

    expect(screen.getByTestId('account-menu-list')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item-name-0')).toHaveTextContent('Menu Item 1');
    expect(screen.getByTestId('menu-item-name-1')).toHaveTextContent('Menu Item 2');
  });

  it('sets isOpen prop correctly for menu items', () => {
    render(<AccountMenuList accountItem={mockAccountItem} onItemClick={mockOnItemClick} />);

    expect(screen.getByTestId('menu-item-open-0')).toHaveTextContent('closed');
    expect(screen.getByTestId('menu-item-open-1')).toHaveTextContent('closed');

    fireEvent.click(screen.getByTestId('menu-item-toggle-0'));

    expect(screen.getByTestId('menu-item-open-0')).toHaveTextContent('open');
    expect(screen.getByTestId('menu-item-open-1')).toHaveTextContent('closed');

    fireEvent.click(screen.getByTestId('menu-item-toggle-1'));

    expect(screen.getByTestId('menu-item-open-0')).toHaveTextContent('closed');
    expect(screen.getByTestId('menu-item-open-1')).toHaveTextContent('open');
  });

  it('calls onItemClick when menu item is clicked', () => {
    render(<AccountMenuList accountItem={mockAccountItem} onItemClick={mockOnItemClick} />);

    fireEvent.click(screen.getByTestId('menu-item-click-0'));

    expect(mockOnItemClick).toHaveBeenCalledWith(mockAccountItem.elements.subMenuItems?.values?.[0]);
  });

  it('renders nothing when accountItem is not provided', () => {
    const { container } = render(<AccountMenuList accountItem={undefined} onItemClick={mockOnItemClick} />);

    expect(container.firstChild).toBeEmptyElement();
  });
});
