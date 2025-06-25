import { useMemo } from 'react';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { useResolution } from '../../../core/hooks/useResolution';
import { TwoColumnBlockLoader } from '../../loaders';
import { ExploreByPensionIncomeCalculatorTab } from './calculators/ExploreByPensionIncomeCalculatorTab';
import { ExploreByTransferValueCalculatorTab } from './calculators/ExploreByTransferValueCalculatorTab';
import { TabPanel } from './tabs/TabPanel';
import { TabsContextProvider } from './tabs/TabsContextProvider';
import { TabsHeaderDesktop } from './tabs/TabsHeaderDesktop';
import { TabsHeaderMobile } from './tabs/TabsHeaderMobile';
import { TabOption } from './tabs/types';

interface Props {
  id?: string;
}

export const PartialTransferCalculatorBlock: React.FC<Props> = ({ id }) => {
  const { transferOptions, transferOptionsLoading } = useRetirementContext();
  const { labelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();

  const tabs = useMemo<Array<TabOption>>(
    () =>
      transferOptions
        ? [
            {
              key: 'PT_explore_by_transfer',
              content: <ExploreByTransferValueCalculatorTab index={0} transferOptions={transferOptions} />,
            },
            {
              key: 'PT_explore_by_pension',
              content: <ExploreByPensionIncomeCalculatorTab index={1} transferOptions={transferOptions} />,
            },
          ]
        : [],
    [transferOptions],
  );

  if (!transferOptions || transferOptionsLoading) {
    return <TwoColumnBlockLoader />;
  }

  return (
    <TabsContextProvider>
      {isMobile ? <TabsHeaderMobile id={id} tabs={tabs} /> : <TabsHeaderDesktop id={id} tabs={tabs} />}
      {tabs.map((tab, index) => (
        <TabPanel
          index={index}
          id={`${labelByKey(tab.key)}_tabpanel_${index}`}
          aria-labelledby={`${labelByKey(tab.key)}_tab_${index}`}
          key={`${labelByKey(tab.key)}_${index}`}
        >
          {tab.content}
        </TabPanel>
      ))}
    </TabsContextProvider>
  );
};
