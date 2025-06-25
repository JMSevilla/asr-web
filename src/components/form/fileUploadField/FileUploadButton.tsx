import { Box } from '@mui/material';
import { useRef } from 'react';
import { CmsButton } from '../../../cms/types';
import { Button } from '../../buttons';

interface Props extends CmsButton {
  name: string;
  acceptTypes?: string[];
  isDisabled?: boolean;
  onUpload(files: FileList | null): void;
}

export const FileUploadButton: React.FC<Props> = ({ name, isDisabled, acceptTypes, onUpload, ...buttonProps }) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        hidden
        id={name}
        name={name}
        ref={ref}
        type="file"
        accept={acceptTypes?.map(t => `.${t}`).join(',')}
        data-testid="hidden-upload-input"
        multiple={false}
        disabled={isDisabled}
        value={''}
        onChange={e => !isDisabled && onUpload(e.target.files)}
      />
      <Button
        {...buttonProps}
        data-testid="upload-button"
        aria-label={buttonProps.text}
        onClick={handleClick}
        disabled={isDisabled}
      >
        <Box component="label" htmlFor={name} sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
          {buttonProps.text}
        </Box>
      </Button>
    </>
  );

  function handleClick() {
    ref.current?.focus();
    ref.current?.click();
  }
};
