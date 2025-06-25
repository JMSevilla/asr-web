import { Box, Stack, Typography } from '@mui/material';
import { FileIcon } from '../../../icons';

interface Props {
    value?: string;
    index: number;
}

export const DataSummaryValueItemFiles: React.FC<Props> = ({ value, index }) => {
    return (
        <Stack direction="row" alignItems="flex-start" gap={1} mt={{ xs: 1, md: index ? 4 : 0 }}>
            <Box width={16} height={16} pt={0.5}>
                <FileIcon width={16} height={16} />
            </Box>
            <Typography component="span" sx={{ wordBreak: 'break-word' }}>
                {value}
            </Typography>
        </Stack>
    );
};
