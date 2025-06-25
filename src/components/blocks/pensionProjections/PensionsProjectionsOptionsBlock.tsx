import { Box } from '@mui/material';
import React from 'react';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useApi } from '../../../core/hooks/useApi';
import { ComponentLoader } from '../../loaders';
import { PensionsProjectionsOptions } from './shared/PensionsProjectionsOptions';

interface Props {
  id?: string;
}

export const PensionProjectionsOptionsBlock: React.FC<Props> = ({ id }) => {
  const lineAges = useApi(api => api.mdp.lineAges());
  const { membership } = useContentDataContext();

  if (lineAges.loading) {
    return <ComponentLoader />;
  }

  return (
    <Box id={id} mb={4} data-testid="pension_projections_options">
      <PensionsProjectionsOptions
        ages={lineAges.result?.data.ageLines ?? []}
        normalRetirementAge={membership?.normalRetirementAge}
      />
    </Box>
  );
};
