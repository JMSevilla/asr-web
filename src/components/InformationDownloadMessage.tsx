import { Button, Grid, Typography, useTheme } from '@mui/material';
import { useGlobalsContext } from '../core/contexts/GlobalsContext';
import { DownloadIcon } from './icons';

interface Props {
  id?: string;
  onClick: () => void;
  onDownload: () => void;
  titleKey: string;
  descriptionKey: string;
  downloadKey: string;
  buttonKey: string;
}

export const InformationDownloadMessage: React.FC<Props> = ({
  id,
  onClick,
  onDownload,
  titleKey,
  descriptionKey,
  downloadKey,
  buttonKey,
}) => {
  const theme = useTheme();

  const { labelByKey, htmlByKey } = useGlobalsContext();

  return (
    <Grid
      id={id}
      width="100%"
      data-testid="information-component"
      container
      direction="column"
      p={6}
      sx={{
        color: theme => theme.palette.primary.main,
        position: 'relative',
        borderRadius: '16px',
        backgroundColor: theme => theme.palette.primary.light,
      }}
    >
      <Grid item pl={3} mb={4}>
        <Typography variant="body1" fontWeight="bold" component="h2">
          {labelByKey(titleKey)}
        </Typography>
      </Grid>
      <Grid item pl={3} mb={4}>
        {htmlByKey(descriptionKey)}
      </Grid>
      <Grid item container pl={3} direction="column" my={8}>
        <Grid
          tabIndex={0}
          area-label={labelByKey(downloadKey)}
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{
            borderTop: theme => `1px solid ${theme.palette.appColors.support60.light}`,
            pt: 3,
            pb: 3,
            borderBottom: theme => `1px solid ${theme.palette.appColors.support60.light}`,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: theme => theme.palette.primary.light,
            },
          }}
          item
          onClick={onDownload}
          onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && onDownload()}
        >
          <Grid item>
            <Typography variant="body2" fontWeight="bold">
              {labelByKey(downloadKey)}
            </Typography>
          </Grid>
          <Grid item display="flex" flexWrap="nowrap">
            <Grid container alignItems="center">
              <DownloadIcon customColor={theme.palette.primary.main} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container pl={3} spacing={1}>
        <Grid item xs={12}>
          <Button
            fullWidth
            sx={{
              border: '2px solid ',
              padding: 2,
              fontWeight: 600,
              borderColor: theme => theme.palette.primary.main,
              color: theme => theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme => theme.palette.primary.main,
                color: theme => theme.palette.common.white,
              },
            }}
            onClick={onClick}
          >
            {labelByKey(buttonKey)}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
