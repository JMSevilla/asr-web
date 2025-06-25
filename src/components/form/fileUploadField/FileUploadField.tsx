import { ErrorOutline } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Path,
  UnpackNestedValue,
} from 'react-hook-form';
import { FieldError, FieldSuccess } from '..';
import { CmsButton, InterpolationTokens } from '../../../cms/types';
import { DragAndDropTarget } from './DragAndDropTarget';
import { FileInUploadProgress } from './FileInUploadProgress';
import { FileUploadButton } from './FileUploadButton';

interface Props<T extends object> {
  name: Path<T>;
  control: Control<T>;
  acceptTypes?: string[];
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  dragLabel?: string;
  dragActiveLabel?: string;
  uploadButton?: CmsButton;
  isLoading?: boolean;
  isUploading?: boolean;
  fileEdited?: boolean;
  fileDeleted?: boolean;
  isRemoving?: boolean;
  fileUploaded?: boolean;
  fileOnUploadName?: string;
  uploadErrors?: string[];
  preUploadErrors?: string[];
  tokens?: InterpolationTokens;
  onUpload?(files: FileList | null): void;
  clearInfoMessages(): void;
}

export const FileUploadField = <T extends FieldValues>({ name, control, defaultValue, ...props }: Props<T>) => (
  <DndProvider backend={HTML5Backend}>
    <Controller<T>
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ formState: _, ...controllerProps }) => <FileUploadFieldComponent {...controllerProps} {...props} />}
    />
  </DndProvider>
);

interface ComponentProps<T extends object> extends Omit<Props<T>, 'name' | 'control' | 'defaultValue'> {
  field?: ControllerRenderProps<T, Path<T>>;
  fieldState?: ControllerFieldState;
}

export const FileUploadFieldComponent = <T extends object>({
  field,
  fieldState,
  acceptTypes,
  isLoading,
  isUploading,
  isRemoving,
  uploadErrors,
  preUploadErrors,
  uploadButton,
  dragLabel,
  dragActiveLabel,
  fileOnUploadName,
  tokens,
  onUpload,
  fileEdited,
  fileDeleted,
  fileUploaded,
  clearInfoMessages,
}: ComponentProps<T>) => {
  const fileList = Array.from((field?.value as unknown as FileList) || []);
  const priorityErrors = [fieldState?.error?.message, ...(preUploadErrors || [])].filter(Boolean);
  const secondaryErrors = [...(uploadErrors || [])].filter(Boolean);
  const errors = priorityErrors.length ? (priorityErrors as string[]) : secondaryErrors;

  return (
    <Stack spacing={4}>
      <DragAndDropTarget
        id={`${field?.name}-container`}
        dragActiveLabel={dragActiveLabel}
        dragLabel={dragLabel}
        onDrop={isLoading || isUploading || isRemoving ? undefined : handleFilesUpload}
        isLoading={isLoading}
        uploadButton={
          <FileUploadButton
            name={field?.name || 'file'}
            acceptTypes={acceptTypes}
            isDisabled={isLoading || isUploading || isRemoving}
            onUpload={handleFilesUpload}
            {...uploadButton}
          />
        }
      >
        {isUploading && fileOnUploadName && !errors.length && <FileInUploadProgress title={fileOnUploadName} />}
        {!isLoading && !isUploading && (
          <>
            {!fileEdited && !fileDeleted && fileUploaded && (
              <Stack direction="row" alignItems="flex-start" spacing={1} color="success.main" px={12}>
                <ErrorOutline />
                <FieldSuccess messageKey={'file_upload_success_message'} bolded={false} tokens={tokens} />
              </Stack>
            )}
            {fileEdited && (
              <Stack direction="row" alignItems="flex-start" spacing={1} color="success.main" px={12}>
                <ErrorOutline />
                <FieldSuccess messageKey={'file_upload_edited_message'} bolded={false} tokens={tokens} />
              </Stack>
            )}
            {fileDeleted && (
              <Stack direction="row" alignItems="flex-start" spacing={1} color="success.main" px={12}>
                <ErrorOutline />
                <FieldSuccess messageKey={'file_upload_deleted_message'} bolded={false} tokens={tokens} />
              </Stack>
            )}
          </>
        )}
        {!!errors.length && (
          <Stack>
            {errors.map((error, index) => (
              <Stack key={index} direction="row" alignItems="flex-start" spacing={1} color="error.main" px={12}>
                <ErrorOutline />
                <FieldError messageKey={error} bolded={false} tokens={tokens} />
              </Stack>
            ))}
          </Stack>
        )}
      </DragAndDropTarget>
    </Stack>
  );

  function handleFilesUpload(files: FileList | null) {
    clearInfoMessages();
    field?.onChange?.([...fileList, ...Array.from(files || [])]);
    onUpload?.(files);
  }
};
