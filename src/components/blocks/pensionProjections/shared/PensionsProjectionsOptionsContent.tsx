import { Box, Stack, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { ReactElement, useState } from 'react';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { DataTableSx } from '../../../table/types';
import { FullPensionTabTable } from './FullPensionTabTable';
import { MaxLumpTabTable } from './MaxLumpTabTable';

export interface TabOption {
  id: number;
  nameLabelKey: string;
  headerLabelKey?: string;
  textBelowLabelKey?: string;
}

interface TabComponentProps {
  id: number;
  key: number;
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface HeaderComponentProps {
  tabsComponent: ReactElement;
}

interface Props {
  ages: number[];
  normalRetirementAge?: number | null;
  tabs: TabOption[];
  containerSx?: SxProps<Theme>;
  tableSx?: DataTableSx;
  headerComponent: (props: HeaderComponentProps) => ReactElement;
  tabComponent: (props: TabComponentProps) => ReactElement | null;
}

export const PensionsProjectionsOptionsContent: React.FC<Props> = ({
  ages,
  tabs,
  normalRetirementAge,
  headerComponent,
  tabComponent,
  containerSx,
  tableSx,
}) => {
  const { membership } = useContentDataContext();
  const { labelByKey, rawLabelByKey, htmlByKey } = useGlobalsContext();
  const firstTab = tabs.find(() => true);
  const [selectedTab, setSelectedTab] = useState<TabOption | undefined>(firstTab);

  return (
    <Stack gap={4} sx={containerSx}>
      {headerComponent({
        tabsComponent: (
          <>
            {tabs.map((tab, key) => {
              const labelWithKey = rawLabelByKey(tab.nameLabelKey);

              if (!labelWithKey) {
                return null;
              }

              return tabComponent({
                id: tab.id,
                label: labelWithKey,
                onClick: () => setSelectedTab(tab),
                selected: tab.id === selectedTab?.id,
                key,
              });
            })}
          </>
        ),
      })}
      {selectedTab && (
        <Box display="flex" flexDirection="column">
          {selectedTab.headerLabelKey && (
            <Box mb={6}>
              <Typography
                fontSize={{
                  xs: 'body2',
                  md: 'body1',
                }}
              >
                {labelByKey(selectedTab.headerLabelKey)}
              </Typography>
            </Box>
          )}
          <Box width="100%" mb={selectedTab.textBelowLabelKey || normalRetirementAge ? 4 : undefined}>
            {selectedTab.id === firstTab?.id ? (
              <FullPensionTabTable ages={ages} sx={tableSx} isNormalRetirementAge={checkIsNormalRetirementAge} />
            ) : (
              <MaxLumpTabTable ages={ages} sx={tableSx} isNormalRetirementAge={checkIsNormalRetirementAge} />
            )}
          </Box>
          {normalRetirementAge &&
            ages.includes(normalRetirementAge) &&
            checkIsNormalRetirementAge(normalRetirementAge) && (
              <Typography mb={selectedTab.textBelowLabelKey ? 6 : undefined} fontSize={{ xs: 'body2', md: 'body1' }}>
                {labelByKey('normal_retirement_age_modal')}
              </Typography>
            )}
          {selectedTab.textBelowLabelKey && (
            <Typography fontSize={{ xs: 'body2', md: 'body1' }}>{htmlByKey(selectedTab.textBelowLabelKey)}</Typography>
          )}
        </Box>
      )}
    </Stack>
  );

  function checkIsNormalRetirementAge(age: number) {
    const [birthMonths, birthDays] = membership?.dateOfBirth
      ? [new Date(membership.dateOfBirth).getUTCMonth() + 1, new Date(membership.dateOfBirth).getUTCDate()]
      : [null, null];
    const [retirementMonths, retirementsDays] = membership?.normalRetirementDate
      ? [
          new Date(membership.normalRetirementDate).getUTCMonth() + 1,
          new Date(membership.normalRetirementDate).getUTCDate(),
        ]
      : [null, null];

    return birthMonths === retirementMonths && birthDays === retirementsDays && membership?.normalRetirementAge === age;
  }
};
