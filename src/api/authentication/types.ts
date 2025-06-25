export interface LoginParams {
  userName: string;
  password: string;
  businessGroups?: string[];
  realm: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SsoSessionParams {
  tokenId: string;
  realm: string;
  cookieName: string;
}

export interface SsoResponse {
  accessToken: string;
}

export interface LogoutParams {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshParams {
  accessToken: string;
  refreshToken: string;
}

export interface SwitchUserParams {
  referenceNumber: string;
  businessGroup: string;
}

export interface SwitchUserResponse {
  accessToken: string;
  refreshToken: string;
}