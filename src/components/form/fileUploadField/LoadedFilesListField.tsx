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
import { areFilesSame } from '../../../business/files';
import { CmsButton } from '../../../cms/types';
import { FileWithTags, LoadedFilesList } from './LoadedFilesList';

interface Props<T extends object> {
  name: Path<T>;
  prefix: string;
  control: Control<T>;
  defaultValue?: UnpackNestedValue<FieldPathValue<T, FieldPath<T>>>;
  noFilesUploadedLabel: string;
  uploadsColumnLabel: string;
  tagsColumnLabel: string;
  uploadButton?: CmsButton;
  isLoading?: boolean;
  isUploading?: boolean;
  isRemoving?: boolean;
  isCancelling?: boolean;
  uploadError?: string;
  files?: FileWithTags[];
  tagsColumnHidden?: boolean;
  tagLabelByKey?(key: string): string;
  onFileEdit?(file: FileWithTags): void;
  onFileRemove?(file: File): void;
  clearInfoMessages(): void;
}

export const LoadedFilesListField = <T extends FieldValues>({ name, control, defaultValue, ...props }: Props<T>) => (
  <DndProvider backend={HTML5Backend}>
    <Controller<T>
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ formState: _, ...controllerProps }) => <LoadedFilesListElement {...controllerProps} {...props} />}
    />
  </DndProvider>
);

interface ComponentProps<T extends object> extends Omit<Props<T>, 'name' | 'control' | 'defaultValue'> {
  field?: ControllerRenderProps<T, Path<T>>;
  fieldState?: ControllerFieldState;
}

export const LoadedFilesListElement = <T extends object>({
  prefix,
  noFilesUploadedLabel,
  uploadsColumnLabel,
  tagsColumnLabel,
  field,
  files,
  isLoading,
  isUploading,
  isRemoving,
  isCancelling,
  tagsColumnHidden,
  onFileEdit,
  onFileRemove,
  tagLabelByKey,
  clearInfoMessages,
}: ComponentProps<T>) => {
  const fileList = Array.from((field?.value as unknown as FileList) || []);

  return (
    <LoadedFilesList
      prefix={prefix}
      files={files ?? fileList.map(file => ({ content: file, tags: [] }))}
      noFilesUploadedLabel={noFilesUploadedLabel}
      uploadsColumnLabel={uploadsColumnLabel}
      tagsColumnLabel={tagsColumnLabel}
      tagLabelByKey={tagLabelByKey}
      onRemove={handleFileRemove}
      onEdit={onFileEdit}
      tagsColumnHidden={tagsColumnHidden}
      isLoading={isLoading || isUploading || isRemoving || isCancelling}
      clearInfoMessages={clearInfoMessages}
    />
  );

  function handleFileRemove(fileToRemove: File) {
    field?.onChange?.(fileList.filter(file => !areFilesSame(file, fileToRemove)) as unknown as FileList);
    onFileRemove?.(fileToRemove);
  }
};
