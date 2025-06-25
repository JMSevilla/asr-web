import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ListLoader } from '../../';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { CmsTenant } from '../../../api/content/types/tenant';
import { findValueByKey } from '../../../business/find-in-array';
import { caseInsensitiveEquals, removeTrailingSlash } from '../../../business/strings';
import { config } from '../../../config';
import { logger } from '../../../core/datadog-logs';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { IJourneyEventMetaData, IJourneyState, JourneyEvent } from './types';
import { useSubmitGBGScanId } from './useSubmitGBGScanId';

interface Props {
  id: string;
  pageKey: string;
  tenant: CmsTenant | null;
  parameters: { key: string; value: string }[];
  journeyType: JourneyTypeSelection;
}

const TRUSTED_ORIGINS = config.value.TRUSTED_GBG_ORIGINS?.map(removeTrailingSlash) || [];

export const GBGScanFormBlock: React.FC<Props> = ({ id, pageKey, tenant, journeyType, parameters }) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const sdkUrl = findValueByKey('sdk_url', parameters) ?? '';
  const shouldUseGenericData = +(findValueByKey('version', parameters) ?? '0') >= 2;
  const successPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const failurePageKey = findValueByKey('failure_next_page', parameters) ?? '';
  const journeyDefinitionId = findValueByKey('journey_definition_id', parameters) ?? '';
  const [journeyId, setJourneyId] = useState<string>();
  const gbgAccessToken = useApi(api => api.mdp.createGbgAccessToken());
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const stepData = useJourneyStepData<{ gbgId: string }>({
    journeyType,
    pageKey,
    formKey: id,
    personType: 'id',
    preventFetch: !shouldUseGenericData,
  });
  const saveJourneyIdCb = useSubmitGBGScanId(journeyType);
  const verifyIdentityCb = useApiCallback(api => api.mdp.verifyIdentity(journeyType));

  useEffect(() => {
    if (shouldUseGenericData && journeyId) {
      stepData.save({ gbgId: journeyId });
      return;
    }
    if (journeyId && !saveJourneyIdCb.loading && saveJourneyIdCb.status === 'not-requested') {
      saveJourneyIdCb.execute(journeyId);
    }
  }, [journeyId, shouldUseGenericData]);

  useEffect(() => {
    if (!iFrameRef.current || !sdkUrl || !gbgAccessToken.result?.data.accessToken) {
      return;
    }

    const iframeParams = new URLSearchParams();
    iframeParams.set('primaryColor', (tenant?.primaryColor?.value as string).toString());
    iframeParams.set('journeyDefinitionId', journeyDefinitionId);
    iframeParams.set('nocache', Date.now().toString());
    iframeParams.set('accessToken', gbgAccessToken.result.data.accessToken);
    iframeParams.set('baseUrl', config.value.GBG_BASE_URL);
    iframeParams.set('cacheExpiry', config.value.GBG_CACHE_EXP_MS);
    iframeParams.set('origin', window.origin);
    iFrameRef.current.src = `${sdkUrl}?${iframeParams.toString()}`;

    function onIFrameLoad() {
      iFrameRef.current?.contentWindow?.postMessage({ ready: true }, sdkUrl);
      iFrameRef.current?.removeEventListener('load', onIFrameLoad);
    }

    async function handleGBGScanEvent(
      event: MessageEvent<{ event: JourneyEvent; meta: IJourneyEventMetaData; state: IJourneyState }>,
    ) {
      if (!TRUSTED_ORIGINS.includes(event.origin)) {
        console.warn(`GBGScanFormBlock: Received message from untrusted origin: ${event.origin}`);
        return;
      }

      const isResultStep = event.data.meta?.step === 'result';
      const id = event.data.state?.journey?.journeyId;

      if (id) {
        setJourneyId(id);
      }

      if (!isResultStep) {
        return;
      }

      const isFinished = await event.data.state.journey?.isFinished;
      if (isFinished && !gbgAccessToken.loading) {
        try {
          const verifyIdentity = await verifyIdentityCb.execute();
          const isIdentityVerified =
            caseInsensitiveEquals(verifyIdentity?.data?.documentValidationStatus, 'Passed') &&
            caseInsensitiveEquals(verifyIdentity?.data?.identityVerificationStatus, 'PASS');

          const nextPageKey = isFinished && isIdentityVerified ? successPageKey : failurePageKey;
          await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
          await router.parseUrlAndPush(nextPageKey);
        } catch (error) {
          await router.parseUrlAndPush('error_page_idv');
          logger.error(`Error in verifying identity`, error as Object);
        }
      }
    }

    iFrameRef.current.addEventListener('load', onIFrameLoad);
    window && window.addEventListener('message', handleGBGScanEvent);
    return () => {
      window.removeEventListener('message', handleGBGScanEvent);
    };
  }, [
    sdkUrl,
    pageKey,
    successPageKey,
    failurePageKey,
    tenant?.primaryColor.value,
    gbgAccessToken.result?.data.accessToken,
  ]);

  if (gbgAccessToken.loading || !!verifyIdentityCb.error) {
    return <ListLoader id={id} loadersCount={4} data-testid="gbg-scan-form-loader" />;
  }

  return (
    <Box id={id} height={960} width="100%" data-testid="gbg-scan-form-block">
      <iframe
        id="idscan"
        data-testid="gbg-scan-iframe"
        ref={iFrameRef}
        title="idscan"
        allow="camera *"
        height="960px"
        width="100%"
        style={{ border: 'none' }}
        sandbox={'allow-scripts allow-same-origin allow-forms'}
      />
    </Box>
  );
};
