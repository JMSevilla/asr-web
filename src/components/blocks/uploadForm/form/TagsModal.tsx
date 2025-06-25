import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, Modal } from '../../..';
import { formatTagKey } from '../../../../business/files';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { TagsCheckboxRow } from './TagsCheckboxRow';

interface Props {
  prefix: string;
  tags?: string[];
  mandatoryTags: string[];
  optionalTags: string[];
  isOpen: boolean;
  onSave: (tags: string[]) => Promise<void>;
  onClose: () => void;
}

export const TagsModal: React.FC<Props> = ({
  prefix,
  isOpen,
  mandatoryTags,
  optionalTags,
  tags = [],
  onSave,
  onClose,
}) => {
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedForms] = useState<string[]>(tags);
  const saveButton = buttonByKey(`${prefix}_modal_save`);

  useEffect(() => {
    setSelectedForms(tags);
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      headerTitle={labelByKey(`${prefix}_modal_title`)}
      onClose={handleClose}
      topCloseButton
      maxWidth="sm"
      aria-label={labelByKey('-')}
    >
      <Stack spacing={3} mb={12}>
        {mandatoryTags.map(tag => (
          <TagsCheckboxRow
            key={tag}
            id={tag}
            isChecked={selectedTags.includes(tag)}
            label={[labelByKey(`${prefix}_${formatTagKey(tag)}`), labelByKey(`${prefix}_required`)].join(' ')}
            onClick={handleCheckboxClick(tag)}
          />
        ))}
        {optionalTags.map(tag => (
          <TagsCheckboxRow
            key={tag}
            id={tag}
            isChecked={selectedTags.includes(tag)}
            label={labelByKey(`${prefix}_${formatTagKey(tag)}`)}
            onClick={handleCheckboxClick(tag)}
          />
        ))}
      </Stack>
      <Button {...saveButton} fullWidth disabled={!selectedTags.length} loading={loading} onClick={handleSave}>
        {saveButton?.text || `[[${prefix}_modal_save]]`}
      </Button>
    </Modal>
  );

  async function handleSave() {
    setLoading(true);
    try {
      await onSave(selectedTags);
    } catch {}
    setLoading(false);
  }

  function handleClose() {
    onClose();
  }

  function handleCheckboxClick(tag: string) {
    return () => {
      if (selectedTags.includes(tag)) {
        setSelectedForms(selectedTags.filter(t => t !== tag));
        return;
      }
      setSelectedForms([...selectedTags, tag]);
    };
  }
};
