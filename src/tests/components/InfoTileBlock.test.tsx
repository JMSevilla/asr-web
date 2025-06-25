import { doesAccessKeyHaveWordingFlag } from '../../business/access-key';
import { InfoTileBlock } from '../../components/blocks/InfoTileBlock';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useDataReplacerApi } from '../../core/hooks/useDataReplacerApi';
import { render, screen } from '../common';

jest.mock('eva-icons', () => ({ replace: jest.fn() }));

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/hooks/useDataReplacerApi', () => ({
  useDataReplacerApi: jest
    .fn()
    .mockReturnValue({ loading: false, replaceDataInText: (text: string) => text, elementProps: jest.fn() }),
}));

jest.mock('../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn(),
}));

jest.mock('../../business/access-key', () => ({
  doesAccessKeyHaveWordingFlag: jest.fn(),
}));

const DEFAULT_PROPS: React.ComponentProps<typeof InfoTileBlock> = {
  id: 'id',
  data: 'data',
  iconName: 'iconName',
  tileKey: 'tileKey',
  title: 'title',
  sourceUrl: 'test-source-url',
};

const mockUseCachedAccessKey = useCachedAccessKey as jest.Mock;
const mockDoesAccessKeyHaveWordingFlag = doesAccessKeyHaveWordingFlag as jest.Mock;
const mockUseDataReplacerApi = useDataReplacerApi as jest.Mock;

describe('InfoTileBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    mockUseCachedAccessKey.mockReturnValue({
      data: { contentAccessKey: '{"wordingFlags":[]}' },
    });

    mockDoesAccessKeyHaveWordingFlag.mockReturnValue(true);

    mockUseDataReplacerApi.mockReturnValue({
      loading: false,
      replaceDataInText: (text: string) => text,
      elementProps: jest.fn(),
    });
  });

  it('renders component with correct test id', () => {
    render(<InfoTileBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('info-tile-block')).toBeTruthy();
  });

  it('correctly displays title and data', () => {
    render(<InfoTileBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('info-tile-title')?.innerHTML).toContain(DEFAULT_PROPS.title);
    expect(screen.queryByTestId('info-tile-value')?.innerHTML).toBe(DEFAULT_PROPS.data);
  });

  it('displays icon when iconName is provided', () => {
    render(<InfoTileBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId(DEFAULT_PROPS.iconName!)).toBeInTheDocument();
  });

  it('does not display icon when iconName is not provided', () => {
    const propsWithoutIcon = { ...DEFAULT_PROPS, iconName: undefined };
    render(<InfoTileBlock {...propsWithoutIcon} />);
    expect(screen.queryByTestId('iconName')).not.toBeInTheDocument();
  });

  it('displays loader when replacing data', () => {
    mockUseDataReplacerApi.mockReturnValue({
      loading: true,
      replaceDataInText: (text: string) => text,
      elementProps: jest.fn(),
    });
    render(<InfoTileBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('info-tile-value')).not.toBeInTheDocument();
    expect(screen.queryByTestId('info-tile-loader')).toBeInTheDocument();
  });

  it('uses tileKey as id when both are provided', () => {
    render(<InfoTileBlock {...DEFAULT_PROPS} />);
    const component = screen.queryByTestId('info-tile-block');
    expect(component).toHaveAttribute('id', DEFAULT_PROPS.tileKey);
  });

  it('uses id as fallback when tileKey is not provided', () => {
    const propsWithoutTileKey = { ...DEFAULT_PROPS, tileKey: undefined };
    render(<InfoTileBlock {...propsWithoutTileKey} />);
    const component = screen.queryByTestId('info-tile-block');
    expect(component).toHaveAttribute('id', DEFAULT_PROPS.id);
  });

  it('applies custom backgroundColor when provided', () => {
    const customBackgroundColor = 'red';
    const propsWithCustomBg = { ...DEFAULT_PROPS, backgroundColor: customBackgroundColor };
    render(<InfoTileBlock {...propsWithCustomBg} />);
    // Component should render without crashing with custom background
    expect(screen.queryByTestId('info-tile-block')).toBeTruthy();
  });

  it('does not render background boxes when backgroundColor is transparent', () => {
    const propsWithTransparentBg = { ...DEFAULT_PROPS, backgroundColor: 'transparent' };
    render(<InfoTileBlock {...propsWithTransparentBg} />);
    expect(screen.queryByTestId('info-tile-block')).toBeTruthy();
  });

  it('applies custom elementsColor when provided', () => {
    const customElementsColor = 'blue';
    const propsWithCustomColor = { ...DEFAULT_PROPS, elementsColor: customElementsColor };
    render(<InfoTileBlock {...propsWithCustomColor} />);
    expect(screen.queryByTestId('info-tile-block')).toBeTruthy();
  });

  it('calls useDataReplacerApi with sourceUrl', () => {
    render(<InfoTileBlock {...DEFAULT_PROPS} />);
    expect(mockUseDataReplacerApi).toHaveBeenCalledWith(DEFAULT_PROPS.sourceUrl);
  });

  it('displays tooltip when tooltip prop is provided', () => {
    const propsWithTooltip = {
      ...DEFAULT_PROPS,
      tooltip: {
        description: 'Test tooltip description',
        id: 'test-tooltip-id',
        name: 'test-tooltip-name',
        status: 'active',
        type: 'tooltip',
        elements: {
          accessGroups: { value: 'all' },
          headerText: { value: 'Header' },
          contentText: { value: 'Content' },
          linkText: { value: '' },
          tooltipKey: { value: 'test-key' },
        },
      },
    };
    render(<InfoTileBlock {...propsWithTooltip} />);
    // Component should render without crashing with tooltip
    expect(screen.queryByTestId('info-tile-block')).toBeTruthy();
  });

  describe('Data replacement', () => {
    it('calls replaceDataInText for title', () => {
      const mockReplaceDataInText = jest.fn().mockReturnValue('replaced title');
      mockUseDataReplacerApi.mockReturnValue({
        loading: false,
        replaceDataInText: mockReplaceDataInText,
        elementProps: jest.fn(),
      });

      render(<InfoTileBlock {...DEFAULT_PROPS} />);

      expect(mockReplaceDataInText).toHaveBeenCalledWith(DEFAULT_PROPS.title);
    });

    it('calls replaceDataInText for data when not loading', () => {
      const mockReplaceDataInText = jest.fn().mockReturnValue('replaced data');
      mockUseDataReplacerApi.mockReturnValue({
        loading: false,
        replaceDataInText: mockReplaceDataInText,
        elementProps: jest.fn(),
      });

      render(<InfoTileBlock {...DEFAULT_PROPS} />);

      expect(mockReplaceDataInText).toHaveBeenCalledWith(DEFAULT_PROPS.data);
    });

    it('does not call replaceDataInText for data when loading', () => {
      const mockReplaceDataInText = jest.fn();
      mockUseDataReplacerApi.mockReturnValue({
        loading: true,
        replaceDataInText: mockReplaceDataInText,
        elementProps: jest.fn(),
      });

      render(<InfoTileBlock {...DEFAULT_PROPS} />);

      // Should be called for title but not for data when loading
      expect(mockReplaceDataInText).toHaveBeenCalledWith(DEFAULT_PROPS.title);
      expect(mockReplaceDataInText).not.toHaveBeenCalledWith(DEFAULT_PROPS.data);
    });
  });
});
