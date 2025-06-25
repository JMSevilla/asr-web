import Head from 'next/head';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ServerProps } from '../../../Page';
import { CmsGlobals } from '../../../api/content/types/globals';
import { CmsMenu } from '../../../api/content/types/menu';
import { CmsPage } from '../../../api/content/types/page';
import { CmsFooter } from '../../../api/content/types/tenant';
import { Membership } from '../../../api/mdp/types';
import { CmsTokens } from '../../../api/types';
import { extractPreloadedLabelFromGlobals } from '../../../business/globals';
import { injectTokenValuesToPage } from '../../../cms/inject-tokens';
import { ErrorBox } from '../../../components';
import { isSingleAuthPath } from '../../auth-method-rules';
import { useApi, useApiCallback } from '../../hooks/useApi';
import { useCachedAccessKey } from '../../hooks/useCachedAccessKey';
import { removeTransferJourneySteps } from '../../remove-transfer-journey-steps';
import { useRouter } from '../../router';
import { validateJourneyIntegrity } from '../../validate-journey-integrity';
import { useSingleAuthStorage } from '../auth/singleAuth/hooks/useSingleAuthStorage';
import { AUTH_METHODS } from '../auth/types';
import { usePersistentAppState } from '../persistentAppState/PersistentAppStateContext';
import { useCachedCmsGlobals } from './useCachedCmsGlobals';
import { useCachedCmsTokens } from './useCachedCmsTokens';

export type ContentData = {
  page: CmsPage | null;
  globals: CmsGlobals | null;
  footer: CmsFooter | null;
  menu: CmsMenu | null;
};

const context = createContext<
  {
    loading: boolean;
    membership: Membership | null;
    cmsTokens: CmsTokens | null;
    clearCmsTokens: VoidFunction;
    updateCmsToken(key: keyof CmsTokens, value: CmsTokens[keyof CmsTokens]): void;
    hideTemplateNavigation: boolean;
  } & ContentData
>(undefined as any);

let preservedMembershipData: Membership | null = null;

export const useContentDataContext = () => {
  if (!context) {
    throw new Error('ContentDataContextProvider should be used');
  }
  return useContext(context);
};

export const ContentDataContextProvider: React.FC<React.PropsWithChildren<ServerProps>> = ({
  children,
  tenant,
  slug,
  preloadedGlobals,
  authMethod,
}) => {
  const router = useRouter();
  const cmsTokens = useCachedCmsTokens();
  const cmsGlobals = useCachedCmsGlobals(tenant.tenantUrl.value);
  const membershipData = useApiCallback(api => api.mdp.membershipData());
  const accessKey = useCachedAccessKey();
  const [saData] = useSingleAuthStorage();
  const persistentState = usePersistentAppState();
  const [enrichedContentData, setEnrichedContentData] = useState<ContentData>();
  const [hideTemplateNavigation, setHideTemplateNavigation] = useState<boolean>(false);

  const contentData = useApi(
    async api => {
      const isAuthPage = authMethod === AUTH_METHODS.SINGLE_AUTH && isSingleAuthPath(slug);

      let accessKeyData = null;

      if (authMethod === AUTH_METHODS.SINGLE_AUTH) {
        if (saData.primaryBgroup && saData.primaryRefno) {
          // Access key fetch happens only ONCE in post-authentication flow
          accessKeyData = await accessKey.refresh();
        }
      } else {
        accessKeyData = await accessKey.fetch();
      }

      const [globals, page, footer, menu, tokenInformation, membership] = await Promise.allSettled([
        cmsGlobals.fetch(accessKeyData?.contentAccessKey),
        api.content.page(slug, tenant.tenantUrl.value, accessKeyData?.contentAccessKey),
        isAuthPage
          ? Promise.resolve(null)
          : api.content.footer(tenant.tenantUrl.value, accessKeyData?.contentAccessKey),
        isAuthPage ? Promise.resolve(null) : api.content.menu(tenant.tenantUrl.value, accessKeyData?.contentAccessKey),
        accessKeyData?.contentAccessKey ? cmsTokens.fetch() : Promise.resolve(null),
        isAuthPage || !accessKeyData?.contentAccessKey ? Promise.resolve(null) : membershipData.execute(),
      ]);

      preservedMembershipData = fulfilledValueOrNull(membership)?.data ?? null;
      const footerData = fulfilledValueOrNull(footer)?.data ?? null;
      const menuData = fulfilledValueOrNull(menu)?.data ?? null;
      const tokenInformationData = fulfilledValueOrNull(tokenInformation);
      const pageElementsData = fulfilledValueOrThrow(page).data?.elements ?? null;
      const globalsData = fulfilledValueOrThrow(globals);

      await validateJourneyIntegrity(api, pageElementsData, globalsData, router, persistentState);
      await removeTransferJourneySteps(api, pageElementsData);

      setEnrichedContentData(
        injectTokenValuesToPage(
          tenant,
          pageElementsData,
          globalsData,
          footerData,
          menuData,
          tokenInformationData,
          persistentState,
        ),
      );

      setHideTemplateNavigation(!!pageElementsData?.hideTemplateNavigation?.value || isAuthPage);
    },
    [tenant, slug, authMethod, saData.primaryBgroup, saData.primaryRefno],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const clear = () => {
      cmsTokens.clear();
      accessKey.clear();
    };
    window.addEventListener('beforeunload', clear);
    return () => window.removeEventListener('beforeunload', clear);
  }, []);

  const value = useMemo(
    () => ({
      loading: contentData.loading || cmsTokens.loading || router.loading,
      cmsTokens: cmsTokens.data,
      membership: preservedMembershipData,
      page: enrichedContentData?.page ?? null,
      globals: enrichedContentData?.globals ?? null,
      footer: enrichedContentData?.footer ?? null,
      menu: enrichedContentData?.menu ?? null,
      updateCmsToken: cmsTokens.update,
      clearCmsTokens: cmsTokens.clear,
      hideTemplateNavigation,
    }),
    [
      contentData.loading,
      cmsTokens.loading,
      cmsTokens.data,
      preservedMembershipData,
      membershipData.result?.data,
      enrichedContentData,
      cmsTokens.update,
      cmsTokens.clear,
      hideTemplateNavigation,
    ],
  );

  if (contentData.error) {
    return (
      <ErrorBox
        label={contentData?.error?.message ?? extractPreloadedLabelFromGlobals('page_error', preloadedGlobals)}
      />
    );
  }

  return (
    <context.Provider value={value}>
      <Head>{<title>{enrichedContentData?.page?.pageHeader?.value || tenant.tenantName.value}</title>}</Head>
      {children}
    </context.Provider>
  );
};

const fulfilledValueOrNull = <T,>(response: PromiseSettledResult<T | null>) =>
  response.status === 'fulfilled' ? response.value : null;

const fulfilledValueOrThrow = <T,>(response: PromiseSettledResult<T>) => {
  if (response.status === 'rejected') {
    throw new Error(response.reason);
  }
  return response.value;
};
