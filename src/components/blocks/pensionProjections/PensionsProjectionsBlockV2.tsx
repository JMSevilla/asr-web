import { Grid } from '@mui/material';
import { ComponentLoader } from '../..';
import { findValueByKey } from '../../../business/find-in-array';
import { normalizeRetirementDate } from '../../../business/retirement';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedApi } from '../../../core/hooks/useCachedApi';
import { PensionProjectionsV2 } from './shared/pensionProjectionsV2';

interface Props {
  id?: string;
  parameters: {
    key: string;
    value: string;
  }[];
}

export const PensionsProjectionsBlockV2: React.FC<Props> = ({ id, parameters }) => {
  const { retirementCalculationLoading, retirementCalculation } = useRetirementContext();
  const { membership } = useContentDataContext();
  const retirementDate = useApi(async api => normalizeRetirementDate((await api.mdp.retirementDate()).data));
  const timeToRetirement = useCachedApi(api => api.mdp.userTimeToRetirement(), 'time-to-retirement');
  const lineAges = useCachedApi(api => api.mdp.lineAges(), 'line-ages');
  const hideExploreOptions = findValueByKey('hide_explore_options', parameters) === 'true';
  const showAtDate = findValueByKey('show_at_date', parameters) === 'true';

  if (
    !timeToRetirement.result ||
    timeToRetirement.loading ||
    lineAges.loading ||
    retirementCalculationLoading ||
    retirementDate.loading
  ) {
    return <ComponentLoader />;
  }

  if (!retirementCalculation) {
    return null;
  }

  return (
    <Grid id={id} data-testid="pension_projections_v2">
      <PensionProjectionsV2
        timeToRetirement={timeToRetirement.result}
        totalAVCFund={retirementCalculation.totalAVCFund}
        totalPension={retirementCalculation.totalPension}
        ageLines={lineAges.result?.ageLines ?? []}
        normalRetirementAge={membership?.normalRetirementAge}
        hideExploreOptions={hideExploreOptions}
        showAtDate={showAtDate}
        retirementDate={retirementDate.result?.retirementDate ?? ''}
      />
    </Grid>
  );
};
