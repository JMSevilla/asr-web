import { ResourceListBlock, ResourceListItemProps } from '../../../components';
import { render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: {
    get value() {
      return {
        VIDEO_RESOURCES: 'https://www.video.com/',
      };
    },
  },
}));
jest.mock('../../../core/router', () => ({ useRouter: jest.fn() }));
jest.mock('../../../core/hooks/useCmsAsset', () => ({ useCachedCmsAsset: jest.fn().mockReturnValue('url') }));
jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn().mockReturnValue({ isMobile: false }),
}));

describe('ResourceListBlock', () => {
  it('should render header', () => {
    const title = 'resource';
    render(<ResourceListBlock id="id" header={title} />);
    expect(screen.queryByText(title)).toBeTruthy;
  });

  it('should render all resources', () => {
    const resources: ResourceListItemProps[] = [
      { id: '1', title: 'first' },
      { id: '2', title: 'second' },
    ];
    render(<ResourceListBlock id="id" resources={resources} />);
    expect(screen.queryAllByTestId('resource-button').length).toBe(resources.length);
  });

  it('should render standaloneTypes correctly', () => {
    const resources: ResourceListItemProps[] = [
      { id: '1', title: 'first', standaloneSize: 'Icon' },
      { id: '2', title: 'second', standaloneSize: 'Image' },
      { id: '3', title: 'third', standaloneSize: 'Video', link: 'https://www.url.com/' },
    ];
    render(<ResourceListBlock id="id" resources={resources} />);
    expect(screen.queryAllByTestId('resource-icon').length).toBe(1);
    expect(screen.queryAllByTestId('resource-image').length).toBe(1);
    expect(screen.queryAllByTestId('resource-video').length).toBe(1);
  });

  it('should render all resource items as icons when displayType is Icon', () => {
    const resources: ResourceListItemProps[] = [
      { id: '1', title: 'first', standaloneSize: 'Icon' },
      { id: '2', title: 'second', standaloneSize: 'Image' },
    ];
    render(<ResourceListBlock id="id" resources={resources} displayType="Icon" />);
    expect(screen.queryAllByTestId('resource-icon').length).toBe(2);
    expect(screen.queryAllByTestId('resource-image').length).toBe(0);
  });

  it('should render all resource items as icons when displayType is Image', () => {
    const resources: ResourceListItemProps[] = [
      { id: '1', title: 'first', standaloneSize: 'Icon' },
      { id: '2', title: 'second', standaloneSize: 'Image' },
    ];
    render(<ResourceListBlock id="id" resources={resources} displayType="Image" />);
    expect(screen.queryAllByTestId('resource-icon').length).toBe(0);
    expect(screen.queryAllByTestId('resource-image').length).toBe(2);
  });
});
