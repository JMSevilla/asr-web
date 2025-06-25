import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, AccordionSummary, Box, Grid, Accordion as MuiAccordion, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useResolution } from '../../../core/hooks/useResolution';
import { ParsedHtml } from '../../ParsedHtml';

interface Props {
  id?: string;
  header?: string;
  html?: string;
  opened?: boolean;
  number?: number | string;
  isLast?: boolean;
}

export const OrderedAccordion: React.FC<Props> = ({ id, header, html, opened, number, isLast }) => {
  const { isMobile } = useResolution();
  const [open, setOpen] = useState(opened);

  return (
    <MuiAccordion
      id={id}
      disableGutters
      elevation={0}
      expanded={open}
      onChange={handleChange}
      sx={{
        boxShadow: 0,
        minHeight: 50,
        borderTop: '1px solid',
        borderBottom: isLast ? '1px solid' : 'none',
        borderColor: theme => theme.palette.appColors.incidental['075'],
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: theme => (number ? theme.palette.appColors.primary : theme.palette.text.primary) }}
            fontSize="large"
          />
        }
        aria-controls="accordion-content"
        id="accordion-header"
        sx={{
          backgroundColor: theme => theme.palette.common.white,
          pl: 4,
          m: 0,
          borderBottom: open ? '1px solid' : 'none',
          borderColor: theme => theme.palette.appColors.incidental['075'],
          color: theme => (number ? theme.palette.appColors.primary : theme.palette.text.primary),
          '&.Mui-expanded': {
            borderBottomColor: 'transparent',
          },
        }}
      >
        <Grid container mt="2px" wrap="nowrap">
          {number && (
            <Grid item>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 32,
                  height: 32,
                  marginTop: '-2px',
                  border: theme => `2px solid ${theme.palette.appColors.primary}`,
                  borderRadius: '100%',
                  mr: 2,
                }}
              >
                <Typography variant="body2" fontWeight="bold " sx={{ mb: '-2px' }}>
                  {number}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item justifyItems="center">
            <Typography variant="h5" fontWeight="bold">
              {header}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ pl: 4, pr: isMobile ? 4 : 14, pb: 4, overflowX: 'auto' }}>
        {html && <ParsedHtml html={html} />}
      </AccordionDetails>
    </MuiAccordion>
  );

  function handleChange() {
    setOpen(!open);
  }
};
