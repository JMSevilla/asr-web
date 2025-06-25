import { BeneficiariesListItem } from '../../../components/blocks/beneficiariesList/BeneficiariesListItem';
import { BeneficiaryRow } from '../../../components/blocks/beneficiariesList/types';
import { render as renderComponent, screen } from '../../common';

describe('BeneficiariesListItem', () => {
  const mockBeneficiary: BeneficiaryRow = {
    icon: 'person-outline',
    name: 'John Doe',
    relationship: 'Spouse',
    percentage: 75,
    color: '#FF5733',
  };

  const render = (component: React.ReactNode) =>
    renderComponent(
      <table>
        <tbody>{component}</tbody>
      </table>,
    );

  it('renders the beneficiary details correctly', () => {
    render(<BeneficiariesListItem beneficiary={mockBeneficiary} index={0} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Spouse')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays pension beneficiary label when isPensionBeneficiary is true', () => {
    const pensionBeneficiary: BeneficiaryRow = {
      ...mockBeneficiary,
      isPensionBeneficiary: true,
      icon: 'person-done-outline',
    };

    const ariaPensionLabel = 'This person is a pension beneficiary';
    render(
      <BeneficiariesListItem
        beneficiary={pensionBeneficiary}
        index={0}
        ariaPensionBeneficiaryLabel={ariaPensionLabel}
      />,
    );

    expect(screen.getByText(ariaPensionLabel)).toBeInTheDocument();
  });

  it('uses organization icon for organizations', () => {
    const organizationBeneficiary: BeneficiaryRow = {
      ...mockBeneficiary,
      icon: 'briefcase-outline',
      name: 'Charity Foundation',
      relationship: 'Organization',
    };

    render(<BeneficiariesListItem beneficiary={organizationBeneficiary} index={0} />);

    expect(screen.getByText('Charity Foundation')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
  });

  it('applies temporary styling when temporary flag is set', () => {
    render(<BeneficiariesListItem beneficiary={mockBeneficiary} index={0} temporary />);

    const rowElement = screen.getByRole('row', { hidden: true });

    expect(rowElement).toHaveAttribute('tabIndex', '-1');
    expect(rowElement).toHaveAttribute('aria-hidden', 'true');
  });
});
