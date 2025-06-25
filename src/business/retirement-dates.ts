import { RetirementTime } from '../api/mdp/types';

export function mapTimeValues(values: RetirementTime) {
  const keys = Object.keys(values) as Array<keyof typeof values>;
  return keys.reduce<{ key: keyof typeof values; value: number }[]>((previous, current) => {
    const value = values[current];

    if (value < 1 || previous.length >= 2) return previous;
    return [...previous, { key: current, value: values[current] }];
  }, []);
}

export function trimLabelKey(value: number, labelKey: string) {
  return value > 1 ? labelKey : labelKey.slice(0, -1);
}
