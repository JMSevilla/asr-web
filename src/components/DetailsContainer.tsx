import { Box, Grid, Typography } from '@mui/material';
import { TwoColumnBlockLoader } from '.';

interface Props {
  id?: string;
  title?: string;
  bgcolor?: string;
  noBorder?: boolean;
  fullHeight?: boolean;
  actionsRow?: React.ReactNode;
  actionButton?: React.ReactNode;
  isLoading?: boolean;
}

export const DetailsContainer: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  title,
  bgcolor,
  noBorder,
  fullHeight,
  actionButton,
  actionsRow,
  isLoading,
  children,
}) => (
  <Box id={id} height={fullHeight ? '100%' : 'unset'} component="section" className="panel">
    {title && (
      <Box mb={6} component="header" className="panel-header">
        <Typography variant="h2">{title}</Typography>
      </Box>
    )}
    {isLoading ? (
      <TwoColumnBlockLoader />
    ) : (
      <>
        <Grid
          container
          pr={12}
          pl={6}
          pb={12}
          pt={6}
          mt={0}
          ml={0}
          maxWidth="100%"
          height={fullHeight ? '100%' : 'unset'}
          border={noBorder ? 'unset' : 2}
          borderBottom={actionsRow ? 0 : 'auto'}
          borderColor="appColors.secondary.transparentDark"
          bgcolor={bgcolor}
          component="div"
          className="panel-content"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={6}
        >
          <Grid item flex={1} container rowSpacing={6} alignItems="flex-start">
            {children}
          </Grid>
          {actionButton && (
            <Grid item mr={-5}>
              {actionButton}
            </Grid>
          )}
        </Grid>
        {actionsRow && (
          <Box
            border={2}
            borderTop={0}
            borderColor="appColors.secondary.transparentDark"
            bgcolor="appColors.support80.transparentLight"
            px={12}
            py={6}
          >
            {actionsRow}
          </Box>
        )}
      </>
    )}
  </Box>
);
