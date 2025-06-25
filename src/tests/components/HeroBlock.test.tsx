import { CmsPage } from '../../api/content/types/page';
import { HeroBlock } from '../../components';
import { act, render, screen } from '../common';
import { PAGE } from '../mock';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../core/hooks/useCmsAsset', () => ({
  useCmsAsset: jest.fn().mockReturnValue('url'),
}));

jest.mock('../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: jest.fn().mockReturnValue({ isAuthenticated: true }),
}));

const elements = {
  accessGroups: {},
  header: { value: 'test hero' },
  parameters: {
    values: [],
  },
};

const contentEntity = {
  name: 'name',
  elements,
  type: 'Content HTML block',
};

describe('HeroBlock', () => {
  const page: CmsPage = {
    ...PAGE,
    heroBlocks: {
      values: [
        {
          elements: {
            heroContent: {
              value: contentEntity,
            },
            heroImage: {
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
          },
          type: 'hero',
        },
      ],
    },
    content: {
      values: [],
    },
  };
  it('should render hero block', () => {
    act(() => {
      render(<HeroBlock page={page} id="hero_block_test" />);
    });
    expect(screen.queryByTestId('hero-block')).toBeTruthy();
  });

  it('should parse and render content', () => {
    act(() => {
      render(<HeroBlock page={page} id="hero_block_test" />);
    });
    expect(screen.queryByTestId('content-html-block')).toBeTruthy();
  });
});
