import { Box, Typography, TypographyProps } from '@mui/material';
import { InterpolationTokens } from '../../../cms/types';
import { ParsedHtml } from '../../ParsedHtml';

interface Props extends TypographyProps {
  id?: string;
  text?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  accessibilityText?: string;
  borderRadius?: string;
  tokens?: InterpolationTokens;
}

export const Badge: React.FC<Props> = ({
  id,
  text,
  backgroundColor,
  borderColor,
  color,
  accessibilityText,
  borderRadius,
  tokens,
  ...props
}) => {
  return (
    <Box
      className={props.className}
      sx={{
        width: 'fit-content',
        height: 'fit-content',
        backgroundColor: backgroundColor || 'appColors.primary',
        padding: '4px',
        borderRadius: borderRadius ? borderRadius : '2px',
        border: borderColor ? '1px solid' : 'unset',
        borderColor,
        color: color || 'primary.contrastText',
        lineHeight: '16px',
      }}
    >
      <Typography id={id} variant="badge" textTransform="uppercase" whiteSpace="nowrap" {...props}>
        {accessibilityText && (
          <Box component="span" className="visually-hidden">
            {accessibilityText}
          </Box>
        )}
        {text && <ParsedHtml html={text} fontSize="badge" tokens={tokens} />}
      </Typography>
    </Box>
  );
};
