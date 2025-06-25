import mixpanel from 'mixpanel-browser';
import { config } from '../../config';
import { logger } from '../../core/datadog-logs';
import {
  initMixpanelTracker,
  mixpanelBuildUserProfile,
  mixpanelTrackButtonClick,
  mixpanelTrackEvent,
  mixpanelTrackPageLoad,
  resetMixpanelTrackedUser,
  setMixpanelTrackedUser,
  setSuperProperties,
  updateUserProfile,
} from '../../core/mixpanel-tracker';

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  identify: jest.fn(),
  register: jest.fn(),
  people: {
    set: jest.fn(),
  },
  track: jest.fn(),
  reset: jest.fn(),
}));

jest.mock('../../config', () => ({
  config: {
    value: {
      MIXPANEL_TOKEN: null,
    },
  },
}));

jest.mock('../../core/datadog-logs', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

describe('Mixpanel Tracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    config.value.MIXPANEL_TOKEN = 'test-token';
  });

  test('initMixpanelTracker should initialize Mixpanel when token is available', () => {
    initMixpanelTracker();
    expect(mixpanel.init).toHaveBeenCalledWith('test-token', expect.any(Object));
  });

  test('initMixpanelTracker should log a warning when token is not available', () => {
    config.value.MIXPANEL_TOKEN = null;
    initMixpanelTracker();
    expect(logger.warn).toHaveBeenCalledWith('MIXPANEL_TOKEN is not defined in the configuration.');
    expect(mixpanel.init).not.toHaveBeenCalled();
  });

  test('setMixpanelTrackedUser should identify user and set properties', () => {
    const userName = 'test-user';
    initMixpanelTracker();
    setMixpanelTrackedUser(userName);
    expect(mixpanel.identify).toHaveBeenCalledWith(userName);
    expect(mixpanel.register).toHaveBeenCalledWith({ $user_id: userName });
    expect(mixpanel.people.set).toHaveBeenCalledWith({ $user_id: userName });
  });

  test('setSuperProperties should register properties in Mixpanel', () => {
    const properties = { key: 'value' };
    initMixpanelTracker();
    setSuperProperties(properties);
    expect(mixpanel.register).toHaveBeenCalledWith(properties);
  });

  test('updateUserProfile should set user profile properties in Mixpanel', () => {
    const properties = { key: 'value' };
    initMixpanelTracker();
    updateUserProfile(properties);
    expect(mixpanel.people.set).toHaveBeenCalledWith(properties);
  });

  test('mixpanelTrackPageLoad should track page load events', () => {
    const params = { PageKey: 'home', $referrer: '', Scroll: '0' };
    const pathName = '/path?search=test';
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/path',
        search: '?search=test',
      },
    });
    initMixpanelTracker();
    mixpanelTrackPageLoad(params);
    expect(mixpanel.track).toHaveBeenCalledWith(pathName, {
      ...params,
      Action: 'Page load',
      Page: pathName,
      Title: document.title,
    });
  });

  test('mixpanelTrackButtonClick should track button click events', () => {
    const params = { Category: 'test', Label: 'button', ButtonKey: 'btn1' };
    const pathName = '/path?search=test';
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/path',
        search: '?search=test',
      },
    });
    initMixpanelTracker();
    mixpanelTrackButtonClick(params);
    expect(mixpanel.track).toHaveBeenCalledWith('Test', {
      ...params,
      Action: 'Click button',
      Page: pathName,
    });
  });

  test('mixpanelTrackEvent should track openam login event', () => {
    const eventName = 'User Login to Assure';
    initMixpanelTracker();
    mixpanelTrackEvent(eventName);
    expect(mixpanel.track).toHaveBeenCalledWith(eventName, undefined);
  });

  test('mixpanelTrackEvent should track sa post sign-in success', () => {
    const eventName = 'sa post sign-in success';
    initMixpanelTracker();
    mixpanelTrackEvent(eventName);
    expect(mixpanel.track).toHaveBeenCalledWith(eventName, undefined);
  });

  test('mixpanelTrackEvent should track sa post registration success', () => {
    const eventName = 'sa post registration success';
    initMixpanelTracker();
    mixpanelTrackEvent(eventName);
    expect(mixpanel.track).toHaveBeenCalledWith(eventName, undefined);
  });

  test('mixpanelTrackEvent should track events in Mixpanel', () => {
    const eventName = 'test_event';
    const params: any = { key: 'value' };
    initMixpanelTracker();
    mixpanelTrackEvent(eventName, params);
    expect(mixpanel.track).toHaveBeenCalledWith(eventName, params);
  });

  test('resetMixpanelTrackedUser should reset the user in Mixpanel', () => {
    initMixpanelTracker();
    resetMixpanelTrackedUser();
    expect(mixpanel.reset).toHaveBeenCalled();
  });

  test('setMixpanelTrackedUser should return early if Mixpanel is not initialized', () => {
    const userName = 'test-user';
    config.value.MIXPANEL_TOKEN = null;
    setMixpanelTrackedUser(userName);
    expect(mixpanel.identify).not.toHaveBeenCalled();
    expect(mixpanel.register).not.toHaveBeenCalled();
    expect(mixpanel.people.set).not.toHaveBeenCalled();
  });

  test('setSuperProperties should return early if Mixpanel is not initialized', () => {
    const properties = { key: 'value' };
    config.value.MIXPANEL_TOKEN = null;
    setSuperProperties(properties);
    expect(mixpanel.register).not.toHaveBeenCalled();
  });

  test('updateUserProfile should return early if Mixpanel is not initialized', () => {
    const properties = { key: 'value' };
    config.value.MIXPANEL_TOKEN = null;
    updateUserProfile(properties);
    expect(mixpanel.people.set).not.toHaveBeenCalled();
  });

  test('mixpanelTrackPageLoad should return early if Mixpanel is not initialized', () => {
    const params = { PageKey: 'home', $referrer: '', Scroll: '0' };
    config.value.MIXPANEL_TOKEN = null;
    mixpanelTrackPageLoad(params);
    expect(mixpanel.track).not.toHaveBeenCalled();
  });

  test('mixpanelTrackButtonClick should return early if Mixpanel is not initialized', () => {
    const params = { Category: 'test', Label: 'button', ButtonKey: 'btn1' };
    config.value.MIXPANEL_TOKEN = null;
    mixpanelTrackButtonClick(params);
    expect(mixpanel.track).not.toHaveBeenCalled();
  });

  test('mixpanelTrackEvent should return early if Mixpanel is not initialized', () => {
    const eventName = 'test_event';
    const params: any = { key: 'value' };
    config.value.MIXPANEL_TOKEN = null;
    mixpanelTrackEvent(eventName, params);
    expect(mixpanel.track).not.toHaveBeenCalled();
  });

  test('resetMixpanelTrackedUser should return early if Mixpanel is not initialized', () => {
    config.value.MIXPANEL_TOKEN = null;
    resetMixpanelTrackedUser();
    expect(mixpanel.reset).not.toHaveBeenCalled();
  });

  test('should set user ID and update user profile with provided data', () => {
    const mockAnalyticsParams = {
      userId: 'USER123',
      businessGroup: 'ZZY',
      status: 'AC',
      schemeType: 'DC',
      schemeCode: '001',
      categoryCode: '001',
      locationCode: '001',
      employerCode: '001',
      gender: 'Male',
      income: '1000.00',
      isAvc: true,
      tenure: 10,
      lifeStage: 'LS',
      dbCalculationStatus: 'Status',
      earliestRetirementAge: 60,
      hasAdditionalContributions: true,
      latestRetirementAge: 70,
      maritalStatus: 'Single',
      normalRetirementAge: 65,
      normalRetirementDate: '2024-09-07T20:59:59.999Z',
      retirementApplicationStatus: 'Status',
      targetRetirementAge: 65,
      targetRetirementDate: '2024-09-07T20:59:59.999Z',
      tenantUrl: 'test.com',
      transferApplicationStatus: 'Status',
      dcRetirementJourney: 'Submitted',
      dcexploreoptionsStarted: false,
      dcretirementapplicationStarted: false,
      dcretirementapplicationSubmitted: true,
      currentAge: '20M',
      dcLifeStage: 'farFromTRD',
    };

    const setMixpanelTrackedUserMock = jest.spyOn(require('../../core/mixpanel-tracker'), 'setMixpanelTrackedUser');
    const updateUserProfileMock = jest.spyOn(require('../../core/mixpanel-tracker'), 'updateUserProfile');

    mixpanelBuildUserProfile(mockAnalyticsParams);

    expect(setMixpanelTrackedUserMock).toHaveBeenCalledWith('USER123');
    expect(updateUserProfileMock).toHaveBeenCalledWith({
      'Business Group': 'ZZY',
      'Member Status': 'AC',
      'Scheme Type': 'DC',
      'Scheme Code': '001',
      'Category Code': '001',
      'Location Code': '001',
      'Employer Code': '001',
      Gender: 'Male',
      Income: '1000.00',
      IsAvc: true,
      Tenure: 10,
      LifeStage: 'LS',
      DBCalculationStatus: 'Status',
      'Earliest Retirement Age': 60,
      HasAdditionalContributions: true,
      'Latest Retirement Age': 70,
      'Marital Status': 'Single',
      'Normal Retirement Age': 65,
      'Normal Retirement Date': '2024-09-07T20:59:59.999Z',
      'Retirement Application Status': 'Status',
      'Target Retirement Age': 65,
      'Target Retirement Date': '2024-09-07T20:59:59.999Z',
      'Tenant URL': 'test.com',
      'Transfer Application Status': 'Status',
      'DC Retirement Journey': 'Submitted',
      'DC Explore Options Started': false,
      'DC Retirement Application Started': false,
      'DC Retirement Application Submitted': true,
      'Current Age': '20M',
      'DC Life Stage': 'farFromTRD',
    });
  });
});
