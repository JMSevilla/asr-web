import { init as initAnalytics, push as pushParam } from '@socialgouv/matomo-next';
import { config } from '../config';

export function init() {
  initAnalytics({
    url: config.value.MATOMO_URL,
    jsTrackerFile: config.value.MATOMO_JS_TRACKER_URL,
    phpTrackerFile: config.value.MATOMO_PHP_TRACKER_URL,
    siteId: config.value.MATOMO_SITE_ID,
  });
  pushParam(['trackPageView']);
  pushParam(['enableLinkTracking']);
  pushParam(['setSecureCookie', 'true']);
  pushParam(['disableCookies']);
}

export function trackButtonClick(category: string) {
  pushParam(['trackEvent', category, 'click button']);
}
