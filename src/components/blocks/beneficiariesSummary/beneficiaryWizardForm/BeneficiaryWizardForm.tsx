import { FC } from 'react';
import { FieldErrors } from 'react-hook-form';
import { uid } from 'uid';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useBeforeUnload } from '../../../../core/hooks/useBeforeUnload';
import { useModal } from '../../../../core/hooks/useModal';
import { useWizardForm } from '../../../../core/hooks/useWizardForm';
import { MessageType } from '../../../topAlertMessages';
import { BeneficiarySaveConfirmationModal } from '../modals/BeneficiarySaveConfirmationModal';
import { useBeneficiaryWizardFormContext } from './BeneficiaryWizardFormContext';
import { BeneficiaryFormSteps, BeneficiaryStepProps } from './steps/types';
import { useBeneficiaryWizardSteps } from './steps/useSteps';
import { BeneficiariesFormType, BeneficiaryAddressFormType, BeneficiaryFormType } from './types';

interface Props {
  id?: string;
  onConfirmSave(values: BeneficiaryFormType[]): Promise<void>;
  isLoading: boolean;
  modalIsLoading: boolean;
  isSummaryView?: boolean;
  backUrl?: string;
}

export const BeneficiaryWizardForm: FC<Props> = ({
  id,
  onConfirmSave,
  isLoading,
  modalIsLoading,
  isSummaryView,
  backUrl,
}) => {
  const { labelByKey } = useGlobalsContext();
  const { showNotifications } = useNotificationsContext();
  const { form, dependants, onUpdate, isDirty, setIsDirty } = useBeneficiaryWizardFormContext();
  const saveConfirmationModal = useModal<unknown>();
  const defaultStep = isSummaryView ? 'SummaryView' : 'CreateNewBeneficiary';
  const { continueRoute } = useBeforeUnload(isDirty, saveConfirmationModal.open);
  const steps = useBeneficiaryWizardSteps(
    form.handleSubmit(data => handleSave(data.beneficiaries), onInvalid),
    saveConfirmationModal,
    isSummaryView,
    backUrl,
    id,
  );
  const { renderStep, reset } = useWizardForm<BeneficiaryFormSteps, BeneficiaryFormType, BeneficiaryStepProps>(
    steps,
    formatWizardValues,
    defaultStep,
    onUpdate,
    !!dependants?.length,
  );

  return (
    <>
      {renderStep({ isLoading, modalIsLoading })}
      <BeneficiarySaveConfirmationModal
        isLoading={modalIsLoading}
        onSave={saveConfirmationModal.close}
        onClose={saveConfirmationModal.close}
        onCancel={handleConfirmationCancel}
        {...saveConfirmationModal.props}
      />
    </>
  );

  async function handleConfirmationCancel() {
    saveConfirmationModal.close();
    await continueRoute();
  }

  async function handleSave(values: BeneficiaryFormType[]) {
    try {
      setIsDirty(false);
      await onConfirmSave(values);
      saveConfirmationModal.close();
    } catch (e) {
      const namesWithError =
        values?.reduce((prev, current) => {
          if (!current?.relationship) {
            prev.push(`${current?.forenames ?? ''} ${current?.surname ?? ''}`);
          }

          return prev;
        }, [] as string[]) ?? [];

      const namesErrorText = joinErrorsNames(namesWithError);
      const noRelationShip = values.filter(value => !value.relationship)?.length > 0;
      const errorKey = noRelationShip ? 'benef_summary_save_failed_missing_relationship' : 'benef_summary_save_failed';
      showNotifications([
        { type: MessageType.Problem, message: `${labelByKey(errorKey)} ${noRelationShip ? namesErrorText : ''}` },
      ]);
    }

    reset();
  }

  function onInvalid(errors: FieldErrors<BeneficiariesFormType>) {
    saveConfirmationModal.close();

    if (!errors) return;
    const namesWithError =
      errors.beneficiaries?.reduce((prev, current, index) => {
        if (current?.dateOfBirth?.message) {
          const itemValue = form.getValues('beneficiaries')?.[index];

          prev.push(`${itemValue?.forenames ?? ''} ${itemValue?.surname ?? ''}`);
        }

        return prev;
      }, [] as string[]) ?? [];

    const namesErrorText = joinErrorsNames(namesWithError);
    const incorectAllocationError = errors?.beneficiaries?.find(
      beneficiary => !!(beneficiary?.lumpSumPercentage?.message || beneficiary?.isPensionBeneficiary?.message),
    );

    const errorKey =
      namesErrorText?.length > 0
        ? 'benef_summary_save_failed_missing_dateOfBirth'
        : errors.totalLumpSumPercentage?.message ??
          incorectAllocationError?.isPensionBeneficiary?.message ??
          incorectAllocationError?.lumpSumPercentage?.message ??
          'benef_summary_save_failed';

    showNotifications([
      {
        type: MessageType.Problem,
        message: `${labelByKey(errorKey)} ${namesErrorText} `,
      },
    ]);
  }
};

const joinErrorsNames = (errors: string[]) => {
  return errors?.length > 0 ? (errors.length === 1 ? errors.join() : errors.join(' ')) : '';
};

const formatWizardValues = (
  prev: Partial<BeneficiaryFormType> | undefined,
  values: Partial<BeneficiaryFormType>,
  keepPrevId?: boolean,
): Partial<BeneficiaryFormType> => ({
  ...prev,
  ...values,
  address: {
    ...prev?.address,
    ...values?.address,
  } as BeneficiaryAddressFormType,
  valueId: keepPrevId ? prev?.valueId ?? values?.valueId : values?.valueId ?? prev?.valueId ?? uid(),
});
