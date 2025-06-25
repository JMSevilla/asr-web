import { useSessionStorage } from "../../hooks/useSessionStorage";

export const useAccessToken = () => useSessionStorage<string | undefined>('accessToken', undefined);

export const useRefreshToken = () => useSessionStorage<string | undefined>('refreshToken', undefined);

export const useReturnUrl = () => useSessionStorage<string | undefined>('returnUrl', undefined);

export const useCurrentRealm = () => useSessionStorage<string | undefined>('currentRealm', undefined);
