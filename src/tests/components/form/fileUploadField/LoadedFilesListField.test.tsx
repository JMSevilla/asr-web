import { LoadedFilesListElement } from '../../../../components/form/fileUploadField/LoadedFilesListField';
import { useModal } from '../../../../core/hooks/useModal';
import { act, render, screen, userEvent } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));
jest.mock('../../../../core/hooks/useModal', () => ({
  useModal: jest.fn().mockReturnValue({
    open: jest.fn(),
    close: jest.fn(),
    props: {
      isOpen: false,
      context: 'string',
    },
  }),
}));

describe('LoadedFilesListElement', () => {
  it('should render all labels', () => {
    render(
      <LoadedFilesListElement
        prefix="prefix"
        noFilesUploadedLabel="noFilesUploadedLabel"
        uploadsColumnLabel="uploadsColumnLabel"
        tagsColumnLabel="tagsColumnLabel"
        clearInfoMessages={jest.fn()}
      />,
    );

    expect(screen.getByText('noFilesUploadedLabel')).toBeInTheDocument();
    expect(screen.getByText('uploadsColumnLabel')).toBeInTheDocument();
    expect(screen.getByText('tagsColumnLabel')).toBeInTheDocument();
  });

  it('should render all files', () => {
    render(
      <LoadedFilesListElement
        prefix="prefix"
        files={[
          { content: new File([], 'file1'), tags: [] },
          { content: new File([], 'file2'), tags: [] },
        ]}
        noFilesUploadedLabel={''}
        uploadsColumnLabel={''}
        tagsColumnLabel={''}
        clearInfoMessages={jest.fn()}
      />,
    );

    expect(screen.getByText('file1')).toBeInTheDocument();
    expect(screen.getByText('file2')).toBeInTheDocument();
  });

  it('should render all tags', () => {
    render(
      <LoadedFilesListElement
        prefix="prefix"
        files={[
          { content: new File([], 'file1'), tags: ['tag1', 'tag2'] },
          { content: new File([], 'file2'), tags: ['tag3'] },
        ]}
        tagLabelByKey={key => key}
        noFilesUploadedLabel={''}
        uploadsColumnLabel={''}
        tagsColumnLabel={''}
        clearInfoMessages={jest.fn()}
      />,
    );

    expect(screen.getByTestId('file-tag-tag1')).toBeInTheDocument();
    expect(screen.getByTestId('file-tag-tag2')).toBeInTheDocument();
    expect(screen.getByTestId('file-tag-tag3')).toBeInTheDocument();
  });

  it('should open remove modal when remove icon is clicked', async () => {
    jest.mocked(useModal<string>).mockReturnValue({
      open: jest.fn(),
      close: jest.fn(),
      props: {
        isOpen: false,
        context: 'string',
      },
    });
    const modal = useModal();
    const onRemove = jest.fn();
    render(
      <LoadedFilesListElement
        prefix="prefix"
        files={[{ content: new File([], 'file1'), tags: [] }]}
        onFileRemove={onRemove}
        tagLabelByKey={key => key}
        noFilesUploadedLabel={''}
        uploadsColumnLabel={''}
        tagsColumnLabel={''}
        clearInfoMessages={jest.fn()}
      />,
    );

    await act(() => userEvent.click(screen.getByTestId('remove-btn-0')));

    expect(modal.open).toHaveBeenCalledTimes(1);
  });
  it('should call onRemove when remove button is clicked', async () => {
    jest.mocked(useModal<string>).mockReturnValue({
      open: jest.fn(),
      close: jest.fn(),
      props: {
        isOpen: true,
        context: 'string',
      },
    });

    const onRemove = jest.fn();
    render(
      <LoadedFilesListElement
        prefix="prefix"
        files={[{ content: new File([], 'file1'), tags: [] }]}
        onFileRemove={onRemove}
        tagLabelByKey={key => key}
        noFilesUploadedLabel={''}
        uploadsColumnLabel={''}
        tagsColumnLabel={''}
        clearInfoMessages={jest.fn()}
      />,
    );

    await act(() => userEvent.click(screen.getByText('[[prefix_modal_remove]]')));

    expect(screen.getByText('[[prefix_modal_remove]]')).toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = jest.fn();
    render(
      <LoadedFilesListElement
        prefix="prefix"
        files={[{ content: new File([], 'file1'), tags: [] }]}
        onFileEdit={onEdit}
        tagLabelByKey={key => key}
        noFilesUploadedLabel={''}
        uploadsColumnLabel={''}
        tagsColumnLabel={''}
        clearInfoMessages={jest.fn()}
      />,
    );

    await act(() => userEvent.click(screen.getByTestId('edit-btn-0')));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
