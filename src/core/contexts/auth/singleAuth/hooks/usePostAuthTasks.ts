import { useState } from 'react';
import { isTrue } from '../../../../../business/boolean';
import { deleteWebchatHistory } from '../../../../genesys';
import { httpClient, useApiCallback } from '../../../../hooks/useApi';
import { useCachedAccessKey } from '../../../../hooks/useCachedAccessKey';
import { initializeAnalyticsUser } from '../../../../mixpanel-tracker';
import { useTenantContext } from '../../../TenantContext';
import { useRetirementContext } from '../../../retirement/RetirementContext';
import { useAccessToken } from '../../hooks';
import { authHeaders } from '../constants';
import { MemberRecord, SingleAuthLoginResponse } from './../../../../../api/mdp/types';
import { SingleAuthData, useSingleAuthStorage } from './useSingleAuthStorage';

/**
 * @description
 * Hook for executing post-authentication tasks. Handles both new user registration
 * and existing user login flows. For new users (identified by externalId), it runs
 * registration before login. For existing users, it only runs login tasks.
 *
 * @returns {{
 * execute: (policy?: string) => Promise<void>,
 * isRunning: boolean}}
 *
 */
export const usePostAuthTasks = () => {
  const { tenant } = useTenantContext();
  const retirement = useRetirementContext();
  const cachedAccessKey = useCachedAccessKey();
  const [saData, setSAData] = useSingleAuthStorage();
  const [isRunning, setIsRunning] = useState(false);
  const accessToken = useAccessToken();
  const isNewUser = isTrue(saData.isNewAccount);

  const eventName = isNewUser ? 'sa post registration success' : 'sa post sign-in success';

  const loginCb = useApiCallback(api => api.mdp.singleAuthLogin());
  const registerCb = useApiCallback(api => api.mdp.singleAuthRegister(tenant.tenantUrl.value));
  const linkedRecordsCb = useApiCallback(api => api.mdp.linkedRecords());
  const initializeJourneysCb = useApiCallback(api => api.mdp.initializeJourneys());
  const analyticsParamsCb = useApiCallback((api, contentAccessKey: string) =>
    api.mdp.analyticsParams(contentAccessKey),
  );

  function extractRefnoFromRegCode(registrationCode: string | undefined) {
    // registration code is BGROUP+REFNO
    const regCodeRefno = registrationCode?.slice(3);
    if (regCodeRefno) return regCodeRefno;
  }

  function getEffectiveRefno(
    { nextUrl, registrationCode, primaryRefno, linkedRefno, isAdmin }: SingleAuthData,
    apiRefno: string,
    isLinkedRefno: boolean = false,
  ): string {
    const refno = extractRefnoFromRegCode(registrationCode) || primaryRefno || apiRefno;
    if (nextUrl) {
      if (isAdmin) {
        return refno;
      }
      if (isLinkedRefno) return linkedRefno ?? primaryRefno;
    } else return apiRefno;

    return primaryRefno ?? apiRefno;
  }

  const loginTasks = async () => {
    const { data, status } = await loginCb.execute();

    if (status !== 200) {
      throw new Error('Login API failed');
    }

    const { businessGroup, referenceNumber, hasMultipleRecords } = data;

    const refno = getEffectiveRefno(saData, referenceNumber);

    httpClient.updateHeaders({
      [authHeaders.bgroup]: businessGroup,
      [authHeaders.refno]: refno,
    });

    let mainRecord: MemberRecord | undefined;
    if (hasMultipleRecords) {
      const { data, status } = await linkedRecordsCb.execute();
      if (status !== 200) {
        throw new Error('Linked Records API failed');
      }

      mainRecord = data.members.find(
        member => member.businessGroup === businessGroup && member.referenceNumber === referenceNumber,
      );

      if (!mainRecord) {
        throw new Error('No matching record found');
      }
    }

    setSAData(prev => {
      return {
        ...prev,
        primaryBgroup: businessGroup,
        primaryRefno: getEffectiveRefno(prev, referenceNumber),
        linkedBgroup: businessGroup,
        linkedRefno: getEffectiveRefno(prev, referenceNumber, true),
        ...(hasMultipleRecords && {
          hasMultipleRecords: true,
          memberRecord: mainRecord!,
        }),
      };
    });

    return data;
  };

  const registrationTasks = async () => {
    const { status } = await registerCb.execute();
    if (status !== 204) {
      throw new Error('Register API failed');
    }
  };

  const handleAuthenticationTasks = async (): Promise<SingleAuthLoginResponse> => {
    httpClient.updateHeaders({
      [authHeaders.bgroup]: (tenant?.businessGroup?.values ?? []).join(','),
    });

    if (isNewUser) {
      await registrationTasks();
    }

    return await loginTasks();
  };

  const execute = async () => {
    try {
      if (!accessToken) {
        throw new Error('Access token not found');
      }
      setIsRunning(true);

      const data = await handleAuthenticationTasks();
      await initializeJourneysCb.execute();

      const mode = data.hasMultipleRecords === true ? 'basic-mode' : 'full';
      const accessKeyResult = await cachedAccessKey.fetch(mode);
      if (accessKeyResult?.schemeType !== 'DC') {
        retirement.init();
      }

      await deleteWebchatHistory();

      const userId = `${data.businessGroup}${data.referenceNumber}`;
      await initializeAnalyticsUser(
        analyticsParamsCb,
        eventName,
        accessKeyResult?.contentAccessKey,
        userId,
        saData.authGuid,
      );

      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  return { execute, isRunning };
};
