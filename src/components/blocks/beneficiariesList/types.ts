export type BeneficiaryRow = {
  icon: 'person-outline' | 'person-done-outline' | 'briefcase-outline';
  name: string;
  color?: string;
  relationship: string;
  percentage: number;
  isPensionBeneficiary?: boolean;
};
