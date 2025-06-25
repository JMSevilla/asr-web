import { config } from "../config";
import { AUTH_METHODS, AuthMethod } from "./contexts/auth/types";

interface GetAuthMethodParams {
  path: string;
  referrer?: string | null;
  currentMethod?: AuthMethod;
}

const AUTH_PATH_PATTERNS = {
  SINGLE_AUTH: (config.value.SINGLE_AUTH_PATHS || '').split(';').filter(Boolean),
  OPENAM: (config.value.OPENAM_PATHS || '').split(';').filter(Boolean),
};

const SINGLE_AUTH_DOMAINS = (config.value.SINGLE_AUTH_DOMAINS || ';').split(';').filter(Boolean);

/**
 * @description
 * Determines the appropriate authentication method based on the current path,
 * referrer, and existing authentication context.
 * 
 * The selection process follows this priority:
 * 1. Single Auth paths take highest precedence
 * 2. OpenAM paths are checked next
 * 3. Single Auth referrer domains 
 * 4. Existing authentication method is preserved if present
 * 5. Defaults to OpenAM if no other conditions are met
 * 
 * These rules are validated in auth-method-rules.test.ts
 * 
 * @param {GetAuthMethodParams} params - The parameters for auth method selection
 * @param {string} params.path - The current URL path
 * @param {string | null} [params.referrer] - The referring URL
 * @param {AuthMethod} [params.currentMethod] - The current authentication method
 * @returns {AuthMethod} The selected authentication method
 */
export function selectAuthMethod({ path, referrer, currentMethod }: GetAuthMethodParams): AuthMethod {
  if (isSingleAuthPath(path)) {
    return AUTH_METHODS.SINGLE_AUTH;
  }

  if (isOpenAmPath(path)) {
    return AUTH_METHODS.OPENAM;
  }

  // Single auth logout also goes through the Single Auth domain and we always want to default to OpenAM on logout. 
  // Therefore, this rule will only be checked after the URL paths.
  if (isSingleAuthReferrer(referrer)) {
    return AUTH_METHODS.SINGLE_AUTH;
  }

  if (currentMethod !== undefined) {
    return currentMethod;
  }

  return AUTH_METHODS.OPENAM;
}

export function matchesPattern(path: string, patterns: readonly string[]): boolean {
  return patterns.some(pattern => path.includes(pattern));
}

export function isSingleAuthPath(path: string): boolean {
  return matchesPattern(path, AUTH_PATH_PATTERNS.SINGLE_AUTH);
}

export function isOpenAmPath(path: string): boolean {
  return !isSingleAuthPath(path) && matchesPattern(path, AUTH_PATH_PATTERNS.OPENAM);
}

export function isSingleAuthReferrer(referrer?: string | null): boolean {
  return referrer ? matchesPattern(referrer, SINGLE_AUTH_DOMAINS) : false;
}
