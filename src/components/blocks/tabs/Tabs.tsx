import { Box, Grid } from '@mui/material';
import { useRef, useState } from 'react';
import { PanelBlock, TabButton } from '../../';
import { CmsPage, PanelListItem } from '../../../api/content/types/page';
import { CmsTenant } from '../../../api/content/types/tenant';
import { useResolution } from '../../../core/hooks/useResolution';

interface Props {
  panels: PanelListItem[];
  id?: string;
  page: CmsPage;
  tenant: CmsTenant | null;
}

export const Tabs: React.FC<Props> = ({ panels, page, tenant }) => {
  const { isMobile } = useResolution();
  const [selected, setSelected] = useState(1);
  const tabs = tabsHeader(panels);
  const selectedTab = tabs.find(tab => tab.id === selected);
  const tabsRef = useRef<HTMLElement[]>([]);

  return (
    <Grid container spacing={12}>
      {!isMobile && (
        <Grid container item xs={12} justifyContent="center">
          {tabs.map((tab, index) => (
            <Grid item key={tab.id}>
              <TabButton
                ref={el => (tabsRef.current[tab.id] = el!)}
                id={`tab-${index + 1}`}
                active={selected === tab.id}
                href={`#tab-section-${index + 1}`}
                sx={{
                  marginLeft: tab.id !== 1 ? '-1px' : 'unset',
                }}
                onClick={e => handleSelected(e, tab.id)}
                onKeyDown={e => handleKeyDown(e, tab.id)}
                data-testid={`tab-${tab.id}-button`}
              >
                {tab.title}
              </TabButton>
            </Grid>
          ))}
        </Grid>
      )}
      {isMobile
        ? tabs?.map((tab, index) => (
            <Grid item xs={12} key={tab.id}>
              <PanelBlock
                id={`tab-section-${index + 1}`}
                page={page}
                tenant={tenant}
                header={undefined}
                layout={tab.content?.layout}
                columns={tab.content?.columns}
                reverseStacking={tab.content?.reverseStacking}
              />
              {tabs.length - 1 !== index && (
                <Box mt={12} sx={{ backgroundColor: 'primary.main', height: '4px', width: '100%' }} />
              )}
            </Grid>
          ))
        : selectedTab && (
            <Grid item xs={12}>
              <PanelBlock
                id={selectedTabId(selectedTab.id)}
                aria-labelledby={selectedTabId(selectedTab.id)}
                role="tabpanel"
                page={page}
                tenant={tenant}
                header={undefined}
                layout={selectedTab.content?.layout}
                columns={selectedTab.content?.columns}
                reverseStacking={selectedTab.content?.reverseStacking}
              />
            </Grid>
          )}
    </Grid>
  );

  function selectedTabId(id: number) {
    return `tab-section-${tabs.findIndex(tab => tab.id === id) + 1}`;
  }

  function handleSelected(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent, id: number) {
    e?.preventDefault();
    setSelected(id);
    tabsRef?.current[id]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, id: number) {
    const tabsLength = tabs.length;

    switch (e.code) {
      case 'ArrowLeft':
        if (id > 1) {
          handleSelected(e, id - 1);
        }
        break;
      case 'ArrowRight':
        if (id < tabsLength) {
          handleSelected(e, id + 1);
        }
        break;
      default:
        break;
    }
  }
};

const tabsHeader = (panels: PanelListItem[]): { id: number; title: string; content?: PanelListItem['elements'] }[] =>
  panels.map((panel, index) => ({ id: index + 1, title: panel.elements.header?.value ?? '', content: panel.elements }));
