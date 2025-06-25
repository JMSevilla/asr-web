import { DetailsContainer, SummaryDetailsRow } from '../../';
import { TransferSummaryDetailsSetProps } from './types';

export const TransferSummaryDetails: React.FC<TransferSummaryDetailsSetProps> = ({
  fields,
  loading,
  personType,
  actionButton,
  prefixedLabel,
  parsedValue,
  actionsRow,
}) => (
  <DetailsContainer
    title={prefixedLabel(personType)}
    isLoading={loading}
    actionButton={actionButton}
    actionsRow={actionsRow}
  >
    {fields.map(field => (
      <SummaryDetailsRow
        key={field.key}
        id={`${personType}_${field.key}`}
        label={prefixedLabel(`${personType}_${field.key}`)}
        value={parsedValue(personType, field.value) as string | string[]}
        disabled={field.disabled}
        isDocuments={personType.includes('documents')}
      />
    ))}
  </DetailsContainer>
);
