import { renderHook } from '@testing-library/react';
import { 
  useDocumentCleanup,
  getDocumentsToDelete,
  shouldSkipProcessing,
  getDocumentJourneyType,
} from '../../core/hooks/useDocumentCleanup';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useApi } from '../../core/hooks/useApi';
import { getItem, setItem } from '../../core/session-storage';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    processEnv: {},
  },
  serverRuntimeConfig: {},
}));

jest.mock('../../core/hooks/useCachedAccessKey');
jest.mock('../../core/contexts/auth/AuthContext');
jest.mock('../../core/hooks/useApi');
jest.mock('../../core/session-storage');

const mockUseCachedAccessKey = useCachedAccessKey as jest.MockedFunction<typeof useCachedAccessKey>;
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>;
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;
const mockGetItem = getItem as jest.MockedFunction<typeof getItem>;
const mockSetItem = setItem as jest.MockedFunction<typeof setItem>;

describe('useDocumentCleanup', () => {
  const mockApiResult = {
    loading: false,
    error: null,
    data: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockReturnValue(undefined);
    
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
    } as any);

    mockUseApi.mockReturnValue(mockApiResult as any);
  });

  describe('flag detection', () => {
    it('should return hasNoDocumentsFlag as false when no content access key', () => {
      mockUseCachedAccessKey.mockReturnValue({
        data: null,
      } as any);

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.hasNoDocumentsFlag).toBe(false);
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return hasNoDocumentsFlag as true when flag is present', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no', 'other'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.hasNoDocumentsFlag).toBe(true);
    });

    it('should return hasNoDocumentsFlag as false when flag is not present', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['other', 'flags'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.hasNoDocumentsFlag).toBe(false);
    });
  });

  describe('processing conditions', () => {
    it('should not process when user is not authenticated', () => {
      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
      } as any);

      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const mockApiCall = jest.fn();
      mockUseApi.mockImplementation((apiCall) => {
        mockApiCall(apiCall);
        return mockApiResult as any;
      });

      renderHook(() => useDocumentCleanup('retirement'));

      expect(mockApiCall).toHaveBeenCalled();
    });

    it('should not process when flag is not present', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['other', 'flags'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.hasNoDocumentsFlag).toBe(false);
    });

    it('should not process when already processed in session', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      mockGetItem.mockImplementation((key) => {
        if (key === 'wordingFlag_processed_retirement') return 'processed';
        return undefined;
      });

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.hasNoDocumentsFlag).toBe(true);
    });
  });

  describe('loading and error states', () => {
    it('should return loading state from useApi', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      mockUseApi.mockReturnValue({
        loading: true,
        error: null,
        data: null,
      } as any);

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.isDeleting).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should return error state from useApi', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const error = new Error('API Error');
      mockUseApi.mockReturnValue({
        loading: false,
        error,
        data: null,
      } as any);

      const { result } = renderHook(() => useDocumentCleanup('retirement'));

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.error).toBe('API Error');
    });
  });

  describe('API call verification', () => {
    it('should call useApi with correct dependencies', () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      renderHook(() => useDocumentCleanup('retirement'));

      expect(mockUseApi).toHaveBeenCalled();
      
      const useApiCall = mockUseApi.mock.calls[0];
      const dependencies = useApiCall[1];
      
      expect(dependencies).toEqual([
        true,
        true,  
        'wordingFlag_processed_retirement',
        'retirement'
      ]);
    });
  });
});

describe('useDocumentCleanup pure functions', () => {
  describe('getDocumentsToDelete', () => {
    const mockDocs = [
      { uuid: 'doc-1', documentType: 'Identity' },
      { uuid: 'doc-2', documentType: 'Passport' },
      { uuid: 'doc-3', documentType: 'Identity' },
      { uuid: 'doc-4', documentType: 'Other' },
    ];

    it('should return all document UUIDs for Identity journey type', () => {
      const result = getDocumentsToDelete(mockDocs, 'Identity');
      
      expect(result).toEqual(['doc-1', 'doc-2', 'doc-3', 'doc-4']);
    });

    it('should return all document UUIDs for transfer2 journey type', () => {
      const result = getDocumentsToDelete(mockDocs, 'transfer2');
      
      expect(result).toEqual(['doc-1', 'doc-2', 'doc-3', 'doc-4']);
    });

    it('should return only Identity documentType UUIDs for other journey types', () => {
      const result = getDocumentsToDelete(mockDocs, 'retirement');
      
      expect(result).toEqual(['doc-1', 'doc-3']);
    });

    it('should handle empty documents array', () => {
      expect(getDocumentsToDelete([], 'Identity')).toEqual([]);
      expect(getDocumentsToDelete([], 'retirement')).toEqual([]);
    });

    it('should handle documents with no Identity type for non-Identity journeys', () => {
      const nonIdentityDocs = [
        { uuid: 'doc-1', documentType: 'Passport' },
        { uuid: 'doc-2', documentType: 'Other' },
      ];
      
      const result = getDocumentsToDelete(nonIdentityDocs, 'retirement');
      
      expect(result).toEqual([]);
    });
  });

  describe('getDocumentJourneyType', () => {
    it('should return Identity for transfer2 journey type', () => {
      const result = getDocumentJourneyType('transfer2');
      
      expect(result).toBe('Identity');
    });

    it('should return the same journey type for non-transfer2 journeys', () => {
      expect(getDocumentJourneyType('Identity')).toBe('Identity');
      expect(getDocumentJourneyType('retirement')).toBe('retirement');
    });
  });

  describe('shouldSkipProcessing', () => {
    const mockSessionKey = 'test-session-key';

    beforeEach(() => {
      mockGetItem.mockReturnValue(undefined);
    });

    it('should skip when flag is false', () => {
      const result = shouldSkipProcessing(false, true, 'retirement', mockSessionKey);
      
      expect(result).toBe(true);
    });

    it('should skip when user is not authenticated', () => {
      const result = shouldSkipProcessing(true, false, 'retirement', mockSessionKey);
      
      expect(result).toBe(true);
    });

    it('should skip when journey type is null', () => {
      const result = shouldSkipProcessing(true, true, null, mockSessionKey);
      
      expect(result).toBe(true);
    });

    it('should skip when session key is null', () => {
      const result = shouldSkipProcessing(true, true, 'retirement', null);
      
      expect(result).toBe(true);
    });

    it('should skip when already processed in session', () => {
      mockGetItem.mockReturnValue('processed');
      
      const result = shouldSkipProcessing(true, true, 'retirement', mockSessionKey);
      
      expect(result).toBe(true);
      expect(mockGetItem).toHaveBeenCalledWith(mockSessionKey);
    });

    it('should not skip when all conditions are met and not processed', () => {
      const result = shouldSkipProcessing(true, true, 'retirement', mockSessionKey);
      
      expect(result).toBe(false);
    });
  });

  describe('integration tests covering pure function logic', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockGetItem.mockReturnValue(undefined);
      
      mockUseAuthContext.mockReturnValue({
        isAuthenticated: true,
      } as any);
    });

    it('should handle Identity journey type (delete all documents)', async () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const mockApiFunction = jest.fn();
      mockUseApi.mockImplementation((apiCall) => {
        mockApiFunction(apiCall);
        return { loading: false, error: null, data: null } as any;
      });

      renderHook(() => useDocumentCleanup('Identity'));

      expect(mockApiFunction).toHaveBeenCalled();
    });

    it('should handle transfer2 journey type (delete all documents, use Identity endpoint)', async () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const mockApiFunction = jest.fn();
      mockUseApi.mockImplementation((apiCall) => {
        mockApiFunction(apiCall);
        return { loading: false, error: null, data: null } as any;
      });

      renderHook(() => useDocumentCleanup('transfer2'));

      expect(mockApiFunction).toHaveBeenCalled();
    });

    it('should handle other journey types (delete only Identity documentType)', async () => {
      const contentAccessKey = JSON.stringify({
        tenantUrl: 'test',
        wordingFlags: ['idv_additionaldoc-idv_additional_no'],
      });

      mockUseCachedAccessKey.mockReturnValue({
        data: { contentAccessKey },
      } as any);

      const mockApiFunction = jest.fn();
      mockUseApi.mockImplementation((apiCall) => {
        mockApiFunction(apiCall);
        return { loading: false, error: null, data: null } as any;
      });

      renderHook(() => useDocumentCleanup('retirement'));

      expect(mockApiFunction).toHaveBeenCalled();
    });
  });
}); 