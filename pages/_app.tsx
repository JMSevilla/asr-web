import { CacheProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { default as Router } from 'next/router';
import Script from 'next/script';
import NProgress from 'nprogress';
import { Suspense, useEffect, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { config } from '../src/config';
import { PageLoaderContextProvider } from '../src/core/contexts/PageLoaderContext';
import { AUTH_METHODS, AuthInstance } from '../src/core/contexts/auth/types';
import { PersistentAppStateProvider } from '../src/core/contexts/persistentAppState/PersistentAppStateContext';
import { init as initLogging, logger } from '../src/core/datadog-logs';
import { init as initMonitoring } from '../src/core/datadog-monitoring';
import { useParameterizedAnalytics } from '../src/core/hooks/useAnalytics';
import { useEmotionCache } from '../src/core/hooks/useEmotionCache';
import { useSaveTrackerParamsOnNavigation } from '../src/core/hooks/useMixpanelTracker';
import { init as initAnalytics } from '../src/core/matomo-analytics';
import { initMixpanelTracker } from '../src/core/mixpanel-tracker';
import '../styles/globals.css';
import '../styles/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

if (typeof window !== 'undefined') {
  initLogging();
  initMonitoring();
  initAnalytics();
  initMixpanelTracker();
}

const MsalProvider = dynamic(() => import('@azure/msal-react').then(mod => mod.MsalProvider), { ssr: false });

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [authInstance, setAuthInstance] = useState<AuthInstance | null>(null);
  const analytics = useParameterizedAnalytics(pageProps.data?.bgroup);
  const cache = useEmotionCache();
  const hideCookieBannerOnPage = config.value.HIDE_COOKIE_BANNER_PATHS.some(prefix =>
    pageProps.data?.slug.startsWith(prefix),
  );
  const includeCookieScripts =
    !hideCookieBannerOnPage && Boolean(config.value.COOKIE_SCRIPT_URL) && Boolean(config.value.COOKIE_DOMAIN_SCRIPT);

  useSaveTrackerParamsOnNavigation();

  useEffect(() => {
    const initializeAuthService = async () => {
      try {
        const authMethod = pageProps.data?.authMethod;

        if (authMethod === AUTH_METHODS.SINGLE_AUTH) {
          const msalModule = await import('../src/core/msal');
          const msalInstance = await msalModule.initializeMsal(pageProps.data?.tenant);
          if (msalInstance) {
            setAuthInstance({ type: AUTH_METHODS.SINGLE_AUTH, instance: msalInstance });
          } else {
            logger.error('MSAL initialization failed');
            setAuthInstance(null);
          }
        } else {
          setAuthInstance({ type: AUTH_METHODS.OPENAM, instance: null });
        }
      } catch (error) {
        logger.error('Error during auth initialization:', error as object);
        setAuthInstance({ type: AUTH_METHODS.OPENAM, instance: null });
      }
    };

    initializeAuthService();
  }, [pageProps.data?.authMethod]);

  const renderApp = () => {
    const baseApp = (children: React.ReactNode) => {
      return <PageLoaderContextProvider loading={analytics.loading}>{children}</PageLoaderContextProvider>;
    };

    const content = (
      <PersistentAppStateProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Component {...pageProps} />
        </Suspense>
      </PersistentAppStateProvider>
    );

    if (!authInstance) {
      return baseApp(content);
    }

    switch (authInstance.type) {
      case AUTH_METHODS.SINGLE_AUTH:
        return baseApp(<MsalProvider instance={authInstance.instance}>{content}</MsalProvider>);
      case AUTH_METHODS.OPENAM:
      default:
        return baseApp(content);
    }
  };

  return (
    <CacheProvider value={cache}>
      <CookiesProvider>
        {includeCookieScripts && (
          <>
            <Script
              type="text/javascript"
              strategy="beforeInteractive"
              src={config.value.COOKIE_SCRIPT_URL}
              data-domain-script={config.value.COOKIE_DOMAIN_SCRIPT}
            />
            <Script type="text/javascript">{`function OptanonWrapper() {}`}</Script>
          </>
        )}
        {config.value.SURVEY_SCRIPT_URL && config.value.SURVEY_SCRIPT_KEY && (
          <Script
            id={`cf-program-${config.value.SURVEY_SCRIPT_KEY}`}
            src={`${config.value.SURVEY_SCRIPT_URL}?programKey=${config.value.SURVEY_SCRIPT_KEY}`}
            async
          />
        )}
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        {renderApp()}
      </CookiesProvider>
    </CacheProvider>
  );
};

export default App;
