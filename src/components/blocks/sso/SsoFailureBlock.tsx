import React from 'react';
import { ErrorBox } from '../..';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';

export const SsoFailureBlock: React.FC<{}> = () => {
  const { errorByKey } = useGlobalsContext();
  return <ErrorBox label={errorByKey('sso_failure_error')} />;
};
