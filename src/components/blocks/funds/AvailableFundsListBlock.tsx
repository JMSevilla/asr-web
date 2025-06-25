import { Link, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { MessageType } from '../../';
import { PanelListItem } from '../../../api/content/types/page';
import { openInNewTab } from '../../../business/navigation';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { Accordion } from '../../Accordion';
import { EvaIcon } from '../../EvaIcon';
import { OneColumnBlockLoader } from '../../loaders/OneColumnBlockLoader';
import { parseDisplayableFunds, parseGroupedFunds } from './parsing';

interface Props {
  id: string;
  pageKey: string;
  panelList?: PanelListItem[];
}

export const AvailableFundsListBlock: React.FC<Props> = ({ id, panelList }) => {
  const { labelByKey, classifierByKey, rawMessageByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const cachedAccessKey = useCachedAccessKey();
  const funds = useApi(
    async api => {
      const [schemeCode, category] = cachedAccessKey.data?.schemeCodeAndCategory?.split('-') || [];
      if (!schemeCode || !category) {
        return [];
      }
      const [funds, contentDefinedFunds] = await Promise.all([
        api.mdp.retirementDcSpendingFunds(schemeCode, category),
        api.content.authorizedFunds(cachedAccessKey.data?.contentAccessKey),
      ]);
      const filteredFunds = parseDisplayableFunds(funds.data, contentDefinedFunds.data?.funds ?? []);
      const groupedFunds = parseGroupedFunds(filteredFunds, classifierByKey('Fund_group_order'));
      return groupedFunds;
    },
    [cachedAccessKey.data?.contentAccessKey],
  );
  const prefix = id;

  useFormSubmissionBindingHooks({ key: id, isValid: !funds.error, cb: () => Promise.resolve({}) });

  useEffect(() => {
    if (!funds.error) return;
    const errorMessage = rawMessageByKey(`${id}_error`);
    if (errorMessage) {
      showNotifications([
        { type: errorMessage.type as MessageType, message: errorMessage.html, buttons: errorMessage.buttons },
      ]);
    }
    return () => hideNotifications();
  }, [funds.error]);

  if (funds.loading) {
    return <OneColumnBlockLoader id={id} data-testid="available-funds-list-loader" />;
  }

  if (funds.error) {
    return (
      <Stack id={id} data-testid="available-funds-error">
        {panelByKey(`${prefix}_error`)}
      </Stack>
    );
  }

  return (
    <Stack id={id} gap={4} data-testid="available-funds-list">
      {Object.entries(funds.result ?? {}).map(([group, rows]) => (
        <Accordion colored header={group} key={group} data-testid={`group-${group}`}>
          <Stack gap={4} pl={4} borderLeft="2px solid" borderColor="appColors.support60.light" component="ul">
            {rows?.map(row => (
              <Stack
                key={row.fundCode}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                component="li"
              >
                <Typography variant="body1" component="h4">
                  {row.fundName}
                </Typography>
                <Link
                  href={row.factsheetUrl}
                  data-testid={`group-${group}-list-item-${row.fundCode}`}
                  aria-label={labelByKey(`${prefix}_download_factsheet_for`, { name: row.fundName })}
                  onClick={handleFactsheetClick}
                >
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{ svg: { fill: theme => theme.palette.primary.main } }}
                  >
                    <Typography
                      noWrap
                      component="span"
                      variant="h3"
                      color="primary.main"
                      display={{ xs: 'none', sm: 'block' }}
                    >
                      {labelByKey(`${prefix}_factsheet`, { name: row.fundName })}
                    </Typography>
                    <EvaIcon name="download-outline" width={32} height={32} ariaHidden />
                  </Stack>
                </Link>
              </Stack>
            ))}
          </Stack>
        </Accordion>
      ))}
    </Stack>
  );

  function handleFactsheetClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    openInNewTab(e.currentTarget.href);
  }
};
