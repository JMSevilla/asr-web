import { Box } from '@mui/material';
import React from 'react';
import { EvaIcon, SvgIcon } from '../';
import { FileValue } from '../../api/content/types/common';

interface Props {
  icon?: FileValue;
  iconName?: string;
  isRightSided?: boolean;
  isWithinButton?: boolean;
  isLargeIcon?: boolean;
  hasCircularBackground?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

export const ContentButtonIcon: React.FC<Props> = ({
  icon,
  iconName,
  isRightSided = false,
  isWithinButton,
  isLargeIcon,
  hasCircularBackground = false,
  onClick,
}) => {
  if (!icon || !iconName) {
    return null;
  }

  const margin = 2;
  const iconSize = isLargeIcon || isWithinButton ? 24 : 16;

  return (
    <Box
      component="span"
      display="inline-flex"
      onClick={onClick}
      {...(isRightSided ? { ml: margin } : { mr: margin })}
      sx={
        hasCircularBackground
          ? {
              width: isLargeIcon ? 40 : 32,
              height: isLargeIcon ? 40 : 32,
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor: theme => theme.palette.primary.light,
              alignItems: 'center',
              justifyContent: 'center',
            }
          : undefined
      }
    >
      {iconName ? (
        <EvaIcon
          name={iconName}
          fill="currentColor"
          width={iconSize}
          height={iconSize}
          ariaHidden
          primaryFill={hasCircularBackground}
        />
      ) : (
        <SvgIcon className="button-icon" icon={icon!} width={iconSize} height={iconSize} />
      )}
    </Box>
  );
};
