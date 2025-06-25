import { PageFeedCard } from '../../../components/blocks/pageFeedWidget/PageFeedCard';
import { render, screen } from '../../common';

const DEFAULT_PROPS: React.ComponentProps<typeof PageFeedCard> = {
  id: 1,
  widget: {
    pageUrl: 'pageUrl1',
    imageRelativeUrl: 'imageRelativeUrl1',
    header: 'header1',
    content: 'content1',
  },
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
  buttonKey: 'buttonKey',
};

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

describe('PageFeedCard', () => {
  it('renders PageFeedCard component', () => {
    render(<PageFeedCard {...DEFAULT_PROPS} />);
    expect(screen.queryByRole('img')).toBeInTheDocument();
    expect(screen.queryByText('header1')).toBeInTheDocument();
    expect(screen.queryByText('content1')).toBeInTheDocument();
    expect(screen.queryByText('[[buttonKey]]')).toBeInTheDocument();
  });
});
