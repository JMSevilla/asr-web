import { Box, Divider, Grid, List, ListItem, SxProps, Theme, Typography, TypographyProps } from '@mui/material';
import { NA_SYMBOL } from '../business/constants';
import { hasWhiteSpace } from '../business/strings';
import { FileIcon } from '../components/icons';

interface Props {
  id: string;
  label: string;
  value?: string | string[];
  disabled?: boolean;
  isDocuments?: boolean;
  textVariant?: TypographyProps['variant'];
  textSx?: SxProps<Theme>;
}

export const SummaryDetailsRow: React.FC<Props> = ({
  id,
  label,
  value,
  disabled,
  isDocuments,
  textVariant,
  textSx,
}) => (
  <>
    <Grid item xs={12} md={6} pr={{ xs: 0, md: 3 }}>
      <Typography fontWeight="bold" variant="body1">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={6} display="flex" flexDirection="column">
      {!value || typeof value === 'string' ? (
        <ValueText id={id} value={value || NA_SYMBOL} disabled={disabled} textVariant={textVariant} textSx={textSx} />
      ) : isDocuments ? (
        <List disablePadding>
          {value.map((v, i) => (
            <ListItem key={i} disablePadding alignItems="flex-start">
              <Box width={24} height={24} mr={1}>
                <FileIcon width={24} height={24} />
              </Box>
              <ValueText
                key={i}
                id={`${id}-${i}`}
                value={v}
                disabled={disabled}
                color="black"
                textVariant={textVariant}
                textSx={textSx}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        value.map((v, i) => (
          <ValueText
            key={i}
            id={`${id}-${i}`}
            value={v}
            disabled={disabled}
            textVariant={textVariant}
            textSx={textSx}
          />
        ))
      )}
    </Grid>
    <Divider />
  </>
);

const ValueText: React.FC<{
  id: string;
  value: string;
  disabled?: boolean;
  color?: TypographyProps['color'];
  textVariant?: TypographyProps['variant'];
  textSx?: SxProps<Theme>;
}> = ({ id, value, disabled, color, textVariant, textSx }) => (
  <Typography
    data-testid={id}
    color={color ? color : 'primary'}
    variant={textVariant ?? 'body1'}
    component="span"
    textOverflow={{ xs: 'ellipsis', md: 'inherit' }}
    overflow={{ xs: 'hidden', md: 'inherit' }}
    whiteSpace={{ xs: 'nowrap', md: 'inherit' }}
    maxWidth="100%"
    sx={{
      wordBreak: { xs: 'unset', md: hasWhiteSpace(value) ? 'break-word' : 'break-all' },
      ...(disabled ? { color: theme => theme.palette.appColors.essential[500] } : {}),
      ...textSx,
    }}
  >
    {value}
  </Typography>
);
