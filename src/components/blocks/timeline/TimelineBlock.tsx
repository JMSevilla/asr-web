import { Box, Divider, Stack } from '@mui/material';
import React, { useState } from 'react';
import { ListLoader } from '../..';
import { useDataReplacerApi } from '../../../core/hooks/useDataReplacerApi';
import { TimelineBlockItem } from './TimelineBlockItem';
import { TimelineItem } from './types';

interface Props {
  id: string;
  key?: string;
  sourceUrl?: string;
  simplified?: boolean;
  items: TimelineItem[];
}

export const TimelineBlock: React.FC<Props> = ({ id, items, simplified, sourceUrl }) => {
  const replacer = useDataReplacerApi(sourceUrl);
  const [firstItemRef, setFirstItemRef] = useState<HTMLDivElement | null>(null);
  const [lastItemRef, setLastItemRef] = useState<HTMLDivElement | null>(null);

  if (replacer.loading) {
    return <ListLoader id={id} data-testid="timeline-loader-block" loadersCount={items.length || 1} />;
  }

  return (
    <Stack id={id} data-testid="timeline-block" direction="row" spacing={simplified ? 5 : 13} width="100%">
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          width: 2,
          mt: (firstItemRef?.clientHeight || 0) / 2 + 'px',
          mb: (lastItemRef?.clientHeight || 0) / 2 + 'px',
          ml: simplified ? 3 : 0,
          bgcolor: simplified ? 'common.black' : 'appColors.grey',
          border: 'none',
        }}
      />
      <Stack
        spacing={simplified ? 2.5 : 6}
        flex={1}
        component="ol"
        sx={{
          marginBlockStart: 0,
          paddingInlineStart: 0,
          listStyleType: 'none',
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            ref={index === 0 ? setFirstItemRef : index === items.length - 1 ? setLastItemRef : null}
            component="li"
          >
            <TimelineBlockItem
              prefix={id}
              index={index}
              item={item}
              simplified={simplified}
              onTextDataReplace={replacer.replaceDataInText}
              dataReplaceProps={replacer.elementProps}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
