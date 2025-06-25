import { useBereavementExpirationDateState } from './expiration';
import { useBereavementFormState } from './form';

export const useBereavementState = () => {
  const form = useBereavementFormState();
  const expiration = useBereavementExpirationDateState();

  return { form, expiration };
};
