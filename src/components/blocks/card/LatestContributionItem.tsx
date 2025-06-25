import { PopperProps, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface Props {
  label: string;
  contributionsLength: number;
}

const POPPER_CONFIG: Partial<PopperProps> = {
  disablePortal: false,
  modifiers: [
    { name: 'flip', enabled: true },
    { name: 'offset', options: { offset: [0, 10] } },
    { name: 'preventOverflow', options: { padding: 24 } },
  ],
};

export const LatestContributionsItem: React.FC<Props> = ({ label, contributionsLength }) => {
  const theme = useTheme();
  const textRef = useRef<HTMLDivElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [label]);

  return (
    <Tooltip
      style={{ padding: 4 }}
      arrow
      PopperProps={POPPER_CONFIG}
      placement="top-end"
      title={
        isClamped ? (
          <Typography paddingX={4} paddingY={1} variant="body2">
            {label}
          </Typography>
        ) : (
          ''
        )
      }
    >
      <Typography
        data-testid="latest-contribution-item"
        ref={textRef}
        title={label}
        variant="body2"
        sx={{
          ...theme.typography.body2,
          color: theme.palette.text.secondary,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: contributionsLength === 1 ? 3 : 2,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          cursor: isClamped ? 'pointer' : 'default',
        }}
      >
        {label}
      </Typography>
    </Tooltip>
  );
};
