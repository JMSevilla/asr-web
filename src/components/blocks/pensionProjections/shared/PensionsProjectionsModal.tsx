import { Modal } from '../../..';
import { PensionsProjectionsModalOptions } from './PensionsProjectionsModalOptions';

interface Props {
  open: boolean;
  onClose: () => void;
  ages: number[];
  normalRetirementAge?: number | null;
}
export const PensionsProjectionsModal: React.FC<Props> = ({ open, onClose, ages, normalRetirementAge }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      bottomCloseButton={true}
      data-testid="pension-modal"
      PaperProps={{ sx: { overflow: 'hidden' } }}
    >
      <PensionsProjectionsModalOptions onClose={onClose} ages={ages} normalRetirementAge={normalRetirementAge} />
    </Modal>
  );
};
