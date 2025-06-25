import { AxiosInstance } from 'axios';
import {
  LoginParams,
  LoginResponse,
  LogoutParams,
  RefreshParams,
  RefreshTokenResponse,
  SsoSessionParams,
  SwitchUserParams,
  SwitchUserResponse,
} from './types';

export class AuthenticationApi {
  constructor(private readonly axios: AxiosInstance, private readonly ssrAxios: AxiosInstance) {}

  public login(params: LoginParams) {
    return this.axios.post<LoginResponse>(`/authentication-api/api/authentication/login`, params);
  }

  public refreshToken(params: RefreshParams) {
    return this.axios.post<RefreshTokenResponse>(`/authentication-api/api/authentication/refresh-token`, params);
  }

  public logout(params: LogoutParams) {
    return this.axios.post(`/authentication-api/api/authentication/logout`, params);
  }

  public createSession(params: SsoSessionParams) {
    return this.axios.post(`/authentication-api/api/sso/session/create`, params);
  }

  public keepAlive() {
    return this.axios.post(`/authentication-api/api/sso/session/keep-alive`);
  }

  public session() {
    return this.axios.get(`/authentication-api/api/sso/session`);
  }

  public switchUser(params: SwitchUserParams) {
    return this.axios.post<SwitchUserResponse>(`/authentication-api/api/authentication/switch-user`, params);
  }

  public bereavementLogin(businessGroups: string[]) {
    return this.ssrAxios.post<LoginResponse>(`/api/bereavement/login`, { businessGroup: businessGroups[0] });
  }

  public bereavementRefreshToken() {
    return this.ssrAxios.post<RefreshTokenResponse>(`/api/bereavement/refresh-token`);
  }

  public bereavementVerificationExchangeToken() {
    return this.ssrAxios.post<RefreshTokenResponse>(`/api/bereavement/verification-exchange-token`);
  }
}
