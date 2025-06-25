import React from 'react';
import { FileValue } from '../../api/content/types/common';
import { ContentButtonIcon } from './ContentButtonIcon';

interface Props {
  text?: string | React.ReactNode;
  icon?: FileValue;
  iconName?: string;
  isRightSided?: boolean;
  isWithinButton?: boolean;
  isLargeIcon?: boolean;
  isButtonWithIcon?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

export const ContentButtonText: React.FC<Props> = ({
  icon,
  iconName,
  isRightSided,
  isWithinButton,
  text,
  isLargeIcon,
  isButtonWithIcon,
  onClick,
}) => {
  const elements = [
    <ContentButtonIcon
      key="content-button-icon"
      icon={icon}
      iconName={iconName}
      isRightSided={isRightSided}
      isWithinButton={isWithinButton}
      isLargeIcon={isLargeIcon}
      hasCircularBackground={isButtonWithIcon === true}
      onClick={isButtonWithIcon ? onClick : undefined}
    />,
    !isButtonWithIcon && <React.Fragment key="content-button-text">{text}</React.Fragment>,
  ].filter(Boolean);

  if (isRightSided) return <>{elements.reverse()}</>;

  return <>{elements}</>;
};
