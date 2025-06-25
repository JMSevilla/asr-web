import { ComponentProps } from 'react';
import { PageMenuBlock } from '../../../components/blocks/pageMenu/PageMenuBlock';
import { useResolution } from '../../../core/hooks/useResolution';
import { render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof PageMenuBlock> = {
  id: 'page-menu',
  items: [
    { key: { value: 'item1' }, value: { value: 'item1' } },
    { key: { value: 'item2' }, value: { value: 'item2' } },
  ],
};

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ asPath: '' }),
}));

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn().mockReturnValue({ isMobile: false }),
}));

describe('PageMenuBlock', () => {
  it('should render correct amount of items', () => {
    render(<PageMenuBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('page-menu').children.length).toBe(2);
  });

  it('should render menu button for mobile resolution', () => {
    jest.mocked(useResolution).mockReturnValueOnce({ isMobile: true, isSmallMobile: true });
    render(<PageMenuBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('page-menu-button')).toBeInTheDocument();
  });

  it('should not render anything when there are 0 items', () => {
    render(<PageMenuBlock {...DEFAULT_PROPS} items={[]} />);
    expect(screen.queryByTestId('page-menu')).toBeNull();
    expect(screen.queryByTestId('page-menu-button')).toBeNull();
  });
});
