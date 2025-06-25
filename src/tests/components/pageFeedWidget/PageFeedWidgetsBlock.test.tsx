import { ReactNode } from 'react';
import { PageFeedWidgetsBlock } from '../../../components';
import { usePageFeedWidgetData } from '../../../components/blocks/pageFeedWidget/hooks';
import { render, screen } from '../../common';

const DEFAULT_PROPS: React.ComponentProps<typeof PageFeedWidgetsBlock> = {
  pageUrl: 'pageUrl',
  defaultImage: {
    asset: {
      altText: '',
      fileName: 'NatWestWTWLogo.png',
      fileSize: 2151,
      height: 50,
      id: '1d822b17-9b37-4db7-9800-390df5d467a5',
      mediaType: 'image/png',
      resourceUri: '/delivery/v1/resources/fd9be909-f009-464a-a5bd-f8c2af17ddc5',
      width: 208,
    },
    elementType: 'image',
    mode: 'shared',
    renditions: {
      default: {
        height: 50,
        source: '/delivery/v1/resources/fd9be909-f009-464a-a5bd-f8c2af17ddc5',
        url: '/741c4d56-3b59-4052-a4f2-7f605f25b4a0/dxresources/fd9b/fd9be909-f009-464a-a5bd-f8c2af17ddc5.png',
        width: 208,
      },
    },
    url: '/741c4d56-3b59-4052-a4f2-7f605f25b4a0/dxresources/fd9b/fd9be909-f009-464a-a5bd-f8c2af17ddc5.png',
  },
  showAll: true,
  pageUrlsString: 'pageUrlsString',
  header: 'main-header',
  cards: [],
  pageKey: 'pageKey',
  journeyType: undefined,
};

const WIDGETS = [
  {
    pageUrl: 'pageUrl1',
    imageRelativeUrl: 'imageRelativeUrl1',
    header: 'header1',
    content: 'content1',
  },
  {
    pageUrl: 'pageUrl2',
    imageRelativeUrl: 'imageRelativeUrl2',
    header: 'header2',
    content: 'content2',
  },
  {
    pageUrl: 'pageUrl3',
    imageRelativeUrl: 'imageRelativeUrl3',
    header: 'header3',
    content: 'content3',
  },
];

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../../core/hooks/useCmsAsset', () => ({
  useCachedCmsAsset: () => 'image',
}));

jest.mock('../../../components/blocks/pageFeedWidget/hooks', () => ({
  usePageFeedWidgetData: jest.fn().mockReturnValue({ loading: false, widgets: [], error: undefined }),
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div data-testid="swiper-testid">{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div data-testid="swiper-slide-testid">{children}</div>,
  useSwiper: jest.fn(),
}));

describe('PageFeedWidgetsBlock', () => {
  it('renders PageFeedWidgetsBlock component', () => {
    render(<PageFeedWidgetsBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('page-feed-widget')).toBeTruthy();
  });
  it('should render PageFeedGrid component', () => {
    jest.mocked(usePageFeedWidgetData).mockReturnValue({ loading: false, widgets: WIDGETS, error: undefined });
    render(<PageFeedWidgetsBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('page-feed-grid')).toBeTruthy();
    expect(screen.queryAllByText('[[page-feed-widgets-read-more]]')).toHaveLength(3);
    expect(screen.queryByText('main-header')).toBeInTheDocument();
    expect(screen.queryByText('header1')).toBeInTheDocument();
    expect(screen.queryByText('content1')).toBeInTheDocument();
    expect(screen.queryByText('header2')).toBeInTheDocument();
    expect(screen.queryByText('content2')).toBeInTheDocument();
    expect(screen.queryByText('header3')).toBeInTheDocument();
    expect(screen.queryByText('content3')).toBeInTheDocument();
  });

  it('should render PageFeedCarousel component', () => {
    jest.mocked(usePageFeedWidgetData).mockReturnValue({ loading: false, widgets: WIDGETS, error: undefined });
    render(<PageFeedWidgetsBlock {...DEFAULT_PROPS} showAll={false} />);
    expect(screen.queryByTestId('page-feed-carousel')).toBeTruthy();
    expect(screen.queryAllByText('[[page-feed-widgets-read-more]]')).toHaveLength(3);
    expect(screen.queryByText('main-header')).toBeInTheDocument();
    expect(screen.queryByText('header1')).toBeInTheDocument();
    expect(screen.queryByText('content1')).toBeInTheDocument();
    expect(screen.queryByText('header2')).toBeInTheDocument();
    expect(screen.queryByText('content2')).toBeInTheDocument();
    expect(screen.queryByText('header3')).toBeInTheDocument();
    expect(screen.queryByText('content3')).toBeInTheDocument();
  });
});
