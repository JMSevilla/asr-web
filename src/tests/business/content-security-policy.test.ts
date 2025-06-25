import { generateCSP, setCSPHeader } from '../../business/content-security-policy';
import { config } from '../../config';

jest.mock('../../config', () => ({
  config: {
    value: {
      SURVEY_URL: 'https://survey.example.com',
      MATOMO_URL: 'https://matomo.example.com',
      RECAPTCHA_URL: 'https://www.google.com/recaptcha/',
      GENESYS_DOMAIN: 'genesys.example.com',
      API_URL: 'https://api.example.com',
      MIXPANEL_URL: 'https://mixpanel.example.com',
      SURVEY_SCRIPT_URL: 'https://survey-script.example.com',
      SHYRKA_URL: 'https://shyrka.example.com',
      CMS_URL: 'https://cms.example.com',
      VIDEO_RESOURCES: 'https://video.example.com',
      GENESYS_WSS_URL: 'wss://genesys.example.com',
      AUTH_MSAL_AUTHORITY: 'https://auth.msal-authority.com',
    },
  },
}));

describe('CSP Configuration', () => {
  describe('generateCSP', () => {
    it('should generate a valid CSP string', () => {
      const nonce = 'test-nonce';
      const csp = generateCSP(nonce);

      expect(csp).toContain("default-src 'self' *.wtwco.com");
      expect(csp).toContain(
        `script-src 'self' *.wtwco.com *.awstas.net *.cookielaw.org https://digitalfeedback.euro.confirmit.com http://cdnjs.cloudflare.com http://cookiepedia.co.uk http://otsdk https://cdn.cookielaw.org https://www.gstatic.com ${config.value.SURVEY_URL} ${config.value.MATOMO_URL} ${config.value.RECAPTCHA_URL} *.${config.value.GENESYS_DOMAIN} 'nonce-${nonce}'`,
      );
      expect(csp).toContain("form-action 'self'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("object-src 'self'");
      expect(csp).toContain("style-src 'self' 'unsafe-inline' https://digitalfeedback.euro.confirmit.com");
      expect(csp).toContain(
        `connect-src 'self' *.wtwco.com *.awstas.net *.cookielaw.org https://digitalfeedback.euro.confirmit.com https://rum.browser-intake-datadoghq.eu https://cdn.cookielaw.org https://logs.browser-intake-datadoghq.eu https://geolocation.onetrust.com http://cookiepedia.co.uk http://otsdk blob: ${config.value.API_URL} ${config.value.MATOMO_URL} ${config.value.MIXPANEL_URL} ${config.value.SURVEY_SCRIPT_URL} *.${config.value.GENESYS_DOMAIN} ${config.value.SHYRKA_URL} ${config.value.SURVEY_URL} ${config.value.GENESYS_WSS_URL}`,
      );
      expect(csp).toContain(
        `img-src 'self' https://cdnjs.cloudflare.com https://cdn.cookielaw.org data: ${config.value.CMS_URL}`,
      );
      expect(csp).toContain("font-src 'self' data:");
      expect(csp).toContain(
        `frame-src 'self' *.wtwco.com ${config.value.RECAPTCHA_URL} *.${config.value.GENESYS_DOMAIN} ${config.value.VIDEO_RESOURCES} ${config.value.SHYRKA_URL}`,
      );
    });
  });

  describe('setCSPHeader', () => {
    it('should set CSP header in non-development environment', () => {
      const mockRes = {
        headersSent: false,
        setHeader: jest.fn(),
      };
      const csp = "default-src 'self'";
      const isDevelopment = false;

      setCSPHeader(mockRes, csp, isDevelopment);

      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Security-Policy', csp);
    });

    it('should not set CSP header in development environment', () => {
      const mockRes = {
        headersSent: false,
        setHeader: jest.fn(),
      };
      const csp = "default-src 'self'";
      const isDevelopment = true;

      setCSPHeader(mockRes, csp, isDevelopment);

      expect(mockRes.setHeader).not.toHaveBeenCalled();
    });

    it('should not set CSP header if headers are already sent', () => {
      const mockRes = {
        headersSent: true,
        setHeader: jest.fn(),
      };
      const csp = "default-src 'self'";
      const isDevelopment = false;

      setCSPHeader(mockRes, csp, isDevelopment);

      expect(mockRes.setHeader).not.toHaveBeenCalled();
    });
  });
});
