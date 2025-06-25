import { config } from "../../../../config";

export const policies = {
  login: config.value.SINGLE_AUTH_POLICY_SIGNIN,
  register: config.value.SINGLE_AUTH_POLICY_SIGNUP,
};

export const urls = {
  logout: config.value.SINGLE_AUTH_URL_LOGOUT || '/sa/logout',
  cancel: config.value.SINGLE_AUTH_URL_POST_LOGOUT || '/login',
  error: config.value.SINGLE_AUTH_URL_ERROR || '/error',
  signin_holding: config.value.SINGLE_AUTH_URL_SIGNIN_HOLDING || '/sa/sign-in/holding',
  signup_holding: config.value.SINGLE_AUTH_URL_SIGNUP_HOLDING || '/sa/register/holding',
  landing: '/hub',
}

export const authorityUrl = config.value.SINGLE_AUTH_URL_AUTHORITY

export const authHeaders = {
  bgroup: 'auth-business-group',
  refno: 'auth-reference-number',
};

