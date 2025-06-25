import { Grid } from '@mui/material';
import { useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { Modal } from '../../Modal';
import { PrimaryButton, SecondaryButton } from '../../buttons';
import { TextField } from '../../form';

interface FieldConfig {
  name: string;
  label: string;
}

interface SingleAuthOptoinsModalProps {
  open: boolean;
  onClose: () => void;
  header: string;
  redirectPath: string;
  fields: FieldConfig[];
}

export const SingleAuthOptionsModal: React.FC<SingleAuthOptoinsModalProps> = ({
  open,
  onClose,
  header,
  redirectPath,
  fields,
}) => {
  const defaultValues = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: '',
    }),
    {},
  );

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = (data: Record<string, string>) => {
    setIsLoading(true);
    const queryParams = Object.entries(data)
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    if (queryParams) {
      const separator = redirectPath.includes('?') ? '&' : '?';
      window.location.href = `${redirectPath}${separator}${queryParams}`;
    } else {
      window.location.href = redirectPath;
    }
  };

  return (
    <Modal headerTitle={header} open={open} onClose={isLoading ? () => {} : onClose} maxWidth="sm" fullWidth>
      <Grid container spacing={8}>
        {fields.map(field => (
          <Grid item xs={12} key={field.name}>
            <TextField key={field.name} name={field.name} control={control as Control<any>} label={field.label} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4} mt={16} justifyContent="flex-end">
        <Grid item>
          <SecondaryButton onClick={onClose} loading={isLoading}>
            Cancel
          </SecondaryButton>
        </Grid>
        <Grid item>
          <PrimaryButton onClick={handleSubmit(onSubmit)} loading={isLoading}>
            Proceed
          </PrimaryButton>
        </Grid>
      </Grid>
    </Modal>
  );
};
