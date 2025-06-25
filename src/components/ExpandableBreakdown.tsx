import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, AccordionSummary, Accordion as MuiAccordion, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGlobalsContext } from '../core/contexts/GlobalsContext';

interface Props {
  id: string;
  opened?: boolean;
}

export const ExpandableBreakdown: React.FC<React.PropsWithChildren<Props>> = ({ id, children, opened = false }) => {
  const { labelByKey } = useGlobalsContext();
  const [open, setOpen] = useState(opened);

  return (
    <MuiAccordion
      disableGutters
      elevation={0}
      expanded={open}
      onChange={handleChange}
      className="accordion"
      sx={{ boxShadow: 0, minHeight: 50, background: 'transparent' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main', my: 2 }} fontSize="large" />}
        aria-controls={`accordion-panel-${id}`}
        aria-expanded={open}
        id={`breakdown-header-${id}`}
        className="accordion-opener"
        sx={{ m: 0, p: 0, justifyContent: 'flex-start', 'div:first-of-type': { flexGrow: 'unset' } }}
      >
        <Typography color="primary" variant="body1" data-testid={`accordion-panel-title-${id}`}>
          {open ? labelByKey('hide_breakdown') : labelByKey('view_breakdown')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }} className="accordion-content" itemID={`accordion-panel-${id}`}>
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );

  function handleChange() {
    setOpen(!open);
  }
};
