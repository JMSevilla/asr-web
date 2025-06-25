import { Grid } from '@mui/material';
import { ListLoader } from '../..';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useResolution } from '../../../core/hooks/useResolution';
import { PercentageBox } from './PercentageBox';

interface Props {
  id?: string;
  formKey: string;
}

export const LTAUsedPercentageBlock: React.FC<Props> = ({ id, formKey }) => {
  const { cmsTokens, loading } = useContentDataContext();
  const { htmlByKey } = useGlobalsContext();
  const { isMobile } = useResolution();

  if (loading) {
    return <ListLoader id={id} loadersCount={2} data-testid="lta-used-percentage-loader" />;
  }

  if (!cmsTokens) {
    return null;
  }

  return (
    <Grid id={id} container spacing={4} direction={isMobile ? 'column' : 'row'} data-testid="lta-used-percentage-block">
      <Grid item xs={12} md={6} lg={4}>
        <PercentageBox
          percentage={cmsTokens.chosenLtaPercentage ?? 0}
          roundedLeft={!isMobile}
          roundedTop={isMobile}
          bgcolor="appColors.support60.transparentLight"
        >
          {htmlByKey(`${formKey}_left_text`)}
        </PercentageBox>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <PercentageBox
          percentage={cmsTokens.remainingLtaPercentage ?? 0}
          roundedRight={!isMobile}
          roundedBottom={isMobile}
          bgcolor="appColors.support80.transparentLight"
        >
          {htmlByKey(`${formKey}_right_text`)}
        </PercentageBox>
      </Grid>
    </Grid>
  );
};
