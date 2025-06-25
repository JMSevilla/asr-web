import { useDrop } from 'react-dnd';
import { DragAndDropTarget } from '../../../../components/form/fileUploadField/DragAndDropTarget';
import { FileUploadFieldComponent } from '../../../../components/form/fileUploadField/FileUploadField';
import { render, screen } from '../../../common';

const labels = {
  upload: 'Upload',
  filesList: 'Files',
  dragActive: 'Drop files here',
  drag: 'Drag and drop files here',
};

const uploadButton = {
  text: 'Upload',
  variant: 'contained',
  color: 'primary',
};

jest.mock('react-dnd', () => ({
  useDrop: jest.fn().mockReturnValue([{ canDrop: false, isOver: false }, jest.fn()]),
}));

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

describe('FileUploadFieldComponent', () => {
  it('should render the upload button', () => {
    render(<FileUploadFieldComponent {...{ labels, uploadButton, clearInfoMessages: jest.fn() }} />);
    expect(screen.getByTestId('hidden-upload-input')).toBeInTheDocument();
  });

  it('should render the upload label', () => {
    render(<FileUploadFieldComponent {...{ labels, uploadButton, clearInfoMessages: jest.fn() }} />);
    expect(screen.getByTestId('upload-button').textContent).toBe(uploadButton.text);
  });

  describe('DragAndDropTarget', () => {
    it('should render drag and drop target with dragLabel label', () => {
      render(<DragAndDropTarget dragActiveLabel="dragActiveLabel" dragLabel="dragLabel" id="dragndrop" />);
      expect(screen.getByText('dragLabel')).toBeInTheDocument();
    });

    it('should render drag and drop target with children', () => {
      render(
        <DragAndDropTarget id="dragndrop" dragActiveLabel="dragActiveLabel" dragLabel="dragLabel">
          <div>children</div>
        </DragAndDropTarget>,
      );
      expect(screen.getByText('dragLabel')).toBeInTheDocument();
      expect(screen.getByText('children')).toBeInTheDocument();
    });

    it('should render drag and drop target with loading', () => {
      render(<DragAndDropTarget id="dragndrop" dragActiveLabel="dragActiveLabel" dragLabel="dragLabel" isLoading />);
      expect(screen.getByText('dragLabel')).toBeInTheDocument();
    });

    it('should render drag active label', () => {
      jest.mocked(useDrop).mockReturnValue([{ canDrop: true, isOver: true }, jest.fn()]);
      render(<DragAndDropTarget id="dragndrop" dragActiveLabel="dragActiveLabel" dragLabel="dragLabel" />);
      expect(screen.getByText('dragActiveLabel')).toBeInTheDocument();
    });
  });
});
