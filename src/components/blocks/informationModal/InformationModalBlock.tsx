import { Link } from '@mui/material';
import React, { useState } from 'react';
import { PanelListItem } from '../../../api/content/types/page';
import { CmsButton } from '../../../cms/types';
import { InformationModal } from './InformationModal';

interface Props {
  id?: string;
  header?: string;
  linkText?: string;
  text?: string;
  buttons?: CmsButton[];
  isAlternateStyle?: boolean;
  hideCloseInAlternateStyle?: boolean;
  panel?: PanelListItem;
}

export const InformationModalBlock: React.FC<Props> = ({
  id,
  header,
  linkText,
  text,
  buttons,
  isAlternateStyle,
  hideCloseInAlternateStyle,
  panel,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Link id={id} tabIndex={0} component="button" variant="body1" textAlign="left" onClick={handleButtonClick}>
        {linkText}
      </Link>
      <InformationModal
        open={open}
        onClose={handleClose}
        header={header}
        text={text}
        buttons={buttons}
        isAlternateStyle={isAlternateStyle}
        hideCloseInAlternateStyle={hideCloseInAlternateStyle}
        panel={panel}
      />
    </>
  );

  function handleButtonClick() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
};
