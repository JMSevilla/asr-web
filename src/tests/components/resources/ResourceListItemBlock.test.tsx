import { openInNewTab, openInNewWindow } from '../../../business/navigation';
import { ResourceListItemBlock } from '../../../components';
import { useCachedCmsAsset } from '../../../core/hooks/useCmsAsset';
import { useRouter } from '../../../core/router';
import { act, render, screen } from '../../common';

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));
jest.mock('../../../core/router', () => ({ useRouter: jest.fn() }));
jest.mock('../../../core/hooks/useCmsAsset', () => ({ useCachedCmsAsset: jest.fn().mockReturnValue('url') }));
jest.mock('../../../core/hooks/useCmsAsset', () => ({ useCachedCmsAsset: jest.fn().mockReturnValue('url') }));
jest.mock('../../../business/navigation', () => ({
  openInNewWindow: jest.fn(),
  openInNewTab: jest.fn(),
}));
jest.mock('../../../components/blocks/resources/hooks', () => ({
  useEmbeddedVideoHeight: jest.fn().mockReturnValue([null, null]),
}));

describe('ResourceListItemBlock', () => {
  it('should render title text', () => {
    const title = 'resource';
    render(<ResourceListItemBlock id="id" title={title} />);
    expect(screen.queryByTestId('resource-title')).toHaveTextContent(title);
  });

  it('should render resource icon by default', () => {
    render(<ResourceListItemBlock id="id" title="resource" />);
    expect(screen.queryByTestId('resource-icon')).toBeTruthy();
  });

  it('should render resource image when standaloneSize is "Image"', () => {
    render(<ResourceListItemBlock id="id" title="resource" standaloneSize="Image" />);
    expect(screen.queryByTestId('resource-image')).toBeTruthy();
  });

  it('should not render resource image when standaloneSize is "Image", but no provided link', () => {
    jest.mocked(useCachedCmsAsset).mockReturnValueOnce('');
    render(<ResourceListItemBlock id="id" title="resource" standaloneSize="Image" />);
    expect(screen.queryByTestId('resource-image')).toBeFalsy();
  });

  it('should render resource image when standaloneSize is "Image", no provided link, but isVideoImage is true', () => {
    jest.mocked(useCachedCmsAsset).mockReturnValueOnce('');
    render(<ResourceListItemBlock id="id" title="resource" standaloneSize="Image" isVideoImage />);
    expect(screen.queryByTestId('resource-image')).toBeTruthy();
  });

  it('should call window open onClick if document url is available', () => {
    jest.mocked(openInNewTab).mockClear();
    const routerPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ push: routerPushFn } as any);
    render(<ResourceListItemBlock id="id" title="resource" document={{ url: 'url' } as any} />);
    act(() => screen.getByTestId('resource-button').click());
    expect(openInNewWindow).toBeCalledTimes(1);
    expect(routerPushFn).not.toHaveBeenCalled();
  });

  it('should call window open onClick when there is an external link provided', () => {
    jest.mocked(openInNewTab).mockClear();
    const routerPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ push: routerPushFn } as any);
    render(<ResourceListItemBlock id="id" title="resource" link="https://www.test.react" />);
    act(() => screen.getByTestId('resource-button').click());
    expect(openInNewTab).toBeCalledTimes(1);
    expect(routerPushFn).not.toHaveBeenCalled();
  });

  it('should call window open onClick when there is an internal link provided', () => {
    jest.mocked(openInNewTab).mockClear();
    const routerPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ push: routerPushFn } as any);
    render(<ResourceListItemBlock id="id" title="resource" link="/test" />);
    act(() => screen.getByTestId('resource-button').click());
    expect(routerPushFn).toBeCalledTimes(1);
    expect(openInNewTab).not.toHaveBeenCalled();
  });
});
