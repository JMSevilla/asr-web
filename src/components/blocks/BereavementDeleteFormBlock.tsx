import React, { useEffect } from 'react';
import { useBereavementSession } from '../../core/contexts/bereavement/BereavementSessionContext';

export const BereavementDeleteFormBlock: React.FC = () => {
  const { bereavementDelete } = useBereavementSession();

  useEffect(() => {
    bereavementDelete();
  }, []);

  return null;
};
