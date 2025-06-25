import { datadogLogs } from '@datadog/browser-logs';
import { config } from '../config';

export function init() {
  datadogLogs.init({
    clientToken: config.value.DATADOG_CLIENT_TOKEN,
    site: config.value.DATADOG_SITE,
    env: config.value.DATADOG_ENV,
    service: config.value.DATADOG_SERVICE,
    version: config.value.DATADOG_SERVICE_VERSION,
    forwardErrorsToLogs: config.value.DATADOG_FW_ERROR_LOG,
    sampleRate: config.value.DATADOG_SAMPLE_RATE,
    useSecureSessionCookie: process.env.NODE_ENV === 'production',
  });
}

export const logger = datadogLogs.logger;
