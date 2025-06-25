import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useResolution } from '../../../core/hooks/useResolution';
import { ParsedHtml } from '../../ParsedHtml';

interface Props {
  image?: string;
  id: number;
  header?: string;
  content?: string;
  buttons?: ReactNode;
}

export const CardContainer: React.FC<Props> = ({ image, id, header, content, buttons }) => {
  const { isMobile } = useResolution();

  return (
    <Card
      sx={{
        display: { xs: 'flex' },
        flexDirection: { xs: 'row', md: 'column' },
        height: { xs: '174px', md: '482px' },
        borderRadius: '4px',
        boxShadow: [
          '0px 10px 48px 0px rgba(20, 20, 20, 0.12)',
          '0px 24px 36px 0px rgba(20, 20, 20, 0.14)',
          '0px 16px 16px 0px rgba(20, 20, 20, 0.2)',
        ],
      }}
    >
      <Grid container>
        <Grid item xs={6} md={12}>
          <CardMedia
            sx={{ height: { xs: '100%', md: 180 }, width: '100%', minWidth: { xs: 'unset', md: '100%' } }}
            image={image}
            title={header ?? ''}
          />
        </Grid>
        <Grid item xs={6} md={12} sx={{ height: { xs: '100%', md: 302 } }}>
          <CardContent
            sx={{
              height: '100%',
              paddingX: { xs: 4, md: 12 },
              paddingY: 6,
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} container spacing={6} height={isMobile ? '100px' : '228px'}>
                {header && (
                  <Grid item xs={12}>
                    <Typography
                      id={`desc-card-title-${id}}`}
                      variant="h5"
                      component="h3"
                      fontWeight="700"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {header}
                    </Typography>
                  </Grid>
                )}
                {!isMobile && content && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: header ? 4 : 7,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxHeight: header ? '130px' : '200px',
                      height: header ? '130px' : '200px',
                    }}
                  >
                    <ParsedHtml html={content} />
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} component="span">
                {buttons}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};
