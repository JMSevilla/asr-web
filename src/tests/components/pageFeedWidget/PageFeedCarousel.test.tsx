import { ReactNode } from 'react';
import { PageFeedCarousel } from '../../../components/blocks/pageFeedWidget/PageFeedCarousel';
import { render, screen } from '../../common';

const DEFAULT_PROPS: React.ComponentProps<typeof PageFeedCarousel> = {
  header: 'Carousel Container Header',
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
  widgets: [
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
  ],
  pageKey: 'pageKey',
  journeyType: 'bereavement',
};

const CARDS = [
  {
    elements: {
      callToAction: {
        values: [],
      },
      image: {
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
      title: {
        elementType: 'text1',
        value: 'title1',
      },
      description: {
        elementType: 'formattedtext',
        value: '<p>Don’t become a scam victim: take steps to protect your pension. 1</p>\n',
      },
    },
    type: 'Page Card',
  },
  {
    elements: {
      callToAction: {
        values: [],
      },
      image: {
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
      title: {
        elementType: 'text2',
        value: 'title2',
      },
      description: {
        elementType: 'formattedtext',
        value: '<p>Don’t become a scam victim: take steps to protect your pension. 2</p>\n',
      },
    },
    type: 'Page Card',
  },
];

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div data-testid="swiper-testid">{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div data-testid="swiper-slide-testid">{children}</div>,
  useSwiper: jest.fn(),
}));

describe('PageFeedCarousel', () => {
  it('renders PageFeedCarousel component', () => {
    render(<PageFeedCarousel {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('page-feed-carousel')).toBeTruthy();
  });
  it('should render carousel component with widgets', () => {
    render(<PageFeedCarousel {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('swiper-testid')).toBeInTheDocument();
    expect(screen.queryAllByTestId('swiper-slide-testid')).toHaveLength(3);
    expect(screen.queryByText('Carousel Container Header')).toBeInTheDocument();
    expect(screen.queryByText('header1')).toBeInTheDocument();
    expect(screen.queryByText('content1')).toBeInTheDocument();
    expect(screen.queryByText('header2')).toBeInTheDocument();
    expect(screen.queryByText('content2')).toBeInTheDocument();
    expect(screen.queryByText('header3')).toBeInTheDocument();
    expect(screen.queryByText('content3')).toBeInTheDocument();
  });
  it('should render carousel component with cards', () => {
    render(<PageFeedCarousel {...DEFAULT_PROPS} cards={CARDS} />);
    expect(screen.queryByTestId('swiper-testid')).toBeInTheDocument();
    expect(screen.queryAllByTestId('swiper-slide-testid')).toHaveLength(2);
    expect(screen.queryByText('Carousel Container Header')).toBeInTheDocument();
    expect(screen.queryByText('Don’t become a scam victim: take steps to protect your pension. 1')).toBeInTheDocument();
    expect(screen.queryByText('title2')).toBeInTheDocument();
    expect(screen.queryByText('Don’t become a scam victim: take steps to protect your pension. 2')).toBeInTheDocument();
  });
});
