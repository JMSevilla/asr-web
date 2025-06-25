import { Typography } from '@mui/material';
import { useTokenEnrichedValue } from '../../../../cms/inject-tokens';
import { ValueFormatType } from '../../../../api/content/types/common';

interface Props {
    value?: string;
    fontWeight: string;
}

export const DataSummaryValueItemText: React.FC<Props> = ({ value, fontWeight }) => {
    return (
        <Typography
            color="primary"
            variant="secondLevelValue"
            component="p"
            textAlign={{ xs: 'left', md: 'right' }}
            sx={{ wordBreak: 'break-word' }}
            fontWeight={fontWeight}
        >
            {value}
        </Typography>
    );
};
