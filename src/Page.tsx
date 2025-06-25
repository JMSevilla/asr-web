import { IronSession } from 'iron-session';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Layout as LayoutComponent } from './Layout';
import { getPreloadedGlobals, getTenant } from './api/content/ssr-api';
import { PreloadedGlobals } from './api/content/types/globals';
import { CmsTenant } from './api/content/types/tenant';
import './business/browser-tabs';
import { extractPreloadedLabelFromGlobals } from './business/globals';
import { formattedSlug, parseTenantUrl } from './business/tenant';
import { SingleAuthDirectRoutes, SingleAuthPostAuthHandler, SsoAuthentication } from './components';
import { ErrorBox } from './components/ErrorBox';
import { selectAuthMethod } from './core/auth-method-rules';
import { TenantContextProvider } from './core/contexts/TenantContext';
import { AuthProvider } from './core/contexts/auth/AuthContext';
import { AuthMethod } from './core/contexts/auth/types';
import { BereavementSessionProvider } from './core/contexts/bereavement/BereavementSessionContext';
import { ContentDataContextProvider } from './core/contexts/contentData/ContentDataContext';
import { RetirementContextProvider } from './core/contexts/retirement/RetirementContext';
import { withSsrSession } from './core/ssr/withSsrSession';

export interface ServerProps {
  preloadedGlobals: PreloadedGlobals;
  tenant: CmsTenant;
  slug: string;
  authMethod: AuthMethod;
  bgroup: string;
  referrer: string | null;
}

interface Props {
  data?: ServerProps;
  error?: Error;
}

export const Page: NextPage<Props> = ({ data, error }) => {
  if (error) {
    return <ErrorBox label={error.message} />;
  }

  if (!data?.tenant) {
    return <ErrorBox label={extractPreloadedLabelFromGlobals('failed_to_retrieve_tenant', data?.preloadedGlobals)} />;
  }

  const Layout = dynamic<React.ComponentProps<typeof LayoutComponent>>(() => import('./Layout').then(c => c.Layout), {
    ssr: false,
  });

  return (
    <TenantContextProvider authMethod={data.authMethod} tenant={data.tenant}>
      <ContentDataContextProvider {...data}>
        <RetirementContextProvider tenant={data.tenant}>
          <AuthProvider authMethod={data.authMethod} bgroup={data.bgroup}>
            <BereavementSessionProvider>
              <SsoAuthentication />
              <SingleAuthDirectRoutes referrer={data.referrer} slug={data.slug} />
              <SingleAuthPostAuthHandler>
                <Layout preloadedGlobals={data.preloadedGlobals} />
              </SingleAuthPostAuthHandler>
            </BereavementSessionProvider>
          </AuthProvider>
        </RetirementContextProvider>
      </ContentDataContextProvider>
    </TenantContextProvider>
  );
};

export interface NextIronSessionWithBgroup extends IronSession {
  bgroup?: string;
  authMethod?: AuthMethod;
}

export const getServerSideProps = withSsrSession(async ({ req, resolvedUrl, query }) => {
  const host = req.headers.host;
  const referrer = req.headers.referer || null;
  const querySlugs = query['slug'];
  const tenantUrl = parseTenantUrl(host);
  const path = resolvedUrl;

  if (!tenantUrl) {
    console.error('Tenant not found for host:', host);
    return { props: { error: { message: 'Tenant not found.' } } };
  }

  try {
    const tenant = await getTenant(tenantUrl);
    const session = req.session as NextIronSessionWithBgroup;
    session.bgroup = tenant.businessGroup.values.join(',');
    session.authMethod = selectAuthMethod({ path, referrer, currentMethod: session.authMethod });

    await session.save();

    const bgroup = session.bgroup || '';
    const preloadedGlobals = await getPreloadedGlobals(tenantUrl);
    const slug = formattedSlug(tenant, querySlugs as string[]) || resolvedUrl;

    return { props: { data: { tenant, slug, preloadedGlobals, bgroup, authMethod: session.authMethod, referrer } } };
  } catch (error: any) {
    console.error(`Error on getTenant response: ${error.message || error}`);
    return { props: { error: { message: error.message || 'An error occurred.' } } };
  }
});
