import { Box, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Button, MessageType } from '../../..';
import { ContentFund } from '../../../../api/content/types/funds';
import { JourneyTypeSelection, PanelListItem } from '../../../../api/content/types/page';
import { findValueByKey } from '../../../../business/find-in-array';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyNavigation } from '../../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../../core/hooks/useJourneyStepData';
import { useModal } from '../../../../core/hooks/useModal';
import { usePanelBlock } from '../../../../core/hooks/usePanelBlock';
import { useSubmitJourneyStep } from '../../../../core/hooks/useSubmitJourneyStep';
import { FundsModal } from './FundsModal';
import { FundsTable } from './FundsTable';
import { useFundRows } from './hooks';

interface Props {
  id: string;
  pageKey: string;
  journeyType: JourneyTypeSelection;
  panelList?: PanelListItem[];
  parameters: { key: string; value: string }[];
}

export type FundWithPercentage = ContentFund & { percentage: number };
export type KeyValueFundsPairs = {
  funds: { key: string; value: number }[];
  namedFunds: { key: string; value: number | string }[];
};

export const DesignationOfFundsBlock: React.FC<Props> = ({ id, panelList, parameters, journeyType, pageKey }) => {
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { labelByKey, buttonByKey, rawMessageByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const stepData = useJourneyStepData<KeyValueFundsPairs>({
    journeyType,
    formKey: id,
    pageKey,
    personType: 'list',
  });
  const modal = useModal();
  const funds = useFundRows();
  const [lastRemovedFund, setLastRemovedFund] = useState<string | null>(null);
  const prefix = id;

  const defaultValues = useMemo<FundWithPercentage[]>(() => {
    if (stepData.values) {
      return stepData.values.funds.map(fund => ({
        ...funds.rows.find(row => row.fundCode === fund.key),
        percentage: fund.value,
      })) as FundWithPercentage[];
    }
    return [];
  }, [stepData.values, funds.rows]);

  useEffect(() => {
    if (stepData.values) {
      funds.update(stepData.values.funds.map(fund => fund.key));
    }
  }, [stepData.values]);

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

  useFormSubmissionBindingHooks({
    cb: () => Promise.resolve({}),
    key: 'funds-selected-list-state',
    isValid: !funds.error,
    initDependencies: [funds.error],
  });

  if (funds.error) {
    return (
      <Stack id={id} data-testid="funds-selection-error">
        {panelByKey(`${prefix}_error`)}
      </Stack>
    );
  }

  return (
    <Stack id={id} gap={12} data-testid="funds-selection">
      <FundsModal
        prefix={prefix}
        rows={funds.rows}
        selectedRows={funds.selected}
        contentPanel={panelByKey(`${prefix}_funds_modal_content`)}
        errorPanel={panelByKey(`${prefix}_funds_modal_error`)}
        isOpen={modal.props.isOpen}
        onClosed={modal.close}
        onSaved={handleFundsUpdate}
      />

      <Box>
        <Button
          {...buttonByKey(`${prefix}_update_funds_selection`)}
          data-testid="funds-open-modal"
          onClick={() => modal.open()}
          loading={stepData.loading || journeyNavigation.loading || submitStepCb.loading}
        />
      </Box>

      <FundsTable
        prefix={prefix}
        rows={funds.selected}
        defaultValues={defaultValues}
        onLoaded={handleFundsUpdate}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />

      {lastRemovedFund && (
        <div className="visually-hidden" role="status" data-testid="funds-selection-removed">
          {labelByKey(`${prefix}_funds_selection_removed`, { name: lastRemovedFund })}
        </div>
      )}
    </Stack>
  );

  function handleDelete(row: ContentFund) {
    funds.update(state => state.filter(fund => fund !== row.fundCode));
    setLastRemovedFund(row.fundName);
  }

  function handleFundsUpdate(selectedFunds: string[]) {
    setLastRemovedFund(null);
    funds.update(selectedFunds);
    modal.close();
  }

  async function handleSubmit(values: FundWithPercentage[]) {
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await stepData.save({
      funds: values.map(fund => ({ key: fund.fundCode, value: +fund.percentage })),
      namedFunds: values.map(fund => ({ key: fund.fundName, value: `${+fund.percentage}%` })),
    });
    await journeyNavigation.goNext();
  }
};
