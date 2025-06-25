import { TagsForm } from '../../../../components/blocks/uploadForm/form/TagsForm';
import { act, render, screen } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../../core/router', () => ({ useRouter: jest.fn() }));

describe('TagsForm', () => {
  it('should render', async () => {
    await act(async () => {
      render(
        <TagsForm
          prefix="prefix"
          mandatoryTags={['form1', 'form2']}
          optionalTags={['form3', 'form4']}
          onSave={jest.fn()}
          onClose={jest.fn()}
          isTagUploaded={jest.fn()}
          modalProps={{ isOpen: false, context: undefined }}
        />,
      );
    });
    expect(screen.getByTestId(`mandatory-form1`)).toBeInTheDocument();
    expect(screen.getByTestId(`mandatory-form2`)).toBeInTheDocument();
    expect(screen.getByTestId(`optional-form3`)).toBeInTheDocument();
    expect(screen.getByTestId(`optional-form4`)).toBeInTheDocument();
  });
});
