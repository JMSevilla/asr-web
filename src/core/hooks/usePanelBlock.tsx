import { PanelListItem } from '../../api/content/types/page';
import { PanelBlock } from '../../components';
import { useContentDataContext } from '../contexts/contentData/ContentDataContext';
import { useTenantContext } from '../contexts/TenantContext';

export function usePanelBlock(panelList?: PanelListItem[]) {
  const { page } = useContentDataContext();
  const { tenant } = useTenantContext();

  const panelByKey = (key: string) => {
    const panel = panelList?.find(x => x.elements.panelKey?.value.toLowerCase() === key.toLowerCase());

    if (!panel) return null;

    return (
      <PanelBlock
        page={page!}
        tenant={tenant}
        header={panel.elements.header}
        columns={panel.elements.columns}
        layout={panel.elements.layout}
        reverseStacking={panel.elements.reverseStacking}
        panelKey={panel.elements.panelKey?.value}
      />
    );
  };

  return {
    panelByKey,
  };
}
