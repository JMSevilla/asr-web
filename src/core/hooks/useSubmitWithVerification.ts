import { useApiCallback } from '../../core/hooks/useApi';
import { generateNonce } from '../../utils/nonce';
import { verifyData } from '../../utils/verification';
import { Api } from '../../api/api';

type SubmitCallback<T> = (api: Api, args: T, nonce: string) => Promise<any>;

export const useSubmitWithVerification = <T,>(
  submitCallback: SubmitCallback<T>,
  updateToken: () => void
) => {
  return useApiCallback(async (api: Api, args: T) => {
    const nonce = generateNonce();
    const result = await submitCallback(api, args, nonce);
    const isVerified = await verifyData(result, nonce);

    if (isVerified) {
      updateToken();
      return result;
    }

    throw new Error('Verification failed');
  });
};
