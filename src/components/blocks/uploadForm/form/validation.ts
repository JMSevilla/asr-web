import * as yup from 'yup';
import { areFilesSame } from '../../../../business/files';

export const uploadFormSchema = (
  errorKeyPrefix: string,
  fileType?: string[],
  maxFilesCount?: number,
  maxFileSize?: number,
) => {
  const errors = fileValidationErrors(errorKeyPrefix);
  return yup.object({
    files: yup
      .mixed<File[]>()
      .test('maxFilesCount', errors.maxFilesCount, (value = []) => {
        if (!value.length || !maxFilesCount) return true;
        return value.length <= maxFilesCount;
      })
      .test('sameFile', errors.sameFile, (value = []) => {
        if (!value.length || !fileType) return true;
        return value.every((file1, idx1) => !value.some((file2, idx2) => idx1 !== idx2 && areFilesSame(file1, file2)));
      })
      .test('fileType', errors.fileType, (value = []) => {
        if (!value.length || !fileType) return true;
        return fileType.includes(value.at(-1)!.name.split('.').at(-1)!);
      })
      .test('fileSize', errors.fileSize, (value = []) => {
        if (!value.length || !maxFileSize) return true;
        return value.at(-1)!.size < maxFileSize;
      })
      .default<File[]>([]),
  });
};

export type UploadFormType = yup.InferType<ReturnType<typeof uploadFormSchema>>;

export const fileValidationErrors = (prefix: string) => ({
  fileType: `${prefix}_type_error`,
  fileSize: `${prefix}_size_error`,
  sameFile: `${prefix}_unique_error`,
  maxFilesCount: `${prefix}_max_count_error`,
  multipleFiles: `${prefix}_multiple_files_error`,
});
