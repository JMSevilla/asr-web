import { Grid } from '@mui/material';
import { PrimaryButton } from '../../..';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';

interface Props {
  id?: string;
  onComplete: () => void;
  loading: boolean;
}

export const JourneyEnding: React.FC<Props> = ({ id, onComplete, loading }) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Grid id={id} container direction="column" spacing={4}>
      <Grid item>
        <PrimaryButton
          onClick={onComplete}
          loading={loading}
          data-mdp-key="retirement_end_button"
          data-testid="retirement_end_button"
        >
          {labelByKey('retirement_end_button')}
        </PrimaryButton>
      </Grid>
    </Grid>
  );
};
