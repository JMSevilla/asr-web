import { PageFeedCmsCard } from '../../../components/blocks/pageFeedWidget/PageFeedCmsCard';
import { render, screen } from '../../common';

const DEFAULT_PROPS: React.ComponentProps<typeof PageFeedCmsCard> = {
  card: {
    elements: {
      callToAction: {
        values: [],
        value: {
          elements: {
            customActionKey: { value: 'customActionKey' },
            analyticsKey: { value: 'analyticsKey' },
            anchor: {
              value: 'anchor',
            },
            buttonKey: { value: 'buttonKey' },
            buttonLink: { value: 'buttonLink' },
            buttonText: { value: 'Read more' },
            notification: { value: 'buttonKey' },
            buttonType: {
              value: {
                label: 'Primary',
                selection: 'Primary',
              },
            },
            pageKey: { value: 'buttonTex' },
            openInTheNewTab: { value: false },
            journeyType: {
              value: {
                label: 'bereavement',
                selection: 'bereavement',
              },
            },
          },
        },
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
        elementType: 'text',
        value: 'title',
      },
      description: {
        elementType: 'formattedtext',
        value: '<p>Don’t become a scam victim: take steps to protect your pension.</p>\n',
      },
    },
    type: 'Page Card',
  },
  id: 1,
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
  pageKey: 'pageKey',
  journeyType: 'bereavement',
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

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({
    fastForward: {
      shouldGoToSummary: jest.fn().mockReturnValue(true),
      onreset,
      state: { bereavement: { summaryPageKey: 'summaryPageKey' } },
    },
  }),
}));

describe('PageFeedCmsCard', () => {
  it('renders PageFeedCmsCard component', () => {
    render(<PageFeedCmsCard {...DEFAULT_PROPS} />);
    expect(screen.queryByRole('img')).toBeInTheDocument();
    expect(screen.queryByText('title')).toBeInTheDocument();
    expect(screen.queryByText('Don’t become a scam victim: take steps to protect your pension.')).toBeInTheDocument();
    expect(screen.queryByText('Read more')).toBeInTheDocument();
  });
});
