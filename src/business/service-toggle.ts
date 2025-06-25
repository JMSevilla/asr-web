import { config } from '../config';
import { isTrue } from './boolean';

type Service = 'RECAPTCHA' | 'OTPCHECK';

export const isServiceEnabled = (service: Service) => !isServiceDisabled(service);

export const isServiceDisabled = (service: Service) => {
  switch (service) {
    case 'RECAPTCHA':
      return isTrue(config.value.SUPPRESS_RECAPTCHA);
    case 'OTPCHECK':
      return isTrue(config.value.SUPPRESS_OTPCHECK);
    default:
      return false;
  }
};
