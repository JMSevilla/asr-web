import { Box, Divider, Grid, Typography } from '@mui/material';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { AnimatedBoxSkeleton, AnimatedParagraphSkeleton } from '../animations';

interface Props {
  pageHeader?: string;
}

export const CalculationsPageLoader: React.FC<Props> = ({ pageHeader }) => {
  const { preloadedLabelByKey } = useGlobalsContext();

  return (
    <Box display="flex" flexDirection="column" flexWrap="nowrap">
      {pageHeader && (
        <Box mb={8}>
          <Typography variant="h1">{pageHeader}</Typography>
        </Box>
      )}
      <Grid container rowSpacing={20} justifyContent="space-between" mb={20}>
        <Grid item xs={12}>
          <AnimatedBoxSkeleton height={{ xs: 513, md: 265 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="appColors.tertiary.dark"
              textAlign="center"
              px={7}
              sx={{ flex: { xs: 1, md: 0.4 } }}
            >
              {preloadedLabelByKey('calculating_pension_options')}
            </Typography>
          </AnimatedBoxSkeleton>
        </Grid>
        <AnimatedParagraphSkeleton xs={12} md={6} />
        <AnimatedParagraphSkeleton xs={12} md={6} />
        <AnimatedParagraphSkeleton xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
        <AnimatedParagraphSkeleton xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <AnimatedParagraphSkeleton xs={12} md={6} />
        <AnimatedParagraphSkeleton xs={12} md={6} />
      </Grid>
    </Box>
  );
};
