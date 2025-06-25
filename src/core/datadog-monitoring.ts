import { datadogRum } from '@datadog/browser-rum';
import { config } from '../config';

export function init() {
  datadogRum.init({
    applicationId: config.value.DATADOG_APPLICATION_ID,
    clientToken: config.value.DATADOG_CLIENT_TOKEN,
    site: config.value.DATADOG_SITE,
    env: config.value.DATADOG_ENV,
    service: config.value.DATADOG_SERVICE,
    version: config.value.DATADOG_SERVICE_VERSION,
    trackInteractions: config.value.DATADOG_INTERACTIONS,
    sampleRate: config.value.DATADOG_SAMPLE_RATE,
    replaySampleRate: 0,
    useSecureSessionCookie: process.env.NODE_ENV === 'production',
    allowedTracingOrigins: [config.value.API_URL],
  });

  datadogRum.startSessionReplayRecording();
}
