import { useMemo, useEffect } from 'react';
import { useCachedAccessKey } from './useCachedAccessKey';
import { useAuthContext } from '../contexts/auth/AuthContext';
import { useApi } from './useApi';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { doesAccessKeyHaveWordingFlag } from '../../business/access-key';
import { getItem, setItem, removeItem } from '../session-storage';

/**
 * Custom hook that monitors wording flags and automatically deletes identity documents
 * when the 'idv_additionaldoc-idv_additional_no' flag is present.
 * 
 * This hook:
 * - Checks for the specific wording flag in the user's content access key
 * - Only processes once per session when flag is first detected (performance optimized)
 * - For journey type 'Identity': deletes ALL documents
 * - For other journey types: deletes only documents with documentType 'Identity'
 * - Only operates when the user is authenticated
 * 
 * @param journeyType - The journey type to check documents for
 * @returns Object containing flag status and any errors
 */
export const useDocumentCleanup = (journeyType: JourneyTypeSelection) => {
  const cachedAccessKey = useCachedAccessKey();
  const { isAuthenticated } = useAuthContext();
  
  const hasNoDocumentsFlag = useMemo(() => {
    return doesAccessKeyHaveWordingFlag(
      cachedAccessKey.data?.contentAccessKey, 
      'idv_additionaldoc-idv_additional_no'
    );
  }, [cachedAccessKey.data?.contentAccessKey]);

  const sessionKey = journeyType ? `wordingFlag_processed_${journeyType}` : null;

  const deleteDocuments = useApi(async api => {
    if (shouldSkipProcessing(hasNoDocumentsFlag, isAuthenticated, journeyType, sessionKey)) {
      return Promise.resolve();
    }

    const documentJourneyType = getDocumentJourneyType(journeyType);
    const documentsResult = await api.mdp.documents(documentJourneyType);
    const documentsToDelete = getDocumentsToDelete(documentsResult.data, journeyType);

    if (documentsToDelete.length > 0) {
      await Promise.allSettled(
        documentsToDelete.map(uuid => api.mdp.deleteDocument(uuid))
      );
    }

    setItem(sessionKey!, 'processed');
  }, [hasNoDocumentsFlag, isAuthenticated, sessionKey, journeyType]);

  useEffect(() => {
    if (!hasNoDocumentsFlag && sessionKey) {
      removeItem(sessionKey);
    }
  }, [hasNoDocumentsFlag, sessionKey]);

  return {
    hasNoDocumentsFlag,
    isDeleting: deleteDocuments.loading,
    error: deleteDocuments.error?.message || null,
  };
};

export const getDocumentsToDelete = (documents: any[], journeyType: JourneyTypeSelection): string[] => {
  if (journeyType === 'Identity' || journeyType === 'transfer2') {
    return documents.map(doc => doc.uuid);
  }
  
  return documents
    .filter(doc => doc.documentType === 'Identity')
    .map(doc => doc.uuid);
};

export const getDocumentJourneyType = (journeyType: JourneyTypeSelection): JourneyTypeSelection => {
  return journeyType === 'transfer2' ? 'Identity' : journeyType;
};

export const shouldSkipProcessing = (
  hasFlag: boolean,
  isAuthenticated: boolean,
  journeyType: JourneyTypeSelection | null,
  sessionKey: string | null
): boolean => {
  if (!hasFlag || !isAuthenticated || !journeyType || !sessionKey) {
    return true;
  }

  if (getItem(sessionKey)) {
    return true;
  }

  return false;
};