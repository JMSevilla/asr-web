import { BackgroundConfigItem } from '../../../api/content/types/page';
import { PageBackground } from '../../../components/page/background/PageBackground';
import { render } from '../../common';

jest.mock('../../../components/page/background/hooks', () => ({
  usePageBackground: jest.fn().mockImplementation(config => {
    if (!config) return null;
    return {
      topColor: config.mockTopColor,
      baseColor: config.mockBaseColor,
      topColorOffset: config.mockTopColorOffset || '50%',
    };
  }),
}));

describe('PageBackground', () => {
  const mockConfig: BackgroundConfigItem = {
    mockTopColor: '#ff0000',
    mockBaseColor: '#00ff00',
    mockTopColorOffset: '200px',
  } as unknown as BackgroundConfigItem;

  it('should render with all background elements when config is provided', () => {
    const { container } = render(<PageBackground config={mockConfig} />);

    const backgroundElements = container.querySelectorAll('.MuiBox-root');
    expect(backgroundElements).toHaveLength(3);
  });

  it('should render with correct colors and positions', () => {
    const { container } = render(<PageBackground config={mockConfig} />);

    const backgroundElements = container.querySelectorAll('.MuiBox-root');

    expect(backgroundElements[0]).toHaveStyle({
      position: 'absolute',
      top: 0,
      height: '200px',
    });

    expect(backgroundElements[1]).toHaveStyle({
      position: 'absolute',
      top: 0,
      height: '200px',
      backgroundColor: '#ff0000',
    });

    expect(backgroundElements[2]).toHaveStyle({
      position: 'fixed',
      top: 0,
      backgroundColor: '#00ff00',
    });
  });

  it('should not render when usePageBackground returns null', () => {
    const emptyConfig = null as unknown as BackgroundConfigItem;
    const { container } = render(<PageBackground config={emptyConfig} />);

    const backgroundElements = container.querySelectorAll('.MuiBox-root');
    expect(backgroundElements).toHaveLength(0);
  });

  it('should render only baseColor when topColor is not provided', () => {
    const configWithoutTopColor = {
      mockTopColor: null,
      mockBaseColor: '#00ff00',
      mockTopColorOffset: '200px',
    } as unknown as BackgroundConfigItem;

    const { container } = render(<PageBackground config={configWithoutTopColor} />);

    const backgroundElements = container.querySelectorAll('.MuiBox-root');
    expect(backgroundElements).toHaveLength(1);

    expect(backgroundElements[0]).toHaveStyle({
      position: 'fixed',
      backgroundColor: '#00ff00',
    });
  });

  it('should render only topColor when baseColor is not provided', () => {
    const configWithoutBaseColor = {
      mockTopColor: '#ff0000',
      mockBaseColor: null,
      mockTopColorOffset: '200px',
    } as unknown as BackgroundConfigItem;

    const { container } = render(<PageBackground config={configWithoutBaseColor} />);

    const backgroundElements = container.querySelectorAll('.MuiBox-root');
    expect(backgroundElements).toHaveLength(2);

    expect(backgroundElements[0]).toHaveStyle({
      position: 'absolute',
      top: 0,
    });

    expect(backgroundElements[1]).toHaveStyle({
      position: 'absolute',
      top: 0,
      backgroundColor: '#ff0000',
    });
  });
});
