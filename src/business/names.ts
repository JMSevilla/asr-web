import { Membership } from '../api/mdp/types';
import { toTitleCase as capitalize } from './strings';

export const formatFirstName = (forenames?: string | null) => {
  if (!forenames) return '';

  const [firstName] = forenames.trim().split(' ');
  return capitalize(firstName).trim();
};

export const formatFullName = (membership: Membership | null) => {
  if (!membership) return '-';

  const { forenames, surname } = membership;
  const [firstName] = forenames?.trim().split(' ') || [];
  if (firstName && surname) {
    return `${capitalize(firstName)} ${capitalize(surname)}`.trim();
  }

  return `${capitalize(forenames || '')} ${capitalize(surname || '')}`.trim();
};

export function formatInitials(membership: Membership | null) {
  if (!membership) return '-';

  const { forenames, surname } = membership;
  if (forenames && surname) {
    return `${forenames[0].toUpperCase()}${surname[0].toUpperCase()}`;
  }

  const [firstName, secondName] = forenames?.split(' ') || [];
  if (firstName && secondName) {
    return `${firstName[0].toUpperCase()}${secondName[0].toUpperCase()}`;
  }

  return firstName?.[0]?.toUpperCase() || '-';
}
