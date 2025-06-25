import { Box, Divider, MenuItem as MuiMenuItem, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { MenuItem, SubMenuItem } from '../../../api/content/types/menu';
import { parseButtonProps } from '../../../cms/parse-cms';
import { ContentButtonBlock } from '../../blocks/ContentButtonBlock';

interface Props {
  id: number;
  item: SubMenuItem;
  firstMenuSubItemRef: React.RefObject<HTMLLIElement>;
  queryParams: { [key: string]: string };
  pageKey?: string;
  length: number;
  active: boolean;
  isButton: boolean;
  handleItemClick: (
    e: React.MouseEvent | React.KeyboardEvent,
    item: MenuItem | SubMenuItem,
    callback?: VoidFunction,
    buttonRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  close: () => void;
}

export const MenuNavigationItem: React.FC<Props> = ({
  id,
  item,
  firstMenuSubItemRef,
  handleItemClick,
  length,
  active,
  queryParams,
  pageKey,
  isButton,
  close,
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  return (
    <MuiMenuItem
      dense
      ref={id === 0 ? firstMenuSubItemRef : null}
      tabIndex={0}
      aria-label={item.elements.name.value}
      key={item.elements.name.value}
      onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && handleItemClick(e, item, close, buttonRef)}
      onClick={e => handleItemClick(e, item, close, buttonRef)}
      sx={{
        width: 375,
        py: 4,
        pb: 0,
        borderLeft: '4px solid',
        borderLeftColor: active ? 'appColors.primary' : 'transparent',
        position: 'relative',
      }}
    >
      {isButton ? (
        <Box
          width="100%"
          mx={4}
          sx={{
            a: { textDecoration: 'none!important', color: 'text.primary', fontSize: 'inherit' },
          }}
        >
          <ContentButtonBlock
            buttonRef={buttonRef}
            id={`navigation-hover-menu-item-${id}`}
            queryParams={queryParams}
            pageKey={pageKey}
            {...parseButtonProps(item?.elements?.buttonAsMenuItem?.value?.elements)}
            text={item.elements.name.value}
          />
          <Box mt={4} />
          {length !== id + 1 && <Divider />}
        </Box>
      ) : (
        <Box width="100%" mx={4}>
          <Typography color="text.primary" variant="body2" data-testid={`navigation-hover-menu-item-${id}`}>
            {item.elements.name.value}
          </Typography>
          <Box mt={4} />
          {length !== id + 1 && <Divider />}
        </Box>
      )}
    </MuiMenuItem>
  );
};
