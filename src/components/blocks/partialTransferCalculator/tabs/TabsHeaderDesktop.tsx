import { Tabs } from '@mui/material';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { Tab } from './Tab';
import { useTabsContext } from './TabsContextProvider';
import { TabOption } from './types';

interface Props {
  id?: string;
  tabs: Array<TabOption>;
  'aria-label'?: string;
}

export const TabsHeaderDesktop: React.FC<Props> = ({ id, tabs, ...other }) => {
  const { activeTabIndex, onTabChanged } = useTabsContext();
  const { labelByKey } = useGlobalsContext();

  return (
    <Tabs
      id={id}
      value={activeTabIndex}
      onChange={(_, value) => onTabChanged(value)}
      TabIndicatorProps={{ style: { display: 'none' } }}
      {...other}
    >
      {tabs.map((tab, index) => (
        <Tab
          data-testid={`tab-${index}`}
          id={`${labelByKey(tab.key)}_tab_${index}`}
          key={`${labelByKey(tab.key)}_${index}`}
          label={labelByKey(tab.key)}
          aria-controls={`${labelByKey(tab.key)}_tabpanel_${index}`}
        />
      ))}
    </Tabs>
  );
};
