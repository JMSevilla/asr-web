import { DetailsContainer } from '../../components/DetailsContainer';
import { SummaryDetailsRow } from '../../components/SummaryDetailsRow';
import { BereavementSummaryDetailsValuePath } from '../../components/blocks/bereavementSummary/types';
import { render } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

const fields: { key: string; value: BereavementSummaryDetailsValuePath; disabled?: boolean }[] = [
  { key: 'field1', value: 'address', disabled: false },
  { key: 'field2', value: 'address.country', disabled: true },
];

describe('DetailsContainer', () => {
  it('should render DetailsContainer component correctly including summary details row', () => {
    const prefixedLabelMock = jest.fn((label: string) => `Prefixed ${label}`);
    const parsedValueMock = jest.fn((type: string, value: string) => `Parsed ${value}`);

    const { getByText } = render(
      <DetailsContainer title="person_type_field1" isLoading={false} actionButton={<button>Action Button</button>}>
        {fields.map(field => (
          <SummaryDetailsRow
            key={field.key}
            id={`person_type_${field.key}`}
            label={prefixedLabelMock(`person_type_${field.key}`)}
            value={parsedValueMock('person_type', field.value)}
            disabled={field.disabled}
          />
        ))}
      </DetailsContainer>,
    );

    expect(getByText('Prefixed person_type_field1')).toBeInTheDocument();
    expect(getByText('Parsed address')).toBeInTheDocument();
    expect(getByText('Prefixed person_type_field2')).toBeInTheDocument();
    expect(getByText('Parsed address.country')).toBeInTheDocument();
  });
});
