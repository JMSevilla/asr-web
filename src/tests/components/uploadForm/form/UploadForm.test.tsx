import { ReactNode } from 'react';
import { UploadForm } from '../../../../components/blocks/uploadForm/form/UploadForm';
import { act, render, screen } from '../../../common';

const DEFAULT_PROPS = {
  prefix: 'test',
  loading: false,
  fileType: ['image'],
  maxFileSize: 200,
  maxFilesCount: 10,
  defaultValues: { files: [] },
  removing: false,
  uploading: false,
  uploadErrors: ['none'],
  uploadedFiles: [],
  panelElement: (<div>Panel Element Content</div>) as ReactNode,
  submitEnabled: false,
  isFileSuccessfullyUploaded: jest.fn(),
  onSubmit: jest.fn(),
  onFileEdit: jest.fn(),
  onFileRemove: jest.fn(),
  onFileAdded: jest.fn(),
  clearInfoMessages: jest.fn(),
};

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));
jest.mock('../../../../core/router', () => ({ useRouter: jest.fn() }));

describe('UploadForm', () => {
  it('should render', () => {
    act(() => {
      render(<UploadForm {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('upload-form')).toBeInTheDocument();
  });
});
