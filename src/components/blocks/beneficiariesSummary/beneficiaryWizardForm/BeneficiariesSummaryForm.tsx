import { Grid, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { Row } from 'react-table';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../../core/contexts/JourneyIndicatorContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useModal } from '../../../../core/hooks/useModal';
import { trackButtonClick } from '../../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../../core/mixpanel-tracker';
import { PrimaryButton, SecondaryButton } from '../../../buttons';
import { ListLoader } from '../../../loaders/ListLoader';
import { BeneficiaryDeleteConfirmationModal } from '../modals/BeneficiaryDeleteConfirmationModal';
import { BeneficiariesTable, BeneficiariesTableField } from './BeneficiariesTableField';
import { useBeneficiaryWizardFormContext } from './BeneficiaryWizardFormContext';
import { BeneficiariesFormType, BeneficiaryFormType } from './types';
import { useBeneficiariesSummaryFormColumns } from './useColumns';

interface BeneficiariesSummaryFormProps extends Omit<BeneficiariesSummaryTableProps, 'beneficiaries'> {
  onError?(): void;
}

interface BeneficiariesSummaryTableProps {
  id?: string;
  onSave?(): void;
  onAdd?(): void;
  previousStep?(): void;
  onEditClick?(values: BeneficiaryFormType): void;
  onRemove?(values: BeneficiaryFormType, index: number): void;
  isLoading: boolean;
  isEditable: boolean;
  modalIsLoading?: boolean;
  withCustomHeader?: boolean;
  isFormDirty?: boolean;
  beneficiaries: BeneficiaryFormType[];
  form?: UseFormReturn<BeneficiariesFormType>;
}

export const BeneficiariesSummaryForm: FC<BeneficiariesSummaryFormProps> = props => {
  const { form } = useBeneficiaryWizardFormContext();

  return (
    <BeneficiariesSummaryTable
      {...props}
      beneficiaries={form.watch('beneficiaries')}
      isFormDirty={form.formState.isDirty}
      form={form}
    />
  );
};

export const BeneficiariesSummaryTable: FC<BeneficiariesSummaryTableProps> = ({
  id,
  isEditable,
  onSave,
  isLoading,
  previousStep,
  onEditClick,
  onAdd,
  onRemove,
  form,
  isFormDirty,
  beneficiaries = [],
  withCustomHeader = false,
  modalIsLoading = false,
}) => {
  const { panelByKey, setIsDirty, isDirty } = useBeneficiaryWizardFormContext();
  const { setCustomHeader } = useJourneyIndicatorContext();
  const { hideNotifications } = useNotificationsContext();
  const { labelByKey } = useGlobalsContext();
  const deleteConfirmationModal = useModal<Row<BeneficiaryFormType>>();
  const columns = useBeneficiariesSummaryFormColumns(beneficiaries, form);

  useEffect(() => {
    withCustomHeader &&
      setCustomHeader({
        title: labelByKey('benef_beneficiaries_summary_header'),
        action: () => {
          hideNotifications();
          previousStep?.();
        },
      });

    return () => setCustomHeader({ title: null, action: null, icon: null });
  }, [withCustomHeader]);

  const [panel1, panel2] = [
    panelByKey('beneficiary_summary_table_panel_1'),
    panelByKey('beneficiary_summary_table_panel_2'),
  ];

  return isLoading ? (
    <ListLoader id={id} loadersCount={4} />
  ) : (
    <>
      <Grid container id={id} data-testid={id} spacing={12}>
        {panel1 && (
          <Grid item xs={12}>
            {panel1}
          </Grid>
        )}
        {!beneficiaries?.length && !isEditable ? (
          <Grid item xs={12}>
            <Typography variant="body1" my={6}>
              {labelByKey('beneficiary_summary_no_data')}
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              {isEditable ? (
                <BeneficiariesTableField
                  name="beneficiaries"
                  columns={columns}
                  editable={isEditable}
                  onEditClick={handleEditClick}
                  isLoading={isLoading}
                  onRemoveRow={handleRemoveClick}
                />
              ) : (
                <BeneficiariesTable data={beneficiaries} isLoading={isLoading} columns={columns} />
              )}
            </Grid>
            {panel2 && (
              <Grid item xs={12}>
                {panel2}
              </Grid>
            )}
            {isEditable && (
              <Grid item xs={12} container spacing={4}>
                <Grid xs={12} sm={4} item>
                  <PrimaryButton
                    fullWidth
                    disabled={!(isFormDirty || isDirty)}
                    onClick={handleSave}
                    loading={isLoading || modalIsLoading}
                    data-testid="beneficiaries-save-btn"
                  >
                    {labelByKey('benef_summary_save')}
                  </PrimaryButton>
                </Grid>
                <Grid xs={12} sm={6} item>
                  <SecondaryButton fullWidth onClick={onAdd} data-testid="beneficiary-add-btn">
                    {labelByKey('benef_add_new_beneficiary')}
                  </SecondaryButton>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Grid>
      <BeneficiaryDeleteConfirmationModal
        isLoading={modalIsLoading}
        onDelete={onRemoveRow}
        onCancel={deleteConfirmationModal.close}
        {...deleteConfirmationModal.props}
      />
    </>
  );

  function handleSave() {
    if (onSave) {
      mixpanelTrackButtonClick({
        Category: 'update beneficiaries',
      });
      trackButtonClick('update beneficiaries');
      onSave();
    }
  }

  function onRemoveRow(row: Row<BeneficiaryFormType>) {
    onRemove?.({ ...row.original, ...row.values } as BeneficiaryFormType, row.index);
    deleteConfirmationModal.close();
  }

  function handleEditClick(row: Row<BeneficiaryFormType>) {
    setIsDirty(true);
    hideNotifications();
    onEditClick?.(beneficiaries.find(x => x.valueId === row.original.valueId)!);
  }

  function handleRemoveClick(row: Row<BeneficiaryFormType>) {
    setIsDirty(true);
    deleteConfirmationModal.open(row);
  }
};
