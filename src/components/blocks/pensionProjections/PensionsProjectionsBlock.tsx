import { Box, Grid } from '@mui/material';
import { ComponentLoader, PrimaryButton } from '../..';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedApi } from '../../../core/hooks/useCachedApi';
import { useRouter } from '../../../core/router';
import { PensionProjections } from './shared/PensionProjections';

interface Props {
  id?: string;
}

export const PensionsProjectionsBlock: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { labelByKey, messageByKey } = useGlobalsContext();
  const { retirementCalculationLoading, retirementCalculation } = useRetirementContext();
  const { membership } = useContentDataContext();
  const timeToRetirement = useCachedApi(api => api.mdp.userTimeToRetirement(), 'time-to-retirement');
  const lineAges = useApi(api => api.mdp.lineAges());

  if (!timeToRetirement.result || timeToRetirement.loading || lineAges.loading || retirementCalculationLoading) {
    return <ComponentLoader />;
  }

  if (!retirementCalculation) {
    return null;
  }

  return (
    <Box
      id={id}
      p={12}
      mb={4}
      sx={{ backgroundColor: 'appColors.support80.transparentLight' }}
      data-testid="pension_projections"
    >
      <Grid
        container
        spacing={6}
        mb={{ md: 12, xs: 0 }}
        wrap="nowrap"
        sx={{ flexDirection: { xs: 'column', md: 'row' } }}
      >
        <PensionProjections
          currentMemberAge={membership?.floorRoundedAge}
          timeToRetirement={timeToRetirement.result}
          totalAVCFund={retirementCalculation.totalAVCFund}
          totalPension={retirementCalculation.totalPension}
          ageLines={lineAges.result?.data?.ageLines ?? []}
          normalRetirementAge={membership?.normalRetirementAge}
        />
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} mb={13}>
          {messageByKey('quote_disclaimer')}
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PrimaryButton
            onClick={handleViewOptionsClick}
            loading={router.loading}
            data-testid="pensions-projections-view-options"
          >
            {labelByKey('pension_proj_view_options')}
          </PrimaryButton>
        </Grid>
      </Grid>
    </Box>
  );

  async function handleViewOptionsClick() {
    await router.parseUrlAndPush('options_breakdown');
  }
};
