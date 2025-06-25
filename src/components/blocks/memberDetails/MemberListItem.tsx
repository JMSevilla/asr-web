import { ChevronRight } from '@mui/icons-material';
import { Box, ListItem as MuiListItem, Typography } from '@mui/material';
import { useRouter } from '../../../core/router';

interface Props {
  text: string;
  buttonAria?: string;
  value: string | number;
  url?: string;
  'data-testid'?: string;
  backgroundColor?: string;
}

export const MemberListItem: React.FC<Props> = ({ text, value, buttonAria, url, backgroundColor, ...props }) => {
  const router = useRouter();

  return (
    <MuiListItem
      sx={{ py: 6, backgroundColor, borderBottom: '1px solid', borderColor: 'divider' }}
      tabIndex={0}
      {...props}
    >
      <Typography mr={2} flex={1} component="label" htmlFor={props['data-testid']} fontWeight="bold">
        {text}
      </Typography>
      <Typography flex={2} component="span" id={props['data-testid']}>
        {value}
      </Typography>
      {url && (
        <Box
          pl={2}
          tabIndex={0}
          display="flex"
          alignItems="center"
          aria-label={buttonAria}
          onClick={handleTaxDetailsChangeClick}
          onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && handleTaxDetailsChangeClick()}
          sx={{ cursor: 'pointer' }}
        >
          <ChevronRight sx={{ color: theme => theme.palette.primary.dark }} />
        </Box>
      )}
    </MuiListItem>
  );

  async function handleTaxDetailsChangeClick() {
    await router.push(url!);
  }
};
