import { DetailsContainer, SummaryDetailsRow } from '../../';
import { BereavementSummaryDetailsSetProps } from './types';

export const BereavementSummaryDetails: React.FC<BereavementSummaryDetailsSetProps> = ({
  fields,
  loading,
  personType,
  actionButton,
  prefixedLabel,
  parsedValue,
}) => (
  <DetailsContainer title={prefixedLabel(personType)} isLoading={loading} actionButton={actionButton}>
    {fields.map(field => (
      <SummaryDetailsRow
        key={field.key}
        id={`${personType}_${field.key}`}
        label={prefixedLabel(`${personType}_${field.key}`)}
        value={parsedValue(personType, field.value)}
        disabled={field.disabled}
      />
    ))}
  </DetailsContainer>
);
