import { useLoadedFiles } from '../../../../components/blocks/uploadForm/hooks/useLoadedFiles';
import { useApi, useApiCallback } from '../../../../core/hooks/useApi';
import { act, renderHook, waitFor } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ loading: false }),
  useApiCallback: jest
    .fn()
    .mockReturnValue({ execute: jest.fn().mockReturnValue({ data: { uuid: 'uuid' } }), loading: false }),
}));

const journeyType = 'transfer2';
const tags = ['tag'];

describe('useLoadedFiles', () => {
  it('should return empty list', () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
  });

  it('should prepare upload', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
    const file = new File([], 'file');
    act(() => {
      result.current.prepareUpload(file);
    });
    expect(result.current.fileToTag).toStrictEqual({ content: file, tags: [], uuid: null, index: 0 });
  });

  it('should preupload and start upload', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
    const file = new File([], 'file');
    act(() => {
      result.current.prepareUpload(file);
    });
    await act(async () => {
      await result.current.startUpload(result.current.fileToTag!.content, ['tag']);
    });
    expect(result.current.fileToTag).toStrictEqual(undefined);
    expect(result.current.list).toStrictEqual([{ content: file, tags: ['tag'], uuid: 'uuid', index: 0 }]);
  });

  it('should upload', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
    const file = new File([], 'file');
    await act(async () => {
      await result.current.startUpload(file, ['tag']);
    });
    expect(result.current.list).toStrictEqual([{ content: file, tags: ['tag'], uuid: 'uuid', index: 0 }]);
  });

  it('should edit tags', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
    const file = new File([], 'file');
    await act(async () => {
      await result.current.startUpload(file, ['tag']);
    });
    act(() => {
      result.current.editTags({ content: file, tags: ['tag'] });
    });
    await act(async () => {
      await result.current.updateTags(['tag2', 'tag3']);
    });
    expect(result.current.list).toStrictEqual([{ content: file, tags: ['tag2', 'tag3'], uuid: 'uuid', index: 0 }]);
  });

  it('should remove correct file', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
    const file1 = new File([], 'file1');
    const file2 = new File([], 'file2');
    await act(async () => {
      await result.current.startUpload(file1, ['tag1']);
      await result.current.startUpload(file2, ['tag2']);
    });
    await act(async () => {
      await result.current.remove(file1);
    });
    expect(result.current.list).toStrictEqual([{ content: file2, tags: ['tag2'], uuid: 'uuid', index: 0 }]);
  });

  it('should remove all files', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.list).toStrictEqual([]);
    const file1 = new File([], 'file1');
    const file2 = new File([], 'file2');
    await act(async () => {
      await result.current.startUpload(file1, ['tag1']);
      await result.current.startUpload(file2, ['tag2']);
    });
    await act(async () => {
      await result.current.removeAll();
    });
    expect(result.current.list).toStrictEqual([]);
  });

  it('should return correct isTagUploaded value', async () => {
    const { result } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.isTagUploaded('tag')).toBe(false);
    const file = new File([], 'file');
    await act(async () => {
      await result.current.startUpload(file, ['tag']);
    });
    expect(result.current.isTagUploaded('tag')).toBe(true);
  });

  it('should return correct loadingUploadedFiles value', async () => {
    jest.mocked(useApi).mockReturnValueOnce({ loading: true } as any);
    const { result, rerender } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.loadingUploadedFiles).toBe(true);
    jest.mocked(useApi).mockReturnValueOnce({ loading: false } as any);
    rerender();
    expect(result.current.loadingUploadedFiles).toBe(false);
  });

  it('should return correct uploading value', async () => {
    jest.mocked(useApiCallback).mockReturnValueOnce({ loading: true } as any);
    const { result, rerender } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.uploading).toBe(true);
    jest.mocked(useApiCallback).mockReturnValueOnce({ loading: false } as any);
    rerender();
    expect(result.current.uploading).toBe(false);
  });

  it('should return correct uploadErrors value', async () => {
    jest.mocked(useApiCallback).mockReturnValueOnce({ error: ['error'] } as any);
    const { result, rerender } = renderHook(() => useLoadedFiles(journeyType, tags));
    expect(result.current.uploadErrors).toStrictEqual(['error']);
    jest.mocked(useApiCallback).mockReturnValueOnce({ error: null } as any);
    rerender();
    expect(result.current.uploadErrors).toStrictEqual([]);
  });

  describe('document type filtering', () => {
    const mockFiles = [
      { uuid: 'uuid1', filename: 'file1.pdf', tags: ['tag1'], documentType: null },
      { uuid: 'uuid2', filename: 'file2.pdf', tags: ['tag2'], documentType: undefined },
      { uuid: 'uuid3', filename: 'file3.pdf', tags: ['tag3'], documentType: 'invoice' },
      { uuid: 'uuid4', filename: 'file4.pdf', tags: ['tag4'], documentType: 'receipt' },
      { uuid: 'uuid5', filename: 'file5.pdf', tags: ['tag5'], documentType: 'invoice' },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      jest.mocked(useApi).mockImplementation((asyncFn) => {
        asyncFn({
          mdp: {
            documents: () => Promise.resolve({ data: mockFiles }),
            bereavementDocuments: () => Promise.resolve({ data: mockFiles }),
          }
        } as any);
        return { loading: false } as any;
      });
      jest.mocked(useApiCallback).mockReturnValue({
        execute: jest.fn().mockReturnValue({ data: { uuid: 'uuid' } }),
        loading: false,
        reset: jest.fn()
      } as any);
    });

    it('should show files with null documentType when documentType is undefined', async () => {
      const { result } = renderHook(() => useLoadedFiles(journeyType, tags, undefined));
      await waitFor(() => {
        expect(result.current.list).toHaveLength(2);
      });
      expect(result.current.list.map(f => f.content.name)).toEqual(['file1.pdf', 'file2.pdf']);
    });

    it('should show files with null documentType when documentType is null', async () => {
      const { result } = renderHook(() => useLoadedFiles(journeyType, tags, null as any));
      await waitFor(() => {
        expect(result.current.list).toHaveLength(2);
      });
      expect(result.current.list.map(f => f.content.name)).toEqual(['file1.pdf', 'file2.pdf']);
    });

    it('should show only files with matching string documentType', async () => {
      const { result } = renderHook(() => useLoadedFiles(journeyType, tags, 'invoice'));
      await waitFor(() => {
        expect(result.current.list).toHaveLength(2);
      });
      expect(result.current.list.map(f => f.content.name)).toEqual(['file3.pdf', 'file5.pdf']);
    });

    it('should show only files with different matching string documentType', async () => {
      const { result } = renderHook(() => useLoadedFiles(journeyType, tags, 'receipt'));
      await waitFor(() => {
        expect(result.current.list).toHaveLength(1);
      });
      expect(result.current.list.map(f => f.content.name)).toEqual(['file4.pdf']);
    });

    it('should show no files when documentType does not match any files', async () => {
      const { result } = renderHook(() => useLoadedFiles(journeyType, tags, 'nonexistent'));
      await waitFor(() => {
        expect(result.current.list).toHaveLength(0);
      });
    });
  });
});
