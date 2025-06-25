import { Box, Collapse, List, MenuItem as MuiMenuItem, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubMenuItem } from '../../../api/content/types/menu';
import { EvaIcon } from '../../EvaIcon';
import { AnimatedArrowIcon } from '../../animations';

interface AccountMenuItemProps {
  item: SubMenuItem;
  index: number | string;
  nested?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onItemClick: (item: SubMenuItem) => void;
}

export const AccountMenuItem: React.FC<AccountMenuItemProps> = ({
  item,
  index,
  nested,
  isOpen = false,
  onToggle,
  onItemClick,
}) => {
  const nestedItems = item.elements.nestedItems?.values;
  const hasNestedItems = nestedItems && nestedItems.length > 0;
  const [openNestedItemIndex, setOpenNestedItemIndex] = useState<number | null>(null);
  const menuItemRef = useRef<HTMLLIElement>(null);

  const handleDirectKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement === menuItemRef.current && (e.key === 'Enter' || e.code === 'Enter')) {
        e.preventDefault();
        if (hasNestedItems && onToggle) onToggle();
        else onItemClick(item);
      }
    },
    [hasNestedItems, item, onItemClick, onToggle],
  );

  useEffect(() => {
    const currentRef = menuItemRef.current;
    if (currentRef) {
      currentRef.addEventListener('keydown', handleDirectKeyDown);
      return () => currentRef.removeEventListener('keydown', handleDirectKeyDown);
    }
  }, [handleDirectKeyDown]);

  return (
    <>
      <MuiMenuItem
        tabIndex={0}
        ref={menuItemRef}
        aria-label={item.elements.name.value}
        key={item.elements.name.value}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        sx={{
          position: 'relative',
          py: nested ? 2 : 3,
          px: 0,
          border: 'unset',
          height: nested ? 46 : 58,
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': { svg: { fill: theme => theme.palette.primary.main } },
          '&:focus-visible': { bgcolor: 'warning.main', outline: '2px solid #000', outlineStyle: 'double' },
          ...(!nested && { borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }),
          ...(isOpen && { bgcolor: 'appColors.support80.transparentLight' }),
        }}
        {...(!hasNestedItems && item.elements.link.value ? { component: 'a', href: item.elements.link.value } : {})}
      >
        <Box
          top={0}
          bottom={0}
          left={-2}
          position="absolute"
          width={4}
          bgcolor={isOpen ? 'primary.main' : 'transparent'}
          sx={{ transition: 'background-color 0.2s ease-in-out' }}
        />
        <Box width={nested ? 0 : 22} height={nested ? 0 : 22} mx={4} {...(nested && { ml: 4 })}>
          {item.elements.icon?.value && !nested && (
            <EvaIcon ariaHidden name={item.elements.icon.value} width={22} height={22} />
          )}
        </Box>
        <Typography
          color="text.primary"
          fontSize={{ xs: 'body2.fontSize', md: nested ? 'body2.fontSize' : 'body1.fontSize' }}
          data-testid={`account-menu-item-${index}`}
        >
          {item.elements.name.value}
        </Typography>
        {hasNestedItems && (
          <Box ml="auto" mr={2} width={26} height={26}>
            <AnimatedArrowIcon open={isOpen} color="primary" width={26} height={26} />
          </Box>
        )}
      </MuiMenuItem>

      {hasNestedItems && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {nestedItems?.map((nestedItem, nestedIdx) =>
              nestedItem ? (
                <AccountMenuItem
                  key={`${item.elements.name.value}-nested-${nestedIdx}`}
                  item={nestedItem}
                  index={`${index}-${nestedIdx}`}
                  isOpen={openNestedItemIndex === nestedIdx}
                  onToggle={() => handleNestedItemToggle(nestedIdx)}
                  onItemClick={onItemClick}
                  nested
                />
              ) : null,
            )}
          </List>
        </Collapse>
      )}
    </>
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.code === 'Enter') {
      e.preventDefault();
      if (hasNestedItems && onToggle) onToggle();
      else onItemClick(item);
    }
  }

  function handleClick() {
    if (hasNestedItems && onToggle) onToggle();
    else onItemClick(item);
  }

  function handleNestedItemToggle(index: number) {
    setOpenNestedItemIndex(prevIndex => (prevIndex === index ? null : index));
  }
};
