import { Grid, Typography } from '@mui/material';

interface Props {
  percentage: number;
  bgcolor: string;
  roundedTop?: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  roundedBottom?: boolean;
}

export const PercentageBox: React.FC<React.PropsWithChildren<Props>> = ({
  percentage,
  bgcolor,
  roundedLeft,
  roundedRight,
  roundedTop,
  roundedBottom,
  children,
}) => {
  return (
    <Grid
      container
      pt={6}
      px={6}
      pb={8}
      spacing={3}
      height="100%"
      bgcolor={bgcolor}
      sx={{
        borderTopLeftRadius: roundedLeft || roundedTop ? 16 : 0,
        borderBottomLeftRadius: roundedLeft || roundedBottom ? 16 : 0,
        borderTopRightRadius: roundedRight || roundedTop ? 16 : 0,
        borderBottomRightRadius: roundedRight || roundedBottom ? 16 : 0,
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h1">{percentage}%</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" component="div">
          {children}
        </Typography>
      </Grid>
    </Grid>
  );
};
