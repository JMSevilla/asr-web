import { Typography } from '@mui/material';
import { useTokenEnrichedValue } from '../../../../cms/inject-tokens';
import { ValueFormatType } from '../../../../api/content/types/common';

interface Props {
    value?: string;
    fontWeight: string;
}

export const DataSummaryItemEnrichedText: React.FC<Props> = ({ value, fontWeight }) => {
    const enrichedValue = useTokenEnrichedValue(value);
    return (
        <Typography
            color="primary"
            variant="secondLevelValue"
            component="p"
            textAlign={{ xs: 'left', md: 'right' }}
            sx={{ wordBreak: 'break-word' }}
            fontWeight={fontWeight}
        >
            {enrichedValue}
        </Typography>
    );
};
