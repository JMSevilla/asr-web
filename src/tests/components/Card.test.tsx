import { ParsedButtonProps } from '../../cms/parse-cms';
import { Card } from '../../components/Card';
import { render, screen } from '../common';

const BUTTON: ParsedButtonProps = {
  key: 'string',
  linkKey: 'string',
  anchor: '',
  link: 'string',
  type: 'Primary',
  text: 'string',
  icon: undefined,
  iconName: undefined,
  rightSideIcon: undefined,
  journeyType: 'transfer2',
  openInTheNewTab: undefined,
  widthPercentage: undefined,
  customActionKey: undefined,
  notification: undefined,
  disabledReason: undefined,
  dialogElement: undefined,
  fileUrl: '',
  reuseUrlParameters: undefined,
  analyticsKey: undefined,
  fastForwardComparisonPageKey: undefined,
  fastForwardRedirectPageKey: undefined,
  postRequestUrl: undefined,
  largeIcon: undefined,
  disabled: undefined,
};

const DEFAULT_PROPS: React.ComponentProps<typeof Card> = {
  id: 'card',
  pageKey: 'pageKey',
  title: 'text',
  caption: 'caption',
  html: '<p>html</p>',
  titleIcon: undefined,
  button: BUTTON,
  disabledButton: false,
};

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ transfer: {} }),
}));

jest.mock('../../core/contexts/contentData/ContentDataContext', () => ({
  useContentDataContext: jest.fn().mockReturnValue({
    page: null,
  }),
}));

jest.mock('../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    data: null,
    error: false,
  }),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../core/hooks/useDataSource', () => ({
  useDataSource: jest.fn().mockReturnValue({
    dataSource: { result: null },
    isLoading: false,
    isError: false,
    isSuccess: false,
    isEmpty: true,
  }),
}));

jest.mock('../../components/blocks/beneficiariesList/BeneficiariesListLoader', () => ({
  BeneficiariesListLoader: jest.fn(() => <div data-testid="beneficiaries-list-loader" />),
}));

jest.mock('../../components/blocks/chart/ChartLoader', () => ({
  ChartLoader: jest.fn(() => <div data-testid="chart-loader" />),
}));

jest.mock('../../components/blocks/chart/ChartBlock', () => ({
  ChartBlock: jest.fn(() => <div data-testid="chart-block" />),
}));

jest.mock('../../components/blocks/PanelBlock', () => ({
  PanelBlock: jest.fn(() => <div data-testid="panel-block" />),
}));

jest.mock('../../components/ParsedHtml', () => ({
  ParsedHtml: jest.fn(({ html }) => <div data-testid="parsed-html">{html}</div>),
}));

jest.mock('../../core/hooks/useCmsAsset', () => ({
  useCachedCmsAsset: jest.fn(url => (url ? 'cached-image-url' : undefined)),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img data-testid="card-image" src={props.src} alt={props.alt} />,
}));

describe('Card', () => {
  it('renders card component', () => {
    render(<Card {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('card')).toBeTruthy();
  });

  it('renders card component title with content', () => {
    render(<Card {...DEFAULT_PROPS} />);
    expect(screen.queryByText('text')).toBeInTheDocument();

    const parsedHtml = screen.getByTestId('parsed-html');
    expect(parsedHtml).toBeInTheDocument();
    expect(parsedHtml).toHaveTextContent('<p>html</p>');
  });

  it('renders card component button', () => {
    render(<Card {...DEFAULT_PROPS} />);
    expect(screen.queryByText('string')).toBeInTheDocument();
  });

  it('renders BeneficiariesListLoader when content is beneficiaries_list and data is loading', () => {
    const useDataSourceMock = require('../../core/hooks/useDataSource').useDataSource;
    useDataSourceMock.mockReturnValue({
      dataSource: { result: null },
      isLoading: true,
      isError: false,
      isSuccess: false,
      isEmpty: false,
    });

    const props = {
      ...DEFAULT_PROPS,
      content: {
        type: 'content',
        name: 'Beneficiaries List',
        elements: {
          formKey: { value: 'beneficiaries_list' },
        },
      },
      sourceUrl: 'test-url',
    };

    render(<Card {...props} />);
    expect(screen.getByTestId('beneficiaries-list-loader')).toBeInTheDocument();
  });

  it('renders image when image URL is provided', () => {
    const props = {
      ...DEFAULT_PROPS,
      image: {
        url: 'test-image-url',
        asset: {
          altText: 'Image alt text',
          fileName: 'image.jpg',
          fileSize: 1024,
          id: 'image-id',
          mediaType: 'image/jpeg',
          resourceUri: '/uri',
        },
        elementType: 'file',
      },
    };

    render(<Card {...props} />);
    const image = screen.getByTestId('card-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'cached-image-url');
    expect(image).toHaveAttribute('alt', 'Image alt text');
  });

  it('renders error content when dataSource has error', () => {
    const useDataSourceMock = require('../../core/hooks/useDataSource').useDataSource;
    useDataSourceMock.mockReturnValue({
      dataSource: { result: null },
      isLoading: false,
      isError: true,
      isSuccess: false,
      isEmpty: false,
    });

    const props = {
      ...DEFAULT_PROPS,
      sourceUrl: 'test-url',
      errorContent: '<p>Error occurred</p>',
    };

    render(<Card {...props} />);
    expect(screen.getByTestId('parsed-html')).toBeInTheDocument();
    expect(screen.getByText('<p>Error occurred</p>')).toBeInTheDocument();
  });

  it('renders HTML content when dataSource is empty', () => {
    const useDataSourceMock = require('../../core/hooks/useDataSource').useDataSource;
    useDataSourceMock.mockReturnValue({
      dataSource: { result: null },
      isLoading: false,
      isError: false,
      isSuccess: false,
      isEmpty: true,
    });

    const props = {
      ...DEFAULT_PROPS,
      sourceUrl: 'test-url',
      html: '<p>Empty state content</p>',
    };

    render(<Card {...props} />);
    expect(screen.getByTestId('parsed-html')).toBeInTheDocument();
    expect(screen.getByText('<p>Empty state content</p>')).toBeInTheDocument();
  });

  it('renders panel block when dataSource is successful and panel is provided', () => {
    const useDataSourceMock = require('../../core/hooks/useDataSource').useDataSource;
    useDataSourceMock.mockReturnValue({
      dataSource: { result: { status: 200 } },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isEmpty: false,
    });

    const useContentDataContextMock =
      require('../../core/contexts/contentData/ContentDataContext').useContentDataContext;
    useContentDataContextMock.mockReturnValue({
      page: { key: 'test-page' },
    });

    const props = {
      ...DEFAULT_PROPS,
      sourceUrl: 'test-url',
      panel: {
        elements: {
          header: { value: 'Panel Header' },
          columns: { values: [] },
          layout: {
            value: {
              label: '50/50' as const,
              selection: '50/50' as const,
            },
          },
          panelKey: { value: 'test-panel' },
        },
      },
    };

    render(<Card {...props} />);
    expect(screen.getByTestId('panel-block')).toBeInTheDocument();
  });

  it('renders chart block when dataSource is successful and chart is provided', () => {
    const useDataSourceMock = require('../../core/hooks/useDataSource').useDataSource;
    useDataSourceMock.mockReturnValue({
      dataSource: { result: { status: 200, data: { chartData: [] } } },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isEmpty: false,
    });

    const props = {
      ...DEFAULT_PROPS,
      sourceUrl: 'test-url',
      chart: {
        chartKey: { value: 'test-chart' },
        type: {
          value: {
            label: 'bar',
            selection: 'bar',
          },
        },
        xAxisName: { value: 'X Axis' },
        yAxisName: { value: 'Y Axis' },
        dataSourceUrl: { value: 'chart-data-url' },
        hideLegend: { value: false },
        showDataItems: { value: 5 },
      },
    };

    render(<Card {...props} />);
    expect(screen.getByTestId('chart-block')).toBeInTheDocument();
  });

  it('renders chart loader when dataSource is loading and sourceUrl is provided', () => {
    const useDataSourceMock = require('../../core/hooks/useDataSource').useDataSource;
    useDataSourceMock.mockReturnValue({
      dataSource: { result: null },
      isLoading: true,
      isError: false,
      isSuccess: false,
      isEmpty: false,
    });

    const props = {
      ...DEFAULT_PROPS,
      sourceUrl: 'test-url',
    };

    render(<Card {...props} />);
    expect(screen.getByTestId('chart-loader')).toBeInTheDocument();
  });
});
