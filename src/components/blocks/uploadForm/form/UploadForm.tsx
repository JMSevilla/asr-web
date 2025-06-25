import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileUploadField, FileWithTags, LoadedFilesListField } from '../../..';
import { formatBytes, formatTagKey } from '../../../../business/files';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { UploadFormType, fileValidationErrors, uploadFormSchema } from './validation';

interface Props {
  prefix: string;
  loading?: boolean;
  fileType?: string[];
  maxFileSize?: number;
  maxFilesCount?: number;
  defaultValues?: UploadFormType;
  removing?: boolean;
  uploading?: boolean;
  uploadErrors?: string[];
  uploadedFiles?: FileWithTags[];
  panelElement?: React.ReactNode;
  submitEnabled: boolean;
  tagsColumnHidden?: boolean;
  fileDeleted?: boolean;
  fileEdited?: boolean;
  fileUploaded?: boolean;
  clearInfoMessages(): void;
  onSubmit(values: UploadFormType): void;
  onFileEdit?(file: FileWithTags): void;
  onFileRemove?(file: File): void;
  onFileAdded?(file: File): void;
}

export const UploadForm: React.FC<Props> = ({
  loading,
  prefix,
  defaultValues,
  fileType,
  maxFileSize,
  maxFilesCount,
  uploading,
  removing,
  uploadErrors,
  uploadedFiles,
  panelElement,
  submitEnabled,
  fileDeleted,
  fileEdited,
  fileUploaded,
  clearInfoMessages,
  tagsColumnHidden,
  onSubmit,
  onFileEdit,
  onFileRemove,
  onFileAdded,
}) => {
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const validationSchema = uploadFormSchema(prefix, fileType, maxFilesCount, maxFileSize);
  const form = useForm<UploadFormType>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: { ...validationSchema.getDefault(), ...defaultValues },
  });
  const [preUploadErrors, setPreUploadErrors] = useState<string[]>([]);
  const [fileOnUpload, setFileOnUpload] = useState<File | null>(null);
  const translationTokens = {
    max_files: String(maxFilesCount),
    file_type: fileType?.map(t => `"${t}"`).join(', '),
    file_size: formatBytes(maxFileSize || 0),
  };

  useFormSubmissionBindingHooks({
    key: prefix,
    isValid: submitEnabled && !uploading && !removing,
    cb: () => form.handleSubmit(onSubmit)(),
  });

  useEffect(() => {
    form.reset({ ...defaultValues });
  }, [defaultValues, uploadErrors?.length]);

  return (
    <Stack spacing={12} component="form" data-testid="upload-form">
      {/* @ts-ignore */}
      <FileUploadField
        name="files"
        acceptTypes={fileType}
        isLoading={loading}
        control={form.control}
        uploadButton={buttonByKey(`${prefix}_upload`)}
        isUploading={uploading}
        isRemoving={removing}
        uploadErrors={uploadErrors}
        preUploadErrors={preUploadErrors}
        fileOnUploadName={fileOnUpload?.name}
        dragActiveLabel={labelByKey(`${prefix}_drag_active`)}
        dragLabel={labelByKey(`${prefix}_drag`)}
        tokens={translationTokens}
        onUpload={handleUpload}
        clearInfoMessages={clearInfoMessages}
        fileUploaded={fileUploaded}
        fileDeleted={fileDeleted}
        fileEdited={fileEdited}
      />
      {panelElement}
      <LoadedFilesListField
        prefix={prefix}
        name="files"
        control={form.control}
        files={uploadedFiles}
        onFileEdit={onFileEdit}
        onFileRemove={onFileRemove}
        isUploading={uploading}
        isLoading={loading}
        tagsColumnHidden={tagsColumnHidden}
        tagLabelByKey={(key: string) => labelByKey(`${prefix}_${formatTagKey(key)}`)}
        noFilesUploadedLabel={labelByKey(`${prefix}_no_files`)}
        uploadsColumnLabel={labelByKey(`${prefix}_uploads_col`)}
        tagsColumnLabel={labelByKey(`${prefix}_tags_col`)}
        clearInfoMessages={clearInfoMessages}
      />
    </Stack>
  );

  function handleUpload(fileList: FileList | null) {
    setFileOnUpload(null);
    setPreUploadErrors([]);
    clearInfoMessages();
    const newFiles = Array.from(fileList || []);
    try {
      if (newFiles?.length !== 1) {
        throw Error();
      }
      // @ts-ignore-next-line
      const files = form.getValues('files');
      validationSchema.validateSync({ files: [...files.slice(0, -newFiles.length), ...newFiles] });
      handleSuccessfulFileUpload(newFiles[0]);
    } catch (e) {
      handleFailedFilesUpload(newFiles);
    }
  }

  function handleSuccessfulFileUpload(file: File) {
    form.clearErrors();
    setPreUploadErrors([]);
    onFileAdded?.(file);
    setFileOnUpload(file);
  }

  function handleFailedFilesUpload(failedFiles: File[]) {
    // @ts-ignore-next-line
    const files = form.getValues('files');
    if (failedFiles.length > 1) {
      form.clearErrors();
      setPreUploadErrors([fileValidationErrors(prefix).multipleFiles]);
    }
    const indexesToRemove = failedFiles.map(failedFile => files.findLastIndex(file => file.name === failedFile.name));
    const filteredFiles = files.filter((_, idx) => !indexesToRemove.includes(idx));
    form.setValue('files', filteredFiles);
  }
};
