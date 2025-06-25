import { logger } from '../../core/datadog-logs';
import {
  conversationCleared,
  deleteGenesysChatStorage,
  isButtonLabelNotFound,
  isScriptLoaded,
  isWebChatActive,
  setupGenesysGlobals,
} from '../../core/genesys';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: {
    get value() {
      return {};
    },
  },
}));

jest.mock('../../core/datadog-logs', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

declare global {
  interface Window {
    Genesys: any;
  }
}

describe('Genesys Integration Tests', () => {
  let originalWindow: any;

  beforeEach(() => {
    originalWindow = { ...global.window };
  });

  afterEach(() => {
    global.window = originalWindow;
    jest.clearAllMocks();
  });

  describe('setupGenesysGlobals', () => {
    it('should not set globals when window is undefined', () => {
      const mockConfig = { environment: 'dev', deploymentId: '123', debug: true };
      delete (global as any).window;

      setupGenesysGlobals(mockConfig);
      expect(global.window).toBeUndefined();
      global.window = originalWindow;
    });

    it('should set Genesys globals when window is defined', () => {
      const mockConfig = { environment: 'dev', deploymentId: '123', debug: true };
      const mockGenesys = jest.fn();
      (global as any).window = { Genesys: mockGenesys };

      setupGenesysGlobals(mockConfig);
      expect(global.window.Genesys).toBeDefined();
      expect(typeof global.window.Genesys).toBe('function');
      expect(global.window.Genesys).toEqual(expect.any(Function));
      expect(global.window.Genesys.c).toEqual(mockConfig);
    });
  });

  describe('isScriptLoaded', () => {
    it('should return true if script is loaded', () => {
      document.body.innerHTML = '<script src="test.js"></script>';
      expect(isScriptLoaded('test.js')).toBe(true);
    });

    it('should return false if script is not loaded', () => {
      document.body.innerHTML = '';
      expect(isScriptLoaded('test.js')).toBe(false);
    });
  });

  describe('isButtonLabelNotFound', () => {
    it('should return true if label contains [[', () => {
      expect(isButtonLabelNotFound('[[')).toBe(true);
    });

    it('should return false if label does not contain [[', () => {
      expect(isButtonLabelNotFound('Hello')).toBe(false);
    });
  });

  describe('isWebChatActive', () => {
    it('should return true if webchat is active', () => {
      localStorage.setItem('test:gcmcsessionActive', 'true');
      expect(isWebChatActive()).toBe(true);
    });
  });

  describe('deleteGenesysChatStorage', () => {
    it('should remove Genesys chat storage', () => {
      localStorage.setItem('_actmu', 'true');
      localStorage.setItem('test:gcmcsession', 'session');

      deleteGenesysChatStorage();

      expect(localStorage.getItem('_actmu')).toBeNull();
      expect(localStorage.getItem('test:gcmcsession')).toBeNull();
    });
  });

  describe('conversationCleared', () => {
    it('should resolve when conversation is cleared', async () => {
      (global as any).window = { Genesys: jest.fn((_, __, callback) => callback()) };

      await expect(conversationCleared()).resolves.toBeUndefined();
    });

    it('should reject on error', async () => {
      const error = new Error('Subscription failed');
      (global as any).window = {
        Genesys: jest.fn().mockImplementation(() => {
          throw error;
        }),
      };

      await expect(conversationCleared()).rejects.toThrow('Subscription failed');
      expect(logger.error).toHaveBeenCalledWith('Error during conversationCleared', error);
    });
  });
});
