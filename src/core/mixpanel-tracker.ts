import mixpanel from 'mixpanel-browser';
import { AnalyticsParams } from '../api/mdp/types';
import { capitalizeFirstLetter } from '../business/strings';
import { config } from '../config';
import { logger } from './datadog-logs';

export type TrackButtonClickParams = {
  Category: string;
  Action: string;
  Page: string;
  Label?: string;
  ButtonKey?: string;
};

export type TrackPageLoadParams = {
  Page: string;
  Action: string;
  PageKey?: string;
  Title?: string;
  $referrer: string;
  Scroll: string;
};

type LoginTracker = {
  auth_guid?: string;
};

let mixpanelInitialized = false;

export const initMixpanelTracker = () => {
  if (!config.value.MIXPANEL_TOKEN) {
    logger.warn('MIXPANEL_TOKEN is not defined in the configuration.');
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const sessionReplayPercent = Number(process.env.NEXT_PRIVATE_MIXPANEL_RECORD_SESSIONS_PERCENT ?? '0');
  const isSessionReplayEnabled = sessionReplayPercent > 0;

  try {
    mixpanel.init(config.value.MIXPANEL_TOKEN, {
      debug: !isProduction,
      secure_cookie: isProduction,
      persistence: 'cookie',
      ...(isProduction && isSessionReplayEnabled && {
        record_sessions_percent: sessionReplayPercent,
        record_idle_timeout_ms: config.value.SINGLE_AUTH_IDLE_TIMEOUT_MINUTES || 1800000,
      }),
    } as any);
    mixpanelInitialized = true;
  } catch (e) {
    logger.warn('Error initializing Mixpanel.', { error: e });
  }
};

export const isMixpanelEnabled = () => Boolean(config.value.MIXPANEL_TOKEN) && mixpanelInitialized;

/**
 * Registers the user in Mixpanel.
 * This should be called when the user logs in or when the session is created.
 *
 * @param userName - The username to set as the tracking ID instead of the default random ID.
 */
export const setMixpanelTrackedUser = (userName: string) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.identify(userName);
  const user = { $user_id: userName };
  setSuperProperties(user);
  updateUserProfile(user);
};

/**
 * Updates or adds properties which are sent in every tracking call.
 * @param properties - The properties to set as super properties.
 */
export const setSuperProperties = (properties: Record<string, any>) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.register(properties);
};

/**
 * Updates or adds properties on a user profile which will be persisted in Mixpanel.
 * @param properties - The properties to update or add.
 */
export const updateUserProfile = (properties: Record<string, any>) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.people.set(properties);
};

/**
 * Tracks a page load event.
 * @param params - The parameters for the page load event.
 */
export function mixpanelTrackPageLoad(params: Omit<TrackPageLoadParams, 'Page' | 'Title' | 'Action'>) {
  const pathName = getCurrentPathWithSearch();
  mixpanelTrackEvent(pathName, {
    ...params,
    Action: 'Page load',
    Page: pathName,
    Title: document.title,
  });
}

/**
 * Tracks a button click event.
 * @param params - The parameters for the button click event.
 */
export function mixpanelTrackButtonClick(params: Omit<TrackButtonClickParams, 'Page' | 'Action'>) {
  const pathName = getCurrentPathWithSearch();
  mixpanelTrackEvent(capitalizeFirstLetter(params.Category), {
    ...params,
    Action: 'Click button',
    Page: pathName,
  });
}

/**
 * Tracks an event in Mixpanel.
 * @param eventName - The name of the event to track.
 * @param params - Additional event parameters.
 */
export const mixpanelTrackEvent = (
  eventName: string,
  params?: TrackPageLoadParams | TrackButtonClickParams | LoginTracker,
) => {
  if (!isMixpanelEnabled()) return;
  mixpanel.track(eventName, params);
};

/**
 * Resets the tracked user in Mixpanel.
 * This can be called when the user logs out or when the session expires.
 */
export const resetMixpanelTrackedUser = () => {
  if (!isMixpanelEnabled()) return;
  mixpanel.reset();
};

/**
 * Build user profile and set tracked user in Mixpanel.
 * @param data - User properties
 * @returns
 */
export const mixpanelBuildUserProfile = (data: AnalyticsParams) => {
  setMixpanelTrackedUser(data.userId ?? '');
  updateUserProfile({
    'Business Group': data.businessGroup ?? '',
    'Member Status': data.status ?? '',
    'Scheme Type': data.schemeType ?? '',
    'Scheme Code': data.schemeCode ?? '',
    'Category Code': data.categoryCode ?? '',
    'Location Code': data.locationCode ?? '',
    'Employer Code': data.employerCode ?? '',
    Gender: data.gender ?? '',
    Income: data.income ?? '',
    IsAvc: data.isAvc ?? false,
    Tenure: data.tenure ?? 0,
    LifeStage: data.lifeStage ?? '',
    DBCalculationStatus: data.dbCalculationStatus ?? '',
    'Earliest Retirement Age': data.earliestRetirementAge ?? 0,
    HasAdditionalContributions: data.hasAdditionalContributions ?? false,
    'Latest Retirement Age': data.latestRetirementAge ?? 0,
    'Marital Status': data.maritalStatus ?? '',
    'Normal Retirement Age': data.normalRetirementAge ?? 0,
    'Normal Retirement Date': data.normalRetirementDate ?? '',
    'Retirement Application Status': data.retirementApplicationStatus ?? '',
    'Target Retirement Age': data.targetRetirementAge ?? 0,
    'Target Retirement Date': data.targetRetirementDate ?? '',
    'Tenant URL': data.tenantUrl ?? '',
    'Transfer Application Status': data.transferApplicationStatus ?? '',
    'DC Retirement Journey': data.dcRetirementJourney ?? null,
    'DC Explore Options Started': data.dcexploreoptionsStarted ?? false,
    'DC Retirement Application Started': data.dcretirementapplicationStarted ?? false,
    'DC Retirement Application Submitted': data.dcretirementapplicationSubmitted ?? false,
    'Current Age': data.currentAge ?? '',
    'DC Life Stage': data.dcLifeStage ?? '',
  });
};

function getCurrentPathWithSearch() {
  if (typeof window !== 'undefined') {
    return window.location.pathname + window.location.search;
  }
  return '';
}

/**
 * Initializes analytics user profile and tracks an event if Mixpanel is enabled
 * @param callbackFn - Object containing execute function that returns analytics parameters
 * @param eventName - Name of the event to track in Mixpanel
 * @param contentAccessKey - Optional content access key used by callback function
 * @param userId - Optional user ID to override the one from analytics params
 * @param authGuid - Optional authentication GUID to include in event tracking
 * @throws Error Logs error if analytics initialization fails
 */
export const initializeAnalyticsUser = async (
  callbackFn: { execute: (contentAccessKey?: string) => Promise<{ data: AnalyticsParams }> },
  eventName: string,
  contentAccessKey?: string,
  userId?: string,
  authGuid?: string,
) => {
  if (isMixpanelEnabled()) {
    try {
      const analyticsParams = await callbackFn.execute(contentAccessKey);
      mixpanelBuildUserProfile({
        ...analyticsParams.data,
        userId: userId ? userId : analyticsParams.data.userId,
      });
      mixpanelTrackEvent(eventName, authGuid ? { auth_guid: authGuid } : undefined);
    } catch (e) {
      logger.error('Error occurred during analytics user initialization', e as object);
    }
  }
};
