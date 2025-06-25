import { useMemo } from 'react';
import { useNotificationsContext } from '../../../../../core/contexts/NotificationsContext';
import { useModal } from '../../../../../core/hooks/useModal';
import { useScroll } from '../../../../../core/hooks/useScroll';
import { WizardFormMap } from '../../../../../core/hooks/useWizardForm';
import { BeneficiariesSummaryForm } from '../BeneficiariesSummaryForm';
import { useBeneficiaryWizardFormContext } from '../BeneficiaryWizardFormContext';
import { BeneficiaryFormType } from '../types';
import { ChooseBeneficiaryTypeStep } from './ChooseBeneficiaryTypeStep';
import { CreatePersonBeneficiarySteps } from './CreatePersonBeneficiarySteps';
import { EditCharityBeneficiaryStep } from './EditCharityBeneficiaryStep';
import { EditPersonBeneficiarySteps } from './EditPersonBeneficiarySteps';
import { ChoosePersonBeneficiaryOrAddNewStep } from './personBranch/ChoosePersonBeneficiaryOrAddNewStep';
import { BeneficiaryFormSteps, BeneficiaryStepProps } from './types';

export const useBeneficiaryWizardSteps = (
  onSubmit: VoidFunction,
  saveConfirmationModal: ReturnType<typeof useModal>,
  isSummaryView?: boolean,
  backUrl?: string,
  id?: string,
) => {
  const { scrollTop } = useScroll();
  const { onDelete, setIsDirty } = useBeneficiaryWizardFormContext();
  const { hideNotifications } = useNotificationsContext();

  return useMemo(() => {
    return {
      ...CreatePersonBeneficiarySteps,
      ...EditPersonBeneficiarySteps,
      ...EditCharityBeneficiaryStep,
      CreateNewBeneficiary: {
        nextStep: ({ values, dependantsExist }) =>
          values.type === 'PERSON'
            ? dependantsExist
              ? 'ChoosePersonBeneficiaryOrAddNewStep'
              : 'CreateNewBeneficiaryDetails'
            : 'CreateCharityDetails',
        previousStep: ({ previousStep, router, stepHistory }) => {
          if (!stepHistory?.length && backUrl && previousStep !== 'SummaryView') {
            backUrl && router.push(backUrl);
            return;
          }

          if (previousStep === 'SummaryView') return previousStep;

          return 'SummaryView';
        },
        content: props => <ChooseBeneficiaryTypeStep {...props} />,
      },
      ChooseBeneficiaryType: {
        nextStep: ({ values }) =>
          values.type === 'PERSON' ? 'BeneficiaryTypePerson' : 'EditCharityBeneficiaryDetails',
        previousStep: ({ router, previousStep }) => {
          if (previousStep === 'SummaryView') return previousStep;

          backUrl && router.push(backUrl);
        },
        content: props => <ChooseBeneficiaryTypeStep {...props} />,
      },
      SummaryView: {
        nextStep: 'SummaryView',
        onEnterStep: (values, previousStep) => {
          if (previousStep !== 'CreateNewBeneficiary') return;

          onDelete(values.valueId!, false);
        },
        previousStep: ({ router, values }) => {
          if (backUrl) {
            router.push(backUrl);
            return;
          }

          return values.type === 'PERSON' ? 'BeneficiaryLumpSum' : 'ChooseBeneficiaryType';
        },
        content: props => {
          return (
            <BeneficiariesSummaryForm
              id={id}
              {...props}
              withCustomHeader
              onSave={onSubmit}
              onAdd={() => {
                setIsDirty(true);
                hideNotifications();
                scrollTop();
                props.resetValues();
                props.toStep('CreateNewBeneficiary');
              }}
              isEditable
              onError={saveConfirmationModal.close}
              onRemove={v => onDelete(v.valueId!)}
              onEditClick={row => {
                hideNotifications();
                scrollTop();

                if (row.relationship === 'Charity') {
                  props.toStep('EditCharityBeneficiaryDetails', row);
                  return;
                }

                props.toStep('EditBeneficiaryDetails', row);
              }}
            />
          );
        },
      },
      BeneficiaryTypeCharity: {
        nextStep: 'ChooseBeneficiaryType',
        previousStep: 'ChooseBeneficiaryType',
        content: props => <ChoosePersonBeneficiaryOrAddNewStep {...props} />,
      },
    } as WizardFormMap<BeneficiaryFormSteps, BeneficiaryFormType, BeneficiaryStepProps>;
  }, []);
};
