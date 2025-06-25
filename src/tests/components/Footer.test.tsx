import { CmsTenant } from '../../api/content/types/tenant';
import { Footer } from '../../components';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { act, render, screen } from '../common';
import { LINK_GROUPS } from '../mock';

const logo: NonNullable<NonNullable<CmsTenant['footerLogo']>['renditions']>['default'] = {
  source: '/delivery/v1/resources/aedfbaf4-0d4f-45d4-9235-c3f5328df5f6',
  url: '/741c4d56-3b59-4052-a4f2-7f605f25b4a0/dxresources/aedf/aedfbaf4-0d4f-45d4-9235-c3f5328df5f6.svg',
};
const copyrightText = 'Copyright © 2022 WTW. All rights reserved.';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../core/contexts/auth/AuthContext', () => ({ useAuthContext: jest.fn() }));

jest.mock('../../core/hooks/useCmsAsset', () => ({
  useCachedCmsAsset: jest
    .fn()
    .mockReturnValue('/741c4d56-3b59-4052-a4f2-7f605f25b4a0/dxresources/aedf/aedfbaf4-0d4f-45d4-9235-c3f5328df5f6.svg'),
}));

jest.mock('../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false, asPath: '' }),
}));

describe('Footer', () => {
  it('should render footer ', () => {
    jest.mocked(useAuthContext).mockReturnValue({ isAuthenticated: false, isSingleAuth: false } as any);
    act(() => {
      render(<Footer linkGroups={LINK_GROUPS} logo={logo} copyrightText={copyrightText} />);
    });
    expect(screen.queryAllByText(copyrightText)).toBeTruthy();
    expect(screen.queryAllByText('Terms & Conditions')).toBeTruthy();
    expect(screen.queryAllByText('Site Cookie Notice')).toBeTruthy();
    expect(screen.queryByTestId('footer')).toBeTruthy();
    expect(screen.queryByTestId('header_logo_image')).toBeTruthy();
  });

  it('should hide link groups when isAuthenticated is false and isSingleAuth is true', () => {
    jest.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: false,
      isSingleAuth: true,
    } as any);

    act(() => {
      render(<Footer linkGroups={LINK_GROUPS} logo={logo} copyrightText={copyrightText} />);
    });

    expect(screen.queryByTestId('footer')).toBeTruthy();
    expect(screen.queryByText(copyrightText)).toBeTruthy();
    expect(screen.queryByTestId('header_logo_image')).toBeTruthy();

    expect(screen.queryByText('Terms & Conditions')).toBeNull();
    expect(screen.queryByText('Site Cookie Notice')).toBeNull();
  });

  it('should hide link groups when hideNavigation is true', () => {
    jest.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      isSingleAuth: true,
    } as any);

    act(() => {
      render(<Footer linkGroups={LINK_GROUPS} logo={logo} copyrightText={copyrightText} hideNavigation={true} />);
    });

    expect(screen.queryByTestId('footer')).toBeTruthy();
    expect(screen.queryByText(copyrightText)).toBeTruthy();
    expect(screen.queryByTestId('header_logo_image')).toBeTruthy();

    expect(screen.queryByText('Terms & Conditions')).toBeNull();
    expect(screen.queryByText('Site Cookie Notice')).toBeNull();
  });
});
