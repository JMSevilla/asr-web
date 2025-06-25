import { TagsModal } from '../../../../components/blocks/uploadForm/form/TagsModal';
import { act, render, screen, userEvent, waitFor } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../core/router', () => ({ useRouter: jest.fn() }));

describe('TagsModal', () => {
  it('should render', async () => {
    const onSave = jest.fn();
    await act(async () => {
      render(
        <TagsModal
          prefix="prefix"
          isOpen
          mandatoryTags={['form1', 'form2']}
          optionalTags={['form3', 'form4']}
          onSave={onSave}
          onClose={jest.fn()}
        />,
      );
    });
    expect(screen.getByText('[[prefix_form1]] [[prefix_required]]')).toBeInTheDocument();
    expect(screen.getByText('[[prefix_form2]] [[prefix_required]]')).toBeInTheDocument();
    expect(screen.getByText('[[prefix_form3]]')).toBeInTheDocument();
    expect(screen.getByText('[[prefix_form4]]')).toBeInTheDocument();
    expect(screen.getByText('[[prefix_modal_save]]')).toBeInTheDocument();
    expect(screen.getByText('[[prefix_modal_save]]')).toHaveClass('disabled');
    await act(async () => await userEvent.click(screen.getByText('[[prefix_form1]] [[prefix_required]]')));
    expect(screen.getByText('[[prefix_modal_save]]')).not.toHaveClass('disabled');
    await act(async () => await userEvent.click(screen.getByText('[[prefix_modal_save]]')));
    await waitFor(() => expect(onSave).toBeCalledWith(['form1']));
  });
});
