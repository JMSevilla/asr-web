import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { FileIcon } from '../../icons';

interface Props {
  title: string;
}

export const FileInUploadProgress: React.FC<Props> = ({ title }) => (
  <Stack position="relative" direction="row" alignItems="flex-start" spacing={2}>
    <FileIcon width={24} height={24} />
    <Typography
      color="text.primary"
      overflow="hidden"
      textOverflow="ellipsis"
      maxWidth={{ xs: '30vw', sm: '70vw', md: 320 }}
    >
      {title}
    </Typography>
    <Box />
    <Box
      position="absolute"
      right={0}
      height={22}
      width={22}
      border="3px solid"
      borderRadius="50%"
      borderColor={theme => theme.palette.appColors.incidental['075']}
    />
    <CircularProgress size={22} sx={{ color: theme => theme.palette.appColors.essential[800] }} thickness={6} />
  </Stack>
);
