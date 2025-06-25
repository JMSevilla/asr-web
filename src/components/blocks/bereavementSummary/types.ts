import { ReactNode } from 'react';
import { Path } from 'react-hook-form';
import { BereavementPersonFormValues } from '../../../core/contexts/persistentAppState/hooks/bereavement/form';

export interface BereavementSummaryDetailsSetProps {
  loading?: boolean;
  actionButton: ReactNode;
  personType: string;
  fields: { key: string; value: BereavementSummaryDetailsValuePath; disabled?: boolean }[];
  prefixedLabel(key?: string): string;
  parsedValue(personType: string, fieldPath: BereavementSummaryDetailsValuePath): string | string[] | undefined;
}

export type BereavementSummaryFormValuePath = Path<BereavementPersonFormValues>;

export type BereavementSummaryDetailsValuePath =
  | BereavementSummaryFormValuePath
  | 'maritalStatus'
  | 'cohabitantsStatus'
  | 'dependantsStatus'
  | 'question'
  | 'uploaded';
