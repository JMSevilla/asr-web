import { Box, List, ListItem, Typography } from '@mui/material';
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { AnimatedArrowIcon } from '../..';
import { useResolution } from '../../../core/hooks/useResolution';
import { useScroll } from '../../../core/hooks/useScroll';
import { PageMenuMobile } from './PageMenuMobile';
import { useUpdateBlockInViewOnScroll } from './hooks';
import { PageMenuItem } from './types';

interface Props {
  id?: string;
  items: PageMenuItem[];
}

export const PageMenuBlock: React.FC<Props> = ({ id = 'page-menu', items }) => {
  const scroll = useScroll();
  const { isMobile } = useResolution();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const [gradualActiveBlockIndex, activeBlockIndex, updateBlockIndex] = useUpdateBlockInViewOnScroll(items);

  useEffect(() => {
    if (isMobile && menuOpen) {
      scroll.disableScroll();
      return;
    }
    scroll.enableScroll();
  }, [menuOpen, isMobile, scroll]);

  if (!items.length) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <Box data-testid="page-menu-button" height={menuButtonRef.current?.clientHeight} />
        <Box
          ref={menuButtonRef}
          position="fixed"
          left={0}
          right={0}
          top={theme => `calc(${theme.sizes.mobileHeaderHeight} + 1px)`}
          px={theme => `calc(${theme.sizes.mobileContentPaddingX} + ${theme.spacing(2)})`}
          py={4}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="background.default"
          zIndex={2}
          borderBottom={theme => `1px solid ${theme.palette.divider}`}
          onClick={() => setMenuOpen(o => !o)}
        >
          <Typography variant="body2">{items[activeBlockIndex]?.value.value}</Typography>
          <AnimatedArrowIcon open={menuOpen} />
        </Box>
        <PageMenuMobile
          items={items}
          open={menuOpen}
          blockInViewIndex={activeBlockIndex}
          anchorEl={menuButtonRef.current}
          onClosed={() => setMenuOpen(false)}
          onItemClicked={handleItemClick}
        />
      </>
    );
  }

  return (
    <List
      data-testid="page-menu"
      id={id}
      sx={{ position: 'sticky', top: 0, left: 0, pt: 10, transition: theme => theme.transitions.create('top') }}
    >
      {items.map((item, idx) => (
        <ListItem
          key={idx}
          sx={{
            px: 6,
            py: 4,
            cursor: 'pointer',
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
            borderLeftColor: idx === gradualActiveBlockIndex ? 'appColors.primary' : 'transparent',
            transition: theme => theme.transitions.create('border-color', { duration: 300, easing: 'ease-in-out' }),
          }}
          tabIndex={0}
          divider={idx !== items.length - 1}
          onClick={e => handleItemClick(e, idx)}
          onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && handleItemClick(e, idx)}
        >
          <Typography
            variant="body2"
            component="a"
            color="inherit"
            sx={{ textDecoration: 'none' }}
            href={'#' + item.key.value}
          >
            {item.value.value}
          </Typography>
        </ListItem>
      ))}
    </List>
  );

  function handleItemClick(e: MouseEvent | KeyboardEvent, index: number) {
    e.preventDefault();
    updateBlockIndex(index);
  }
};
