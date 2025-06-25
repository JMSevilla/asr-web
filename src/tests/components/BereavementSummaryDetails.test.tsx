import { BereavementSummaryDetails } from '../../components/blocks/bereavementSummary/BereavementSummaryDetails';
import { BereavementSummaryDetailsValuePath } from '../../components/blocks/bereavementSummary/types';
import { render } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

const fields: { key: string; value: BereavementSummaryDetailsValuePath; disabled?: boolean }[] = [
  { key: 'field1', value: 'address', disabled: false },
  { key: 'field2', value: 'address.country', disabled: true },
];

describe('BereavementSummaryDetails', () => {
  it('should render BereavementSummaryDetails component correctly', () => {
    const prefixedLabelMock = jest.fn((label: string) => `Prefixed ${label}`);
    const parsedValueMock = jest.fn((type: string, value: string) => `Parsed ${value}`);

    const { getByText } = render(
      <BereavementSummaryDetails
        fields={fields}
        loading={false}
        personType="person_type"
        actionButton={<button>Action Button</button>}
        prefixedLabel={prefixedLabelMock}
        parsedValue={parsedValueMock}
      />,
    );

    expect(getByText('Prefixed person_type')).toBeInTheDocument();
    expect(getByText('Prefixed person_type_field1')).toBeInTheDocument();
  });
});
