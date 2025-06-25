import { SelectOption } from '../components';

export const classifierLabelByValue = (options: SelectOption[], key: string) =>
  options.find(option => option.value === key)?.label;
