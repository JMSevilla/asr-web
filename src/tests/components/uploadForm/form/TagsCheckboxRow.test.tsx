import { TagsCheckboxRow } from '../../../../components/blocks/uploadForm/form/TagsCheckboxRow';
import { act, render, screen, userEvent } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

describe('TagsCheckboxRow', () => {
  it('should render', async () => {
    const label = 'label';
    const onClick = jest.fn();
    render(<TagsCheckboxRow label={label} isChecked={false} onClick={onClick} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    await act(async () => await userEvent.click(screen.getByText(label)));
    expect(onClick).toBeCalledTimes(1);
  });
});
