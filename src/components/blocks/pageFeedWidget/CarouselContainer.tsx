import { Box, Grid, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Pagination } from 'swiper';
import { Swiper, useSwiper } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { useResolution } from '../../../core/hooks/useResolution';
import { CarouselNextIcon, CarouselPrevIcon } from '../../icons';

interface Props {
  header?: string;
  length: number;
  children?: ReactNode;
  'data-testid'?: string;
}

export const CarouselContainer: React.FC<Props> = ({ header, length, children, ...props }) => {
  const theme = useTheme();
  const { isMobile } = useResolution();

  const swiperStyles = {
    '.swiper': {
      padding: isMobile ? '0px 10px 118px 10px' : '0px 10px 78px 10px',
      margin: '0 -10px -30px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'column-reverse',
    },
    '.swiper-pagination': {
      bottom: isMobile ? '53px' : '10px',
    },
  };

  return (
    <Box id="page-feed-carousel" data-testid={props['data-testid']} width="100%" sx={swiperStyles}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={isMobile ? 1 : 3}
        slidesPerGroup={1}
        loop={true}
        pagination={{
          clickable: true,
          el: undefined,
          dynamicBullets: false,
          renderBullet: function (_, className) {
            return ReactDOMServer.renderToStaticMarkup(
              <Box
                component="span"
                style={{
                  // @ts-ignore
                  '--swiper-pagination-bullet-size': '20px',
                  '--swiper-pagination-bullet-inactive-color': theme.palette.appColors.incidental['075'],
                  '--swiper-pagination-color': theme.palette.appColors.primary,
                }}
                className={className}
              />,
            );
          },
        }}
      >
        <Grid container display="flex" mb={isMobile ? 0 : 6} position="relative">
          {header && !isMobile && (
            <Grid item xs={10}>
              <Typography variant="h2">{header}</Typography>
            </Grid>
          )}
          {length > 2 && (
            <Grid
              item
              xs={isMobile || !header ? 12 : 2}
              container
              justifyContent={isMobile ? 'center' : 'flex-end'}
              sx={
                isMobile
                  ? {
                      position: 'absolute',
                      top: '78px',
                    }
                  : {}
              }
            >
              <SlidePreviousButton />
              <SlideNextButton />
            </Grid>
          )}
        </Grid>
        {children}
      </Swiper>
    </Box>
  );
};

function SlideNextButton() {
  const swiper = useSwiper();

  return (
    <Box
      width={36}
      height={36}
      onClick={() => swiper.slideNext()}
      sx={{ '&:hover': { cursor: 'pointer' } }}
      data-testid="next-slide"
    >
      <CarouselNextIcon />
    </Box>
  );
}
function SlidePreviousButton() {
  const swiper = useSwiper();

  return (
    <Box
      width={36}
      height={36}
      mr={4}
      onClick={() => swiper.slidePrev()}
      sx={{ '&:hover': { cursor: 'pointer' } }}
      data-testid="previous-slide"
    >
      <CarouselPrevIcon />
    </Box>
  );
}
