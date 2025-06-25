import { Grid, Typography } from '@mui/material';
import { ContentButtonBlock, ListLoader } from '../..';
import { ParsedButtonProps } from '../../../cms/parse-cms';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { AvcTransferTotal } from './AvcTransferTotal';

interface Props {
  id: string;
  prefix?: string;
  headerKey?: string;
  isMessage?: boolean;
  buttons: ParsedButtonProps[];
}
export const GuaranteedTransferMessageBlock: React.FC<Props> = ({ id, prefix, buttons, headerKey, isMessage }) => {
  const { membership } = useContentDataContext();
  const { transferOptions, transferOptionsLoading } = useRetirementContext();
  const { labelByKey } = useGlobalsContext();
  const header = headerKey && labelByKey(headerKey);

  if (transferOptionsLoading) {
    return <ListLoader id={id} loadersCount={2} spacing={6} />;
  }

  return (
    <Grid
      id={id}
      data-testid={id}
      container
      pl={6}
      sx={{
        color: theme => theme.palette.primary.main,
        position: 'relative',
        borderRadius: '16px',
        backgroundColor: theme => theme.palette.primary.light,
      }}
    >
      <Grid item xs={12} my={6}>
        <Typography variant="h3" component="h2">
          {header}
        </Typography>
      </Grid>
      <Grid item xs={12} mb={6}>
        <AvcTransferTotal
          totalGuaranteedTransferValue={transferOptions?.totalGuaranteedTransferValue ?? 0}
          totalTransferValue={transferOptions?.totalTransferValue ?? 0}
          totalNonGuaranteedTransferValue={transferOptions?.totalNonGuaranteedTransferValue ?? 0}
          prefix={prefix}
          isMessage={isMessage}
          hideNonGuaranteed={!membership?.hasAdditionalContributions}
        />
      </Grid>
      {!!buttons.length && (
        <Grid item xs={12} mr={6}>
          <Grid
            item
            container
            xs={12}
            mb={6}
            sx={{
              borderTop: theme => `1px solid ${theme.palette.appColors.support60.light}`,
              pt: 3,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme => theme.palette.primary.light,
              },
              '> div:not(:last-child)': {
                mb: 4,
              },
            }}
          >
            {buttons.map((button, index) => (
              <Grid item key={index} width={`100%`}>
                <ContentButtonBlock {...button} widthPercentage={100} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
