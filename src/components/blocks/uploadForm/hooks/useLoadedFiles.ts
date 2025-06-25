import { useState } from 'react';
import { JourneyTypeSelection } from '../../../../api/content/types/page';
import { FileUpdateParams, FileUploadParams } from '../../../../api/mdp/types';
import { areFilesSame, reconstructCombinedTags, splitCombinedTags } from '../../../../business/files';
import { useApi, useApiCallback } from '../../../../core/hooks/useApi';
import { FileWithTags } from '../../../form';

type SavedFile = { uuid: string | null; index: number } & FileWithTags;

export const useLoadedFiles = (journeyType?: JourneyTypeSelection, tags?: string[], documentType?: string) => {
  const [loadedFiles, setLoadedFiles] = useState<SavedFile[]>([]);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileToTag, setFileToTag] = useState<SavedFile>();
  const { uploadFileCb, updateTagsCb, deleteFileCb, deleteAllFilesCb, loadingUploadedFiles } = useUploadApiHooks(
    setLoadedFiles,
    journeyType,
    tags,
    documentType
  );

  function prepareUpload(file: File) {
    setFileToTag({ content: file, tags: [], uuid: null, index: loadedFiles.length });
  }

  async function startUpload(file: File, tags: string[]) {
    if (file) {
      upload(file, tags);
      setFileToTag(undefined);
    }
  }

  function editTags(fileWithTags: FileWithTags) {
    const file = loadedFiles.find(({ content }) => areFilesSame(content, fileWithTags.content));
    setFileToTag(file);
  }

  async function updateTags(tags: string[]) {
    if (fileToTag && tags.length) {
      const alreadyUploadedFile = loadedFiles.find(
        ({ content, uuid }) => areFilesSame(content, fileToTag.content) && uuid,
      );
      const fileUuid = alreadyUploadedFile?.uuid || null;

      if (fileUuid) {
        await updateTagsCb.execute({ fileUuid, tags: splitCombinedTags(tags) });
      }

      setLoadedFiles(files => [
        ...files.filter(({ content }) => !areFilesSame(content, fileToTag.content)),
        { ...fileToTag, uuid: fileUuid, tags },
      ]);

      setFileToTag(undefined);
    }
  }

  async function upload(file: File, tags: string[]) {
    if (!journeyType) return;
    try {
      const result = await uploadFileCb.execute({ 
        file, 
        tags: splitCombinedTags(tags), 
        journeyType,
        documentType 
      });
      if (result.data.uuid) {
        setLoadedFiles(files => [
          ...files.filter(({ content }) => !areFilesSame(content, file)),
          { uuid: result.data.uuid, content: file, tags, index: files.length },
        ]);
        setFileUploaded(true);
      }
    } catch { }
  }

  async function remove(file: File) {
    const uuid = loadedFiles.find(({ content }) => areFilesSame(content, file))?.uuid;
    uuid && (await deleteFileCb.execute(uuid));
    setLoadedFiles(files =>
      files
        .sort(sortByIndex)
        .filter(({ content }) => !areFilesSame(content, file))
        .map((file, index) => ({ ...file, index })),
    );
  }

  async function removeAll() {
    await deleteAllFilesCb.execute();
    setLoadedFiles([]);
  }

  function resetUploadErrors() {
    uploadFileCb.reset();
    updateTagsCb.reset();
  }

  function isTagUploaded(formKey: string) {
    return loadedFiles.some(file => file.tags.includes(formKey) && !!file.uuid);
  }

  function resetFileUploadState() {
    setFileUploaded(false);
  }

  return {
    remove,
    removeAll,
    prepareUpload,
    editTags,
    startUpload,
    updateTags,
    isTagUploaded,
    fileUploaded,
    resetFileUploadState,
    resetUploadErrors,
    fileToTag,
    loadingUploadedFiles,
    uploading: uploadFileCb.loading,
    removing: deleteFileCb.loading || deleteAllFilesCb.loading,
    list: [...loadedFiles].sort(sortByIndex),
    uploadErrors: [...errorCodes(uploadFileCb.error), ...errorCodes(updateTagsCb.error)],
  };
};

const useUploadApiHooks = (
  setLoadedFiles: (files: SavedFile[]) => void,
  journeyType?: JourneyTypeSelection,
  tags?: string[],
  documentType?: string
) => {
  const isBereavementJourney = journeyType === 'bereavement';

  const uploadFileCb = useApiCallback((api, params: FileUploadParams) =>
    isBereavementJourney ? api.mdp.bereavementUploadDocument(params) : api.mdp.uploadDocument(params),
  );

  const updateTagsCb = useApiCallback((api, params: FileUpdateParams) =>
    isBereavementJourney ? api.mdp.bereavementUpdateDocumentTags(params) : api.mdp.updateDocumentTags(params),
  );

  const deleteFileCb = useApiCallback((api, uuid: string) =>
    isBereavementJourney ? api.mdp.bereavementDeleteDocument(uuid) : api.mdp.deleteDocument(uuid),
  );

  const deleteAllFilesCb = useApiCallback(api => {
    if (!journeyType) return Promise.reject();
    return isBereavementJourney ? api.mdp.bereavementDeleteAllDocuments() : api.mdp.deleteAllDocuments(journeyType);
  });

  const { loading: loadingUploadedFiles } = useApi(async api => {
    if (!journeyType) return Promise.reject();
    const result = isBereavementJourney ? await api.mdp.bereavementDocuments() : await api.mdp.documents(journeyType);
    const files = result.data
      .filter(file => file.documentType == documentType)
      .map<SavedFile>((file, index) => {
        const processedTags = reconstructCombinedTags(tags || [], file.tags || []);
        return {
          content: new File([], file.filename),
          tags: processedTags,
          uuid: file.uuid,
          index,
        }
      });
    setLoadedFiles(files);
  });

  return { uploadFileCb, updateTagsCb, deleteFileCb, deleteAllFilesCb, loadingUploadedFiles };
};

const sortByIndex = (a: SavedFile, b: SavedFile) => a.index - b.index;
const errorCodes = (e?: Error): string[] => (e && Array.from(e as any)) || [];
