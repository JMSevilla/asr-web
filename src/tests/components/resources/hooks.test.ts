import { useEmbeddedVideoHeight } from '../../../components/blocks/resources/hooks';
import { act, renderHook } from '../../common';

const mockedRef = (width: number) =>
  ({ clientWidth: width, children: { item: (_: number) => null } } as HTMLDivElement);

describe('useEmbeddedVideoHeight', () => {
  it('should calculate correct height for given ref', () => {
    const clientWidth = 200;
    const clientWidth2 = 400;
    const hook = renderHook(() => useEmbeddedVideoHeight(true));
    act(() => hook.result.current[0](mockedRef(clientWidth)));
    hook.rerender();
    expect(hook.result.current[1]).toBe(clientWidth / 2);
    act(() => hook.result.current[0](mockedRef(clientWidth2)));
    hook.rerender();
    expect(hook.result.current[1]).toBe(clientWidth2 / 2);
  });
});
