import { useClearCookies } from '../../core/hooks/useClearCookies';
import { renderHook } from '../common';

jest.mock('../../config', () => ({
  config: {
    value: {
      WHITELISTED_COOKIES: ['SurveyShown']
    }
  }
}));

const COOKIES = { test1: null, SurveyShownTest: null, test2: null };
const removeCookieFn = jest.fn();

jest.mock('react-cookie', () => ({
  useCookies: jest.fn().mockImplementation(() => [COOKIES, jest.fn(), removeCookieFn]),
}));

const mockDocumentCookie = 'test1=value1; SurveyShownTest=value2; test2=value3';
Object.defineProperty(document, 'cookie', {
  get: jest.fn(() => mockDocumentCookie),
  set: jest.fn(),
  configurable: true
});

Object.defineProperty(window, 'location', {
  value: {
    host: 'example.com'
  },
  writable: true
});

describe('useClearCookies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear cookie values except whitelisted ones', () => {
    const { result } = renderHook(() => useClearCookies());
    result.current[0]();

    expect(removeCookieFn).toHaveBeenCalledWith('test1', { path: '/' });
    expect(removeCookieFn).toHaveBeenCalledWith('test2', { path: '/' });
    expect(removeCookieFn).not.toHaveBeenCalledWith('SurveyShownTest', { path: '/' });

    expect(removeCookieFn).toHaveBeenCalledTimes(2);
  });
});