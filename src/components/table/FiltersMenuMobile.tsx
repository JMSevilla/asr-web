import { Grid, Grow, Paper, Popper, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { BackButton } from '../BackButton';
import { PrimaryButton, TextButton } from '../buttons';

interface Props {
  open: boolean;
  filters: ReactNode[];
  labelPrefix?: string;
  onClosed(): void;
  onFiltersApplied(): void;
  onFiltersCleared(): void;
}

export const FiltersMenuMobile: React.FC<Props> = ({
  open,
  filters,
  labelPrefix,
  onFiltersCleared,
  onFiltersApplied,
  onClosed,
}) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Popper
      open={open}
      role="menu"
      placement="bottom-end"
      transition
      disablePortal
      popperOptions={{ strategy: 'absolute' }}
      modifiers={[
        {
          name: 'whole-page',
          fn: () => {},
          enabled: true,
          phase: 'main',
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            offset: '0px, 0px, 0px, 0px',
            overflow: 'hidden',
          },
        },
      ]}
      style={{ zIndex: 1 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
          <Paper
            sx={{
              top: 0,
              mt: theme => theme.sizes.mobileHeaderHeight,
              pt: 5,
              height: theme => `calc(100vh - ${theme.sizes.mobileHeaderHeight})`,
              overflowY: 'scroll',
              boxShadow: 'unset',
            }}
          >
            <Grid
              container
              width="100vw"
              maxWidth="100vw"
              px={theme => theme.sizes.mobileContentPaddingX}
              rowSpacing={12}
            >
              <Grid item xs={12}>
                <BackButton label={labelByKey(`${labelPrefix}filters_back`)} onClick={onClosed} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" fontWeight="bold">
                  {labelByKey(`${labelPrefix}filters`)}
                </Typography>
              </Grid>
              {filters.map((filter, idx) => (
                <Grid key={idx} item xs={12}>
                  {filter}
                </Grid>
              ))}
              <Grid item xs={12}>
                <PrimaryButton fullWidth onClick={applyFilters}>
                  {labelByKey(`${labelPrefix}filters_apply`)}
                </PrimaryButton>
              </Grid>
              <Grid item xs={12}>
                <TextButton fullWidth onClick={clearFilters}>
                  {labelByKey(`${labelPrefix}filters_clear`)}
                </TextButton>
              </Grid>
            </Grid>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  function applyFilters() {
    onFiltersApplied();
    onClosed();
  }

  function clearFilters() {
    onFiltersCleared();
    onClosed();
  }
};
