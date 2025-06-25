import { ReactNode } from 'react';
import { useSwiper } from 'swiper/react';
import { CarouselContainer } from '../../../components/blocks/pageFeedWidget/CarouselContainer';
import { act, render, screen, userEvent } from '../../common';

const DEFAULT_PROPS: React.ComponentProps<typeof CarouselContainer> = {
  header: 'Carousel Container Header',
  length: 3,
  children: 'children-content',
  ['data-testid']: 'carousel-container-test-id',
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/hooks/useResolution', () => ({
  useResolution: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div data-testid="swiper-testid">{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div data-testid="swiper-slide-testid">{children}</div>,
  useSwiper: jest.fn(),
}));

describe('CarouselContainer', () => {
  it('renders CarouselContainer component', () => {
    render(<CarouselContainer {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('carousel-container-test-id')).toBeTruthy();
    expect(screen.queryByText('Carousel Container Header')).toBeInTheDocument();
    expect(screen.queryByText('children-content')).toBeInTheDocument();
  });
  it('should  render Slider prev/next slide buttons ', async () => {
    const nextClickFn = jest.fn();
    const prevClickFn = jest.fn();
    jest.mocked(useSwiper).mockReturnValue({ slidePrev: prevClickFn, slideNext: nextClickFn } as any);
    render(<CarouselContainer {...DEFAULT_PROPS} />);
    const nextSlideBtn = screen.queryByTestId('next-slide');
    const previousSlideBtn = screen.queryByTestId('previous-slide');
    expect(nextSlideBtn).toBeTruthy();
    expect(previousSlideBtn).toBeTruthy();
    await act(async () => {
      nextSlideBtn && (await userEvent.click(nextSlideBtn));
    });
    await act(async () => {
      previousSlideBtn && (await userEvent.click(previousSlideBtn));
    });
    expect(nextClickFn).toBeCalled();
    expect(prevClickFn).toBeCalled();
  });
});
