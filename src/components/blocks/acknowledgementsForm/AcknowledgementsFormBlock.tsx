import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAcknowledgementsContext } from '../../../core/contexts/AcknowledgementsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { CheckboxField } from '../../form';
import { acknowledgementsFormSchema, AcknowledgementsFormType } from './validation';

interface Props {
  id?: string;
}

export const AcknowledgementsFormBlock: React.FC<Props> = ({ id }) => {
  const { htmlByKey } = useGlobalsContext();
  const { isSubmitting, acknowledgements, onAcknowledgementsChanged } = useAcknowledgementsContext();
  const { membership } = useContentDataContext();
  const { control, watch } = useForm<AcknowledgementsFormType>({
    resolver: yupResolver(acknowledgementsFormSchema),
    mode: 'onChange',
    defaultValues: acknowledgements ?? acknowledgementsFormSchema.getDefault(),
    criteriaMode: 'all',
  });

  return (
    <form id={id} onChange={onSubmit} data-testid="acknowledgements-form">
      <Grid container spacing={4}>
        {!!membership?.hasAdditionalContributions && (
          <Grid item xs={12}>
            <CheckboxField
              control={control}
              name="option1"
              disabled={isSubmitting}
              label={htmlByKey('retirement_application_acknowledgements_option_1')}
            />
          </Grid>
        )}
        {!!membership?.hasAdditionalContributions && (
          <Grid item xs={12}>
            <CheckboxField
              control={control}
              name="option2"
              disabled={isSubmitting}
              label={htmlByKey('retirement_application_acknowledgements_option_2')}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <CheckboxField
            control={control}
            name="option3"
            disabled={isSubmitting}
            label={htmlByKey('retirement_application_acknowledgements_option_3')}
          />
        </Grid>
      </Grid>
    </form>
  );

  async function onSubmit() {
    onAcknowledgementsChanged(watch());
  }
};
