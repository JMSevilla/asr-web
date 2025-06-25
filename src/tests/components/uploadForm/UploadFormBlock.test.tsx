import { ComponentProps } from 'react';
import { UploadFormBlock } from '../../../components/blocks/uploadForm/UploadFormBlock';
import { useLoadedFiles } from '../../../components/blocks/uploadForm/hooks/useLoadedFiles';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { act, fireEvent, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ loading: false }) }));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../core/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: jest.fn().mockReturnValue({ goNext: jest.fn(), loading: false }),
}));

jest.mock('../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

jest.mock('../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ execute: jest.fn() }),
  useApi: jest.fn().mockReturnValue({}),
}));

jest.mock('../../../core/hooks/useBeforeUnload', () => ({
  useBeforeUnload: jest.fn().mockReturnValue({ continueRoute: jest.fn() }),
}));

jest.mock('../../../core/contexts/dialog/DialogContext', () => ({
  useDialogContext: jest.fn().mockReturnValue({ openDialog: jest.fn() }),
}));

jest.mock('../../../components/blocks/uploadForm/hooks/useLoadedFiles', () => ({
  useLoadedFiles: jest.fn().mockReturnValue({
    list: [],
    loadingUploadedFiles: false,
    uploading: false,
    removing: false,
    uploadErrors: [],
    fileToTag: undefined,
    isFileSuccessfullyUploaded: jest.fn(),
    isTagUploaded: jest.fn(),
    prepareUpload: jest.fn(),
    startUpload: jest.fn(),
    updateTags: jest.fn(),
    editTags: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
    resetUploadErrors: jest.fn(),
  }),
}));

const DEFAULT_PROPS: ComponentProps<typeof UploadFormBlock> = {
  id: 'test',
  pageKey: 'test',
  panelList: [],
  parameters: [{ key: 'test', value: 'test' }],
};

describe('UploadFormBlock', () => {
  const uploadFile = async () => {
    const str = JSON.stringify({ name: 'file' });
    const blob = new Blob([str]);
    const file = new File([blob], 'values.json', {
      type: 'application/JSON',
    });
    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const input = screen.getByTestId('hidden-upload-input');
    await userEvent.upload(input, file);
  };

  it('should render', async () => {
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('upload-form-block')).toBeInTheDocument();
  });

  it('should render tags form', async () => {
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('tags-form')).toBeInTheDocument();
  });

  it('should render upload form panel if present', async () => {
    (usePanelBlock as jest.Mock).mockReturnValueOnce({ panelByKey: jest.fn().mockReturnValueOnce(<div />) });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('upload-form-block-panel-1')).toBeInTheDocument();
  });

  it('should render upload form', async () => {
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('upload-form')).toBeInTheDocument();
  });

  it('should not render upload form if loading uploaded files', async () => {
    (useLoadedFiles as jest.Mock).mockReturnValue({
      loadingUploadedFiles: true,
      list: [],
      isFileSuccessfullyUploaded: jest.fn(),
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.queryByTestId('upload-form')).not.toBeInTheDocument();
  });

  it('should call startFileUpload on file add if only single tag requested', async () => {
    const startUpload = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      startUpload,
      list: [],
      uploadErrors: [],
      isTagUploaded: jest.fn(),
      isFileSuccessfullyUploaded: jest.fn(),
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} parameters={[{ key: 'mandatory_forms', value: 'test' }]} />);
    });
    await act(async () => {
      await uploadFile();
    });
    expect(startUpload).toHaveBeenCalled();
  });

  it('should call prepareUpload on file add if multiple tags requested', async () => {
    const startUpload = jest.fn();
    const prepareUpload = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      startUpload,
      prepareUpload,
      list: [],
      uploadErrors: [],
      isTagUploaded: jest.fn(),
      isFileSuccessfullyUploaded: jest.fn(),
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} parameters={[{ key: 'mandatory_forms', value: 'test;test2' }]} />);
    });
    await act(async () => {
      await uploadFile();
    });
    expect(startUpload).not.toHaveBeenCalled();
    expect(prepareUpload).toHaveBeenCalled();
  });

  it('should call handleModalSave on modal save', async () => {
    const startUpload = jest.fn();
    const prepareUpload = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      startUpload,
      prepareUpload,
      list: [],
      uploadErrors: [],
      fileToTag: { content: new File([], 'test'), tags: [] },
      isTagUploaded: jest.fn(),
      isFileSuccessfullyUploaded: jest.fn(),
    });
    await act(async () => {
      render(
        <UploadFormBlock
          {...DEFAULT_PROPS}
          parameters={[
            { key: 'mandatory_forms', value: 'tag1;tag2' },
            { key: 'optional_forms', value: 'tag3;tag4' },
          ]}
        />,
      );
    });
    await act(async () => {
      await uploadFile();
    });
    expect(startUpload).not.toHaveBeenCalled();
    expect(prepareUpload).toHaveBeenCalled();

    await act(async () => {
      await userEvent.click(screen.getByTestId('tag1'));
      await userEvent.click(screen.getByTestId('tag2'));
    });

    await act(async () => {
      await userEvent.click(screen.getByText('[[test__modal_save]]'));
    });

    expect(startUpload).toHaveBeenCalled();
  });

  it('should call resetUploadErrors on modal close', async () => {
    const resetUploadErrors = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      resetUploadErrors,
      list: [],
      uploadErrors: [],
      fileToTag: { content: new File([], 'test'), tags: [] },
      isTagUploaded: jest.fn(),
      prepareUpload: jest.fn(),
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      await uploadFile();
    });
    expect(resetUploadErrors).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.keyDown(screen.getByText('[[test__modal_save]]'), {
        key: 'Escape',
        code: 'Escape',
      });
    });

    expect(resetUploadErrors).toHaveBeenCalled();
  });

  it('should call editTags on file edit', async () => {
    const editTags = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      editTags,
      list: [{ content: new File([], 'test'), tags: ['tag1', 'tag2'], uuid: 'test' }],
      uploadErrors: [],
      fileToTag: { content: new File([], 'test'), tags: [], uuid: 'test' },
      isTagUploaded: jest.fn(),
      prepareUpload: jest.fn(),
    });
    await act(async () => {
      render(
        <UploadFormBlock
          {...DEFAULT_PROPS}
          parameters={[
            { key: 'mandatory_forms', value: 'tag1;tag2' },
            { key: 'optional_forms', value: 'tag3;tag4' },
          ]}
        />,
      );
    });
    expect(editTags).not.toHaveBeenCalled();

    await act(async () => {
      await userEvent.click(screen.getByTestId('edit-btn-0'));
    });
    expect(editTags).toHaveBeenCalled();
  });

  it('should call submitJourneyStep if journeyType is present on submit', async () => {
    const submitStepCb = jest.fn();
    (useSubmitJourneyStep as jest.Mock).mockReturnValue({ execute: submitStepCb, loading: false });
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} journeyType="retirement" />);
    });
    expect(submitStepCb).toHaveBeenCalled();
  });

  it('should call journeyNavigation.goNext on submit', async () => {
    const goNext = jest.fn();
    (useJourneyNavigation as jest.Mock).mockReturnValue({ goNext, loading: false });
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} />);
    });
    expect(goNext).toHaveBeenCalled();
  });

  it('should call remove all files on mount and call useApiCallback on submit if delete_all_files is true', async () => {
    const removeAll = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      removeAll,
      list: [],
      uploadErrors: [],
      isTagUploaded: jest.fn(),
    });
    const execute = jest.fn();
    (useApiCallback as jest.Mock).mockReturnValue({ execute });
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} parameters={[{ key: 'delete_all_files', value: 'true' }]} />);
    });
    expect(removeAll).toHaveBeenCalled();
    expect(execute).toHaveBeenCalled();
  });

  it('should not call remove all files if delete_all_files is false', async () => {
    const removeAll = jest.fn();
    (useLoadedFiles as jest.Mock).mockReturnValue({
      removeAll,
      list: [],
      uploadErrors: [],
      isTagUploaded: jest.fn(),
    });
    await act(async () => {
      render(<UploadFormBlock {...DEFAULT_PROPS} parameters={[{ key: 'delete_all_files', value: 'false' }]} />);
    });
    expect(removeAll).not.toHaveBeenCalled();
  });
});
