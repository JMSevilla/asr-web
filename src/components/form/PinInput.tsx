import { Box } from '@mui/system';
import dynamic from 'next/dynamic';
import React from 'react';
import { useResolution } from '../../core/hooks/useResolution';

const ExternalPinInput = dynamic(() => import('react-pin-input'), { ssr: false });

interface PinInputProps {
  length: number;
  initialValue?: number | string;
  type?: 'numeric' | 'custom';
  inputMode?: string;
  secret?: boolean;
  disabled?: boolean;
  focus?: boolean;
  onChange?: (value: string, index: number) => void;
  onComplete?: (value: string, index: number) => void;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputFocusStyle?: React.CSSProperties;
  validate?: (value: string) => string;
  autoSelect?: boolean;
  regexCriteria?: string;
  ariaLabel?: string;
}

export const PinInput = React.forwardRef((props: PinInputProps, ref) => {
  const { isMobile } = useResolution();

  const inputs = document.querySelectorAll('.pincode-input-text');
  inputs.forEach((i, idx) => i.setAttribute('aria-label', `${props.ariaLabel} ${idx + 1}`));

  return (
    <Box
      component="fieldset"
      aria-label={props.ariaLabel}
      sx={{
        border: 'none',
        margin: 0,
        padding: 0,
        paddingInline: 0,
        paddingBlock: 0,
        marginInline: 0,
        '& fieldset': {
          border: 'none',
          margin: 0,
          padding: 0,
        },
      }}
    >
      <ExternalPinInput
        inputStyle={{
          margin: isMobile ? '0 8px' : '0 12px',
          border: 'none',
          borderBottom: '4px solid #000000',
          fontSize: isMobile ? '16px' : '24px',
          width: isMobile ? '20px' : '50px',
          height: isMobile ? '30px' : '50px',
        }}
        type="numeric"
        inputMode="number"
        autoSelect={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={ref}
        {...props}
      />
    </Box>
  );
});
