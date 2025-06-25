import { Stack, Typography } from '@mui/material';
import { Checkbox } from '../../..';

interface Props {
  id?: string;
  onClick: () => void;
  isChecked: boolean;
  label: string;
}

export const TagsCheckboxRow: React.FC<Props> = ({ id, label, isChecked, onClick }) => (
  <Stack
    id={id}
    data-testid={id}
    direction="row"
    alignItems="center"
    spacing={4}
    onClick={onClick}
    sx={{ cursor: 'pointer' }}
  >
    <Checkbox checked={isChecked} sx={{ margin: 0 }} />
    <Typography align="left" variant="h5">
      {label}
    </Typography>
  </Stack>
);
