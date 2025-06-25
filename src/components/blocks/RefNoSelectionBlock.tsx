import { Box, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MessageType, PrimaryButton, QuestionRadioButton } from '..';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../core/contexts/NotificationsContext';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  newlyRetiredRange: number;
  preRetirementAgePeriod: number;
}

export const RefNoSelectionBlock: React.FC<Props> = ({ id, newlyRetiredRange, preRetirementAgePeriod }) => {
  const { switchUser, isAuthenticated, linkedMembers } = useAuthContext();
  const { labelByKey, errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const cachedAccessKey = useCachedAccessKey();
  const router = useRouter();

  const mainReference = (linkedMembers && linkedMembers[0]?.referenceNumber) || '';
  const [selectedValue, setSelectedValue] = useState<string>(mainReference);

  const switchUserCb = useApiCallback(switchUser);

  useEffect(() => {
    const errors = switchUserCb.error as string[] | undefined;
    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          title: errorByKey('authentication_form_error'),
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [switchUserCb.error, showNotifications, errorByKey, hideNotifications]);

  if (isAuthenticated || !linkedMembers) {
    return null;
  }

  return (
    <Box id={id}>
      <RadioGroup onChange={handleValueChange} value={selectedValue} data-testvalue={selectedValue}>
        <QuestionRadioButton id={`main-reference`} key={mainReference} value={mainReference} label={mainReference} />
        {linkedMembers?.map((referenceNo, idx) => (
          <QuestionRadioButton
            id={`reference-${idx + 1}`}
            key={referenceNo.linkedReferenceNumber}
            value={referenceNo.linkedReferenceNumber}
            label={referenceNo.linkedReferenceNumber}
          />
        ))}
      </RadioGroup>
      <Box mt={8}>
        <PrimaryButton
          data-testid="continue"
          onClick={handleClick}
          disabled={!linkedMembers?.length}
          loading={switchUserCb.loading || cachedAccessKey.loading || router.loading}
        >
          {labelByKey('continue')}
        </PrimaryButton>
      </Box>
    </Box>
  );

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>, value: string) {
    setSelectedValue(value);
  }

  async function handleClick() {
    try {
      const selectedLinkedMember = linkedMembers?.find(r => r.linkedReferenceNumber === selectedValue);
      if (selectedLinkedMember) {
        await switchUserCb.execute({
          referenceNumber: selectedLinkedMember.linkedReferenceNumber,
          businessGroup: selectedLinkedMember.linkedBusinessGroup,
        });
      }
      await cachedAccessKey.refresh();
      await router.push(routes => routes.hub);
    } catch {
      return;
    }
  }
};
