import { AxiosResponse } from "axios";
import { Api } from "../../../api/api";
import { SwitchUserParams, SwitchUserResponse } from "../../../api/authentication/types";
import { LinkedMember } from "../../../api/mdp/types";

export type UserData = {
  userName: string;
  password: string;
  businessGroups?: string[];
} & UserDataArgs;

export type SsoUserData = {
  tokenId: string;
} & UserDataArgs;

export type UserDataArgs = {
  newlyRetiredRange: number;
  preRetirementAgePeriod: number;
};

export type SoftLogoutOptions = {
  clearChat?: boolean;
};

export type LoginOptions = {
  userName?: string;
  password?: string;
  email?: string;
  cancelUri?: string;
  onError?: () => void;
};

export type LogoutOptions = {
  onError?: () => void;
  postLogoutRedirectUri?: string;
};

export type RegisterOptions = {
  email?: string;
  overrideClientCountryId?: string;
  cancelUri?: string;
  onError?: () => void;
};

export type AuthService = {
  loading: boolean;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  isSingleAuth: boolean;
  linkedMembers?: LinkedMember[];
  login: (options: LoginOptions) => Promise<void>;
  loginFromSso(userData: SsoUserData): Promise<AxiosResponse>;
  logout: (options?: LogoutOptions) => Promise<void>;
  register: (options?: RegisterOptions) => Promise<void>;
  softLogout: (options?: SoftLogoutOptions) => Promise<void>;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAuthTasksRunning: (isAuthTasksRunning: boolean) => void;
  switchUser(api: Api, params: SwitchUserParams): Promise<AxiosResponse<SwitchUserResponse>>;
};

export type AuthInstance = {
  type: string;
  instance: any;
};

export const AUTH_METHODS = {
  SINGLE_AUTH: 'SINGLE_AUTH',
  OPENAM: 'OPENAM',
} as const;

export type AuthMethod = typeof AUTH_METHODS[keyof typeof AUTH_METHODS] | undefined;
