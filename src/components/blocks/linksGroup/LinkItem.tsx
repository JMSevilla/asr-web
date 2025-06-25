import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { ParsedHtml } from '../..';
import { openInNewTab } from '../../../business/navigation';
import { useRouter } from '../../../core/router';

interface Props {
  label?: string;
  html?: string;
  link?: string;
}

export const LinkItem: React.FC<Props> = ({ label, html, link }) => {
  const router = useRouter();

  return (
    <Grid container direction="column">
      <Grid item lg={10}>
        {label && (
          <Box>
            <Typography
              color="primary"
              variant="h5"
              component="a"
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && handleClick()}
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              {label}
            </Typography>
          </Box>
        )}
        {html && <ParsedHtml html={html} />}
      </Grid>
    </Grid>
  );

  function handleClick() {
    if (!link) {
      return;
    }

    if (link.startsWith('http')) {
      openInNewTab(link);
    } else {
      router.push(link);
    }
  }
};
