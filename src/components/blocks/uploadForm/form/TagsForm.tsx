import { Stack, Typography } from '@mui/material';
import { SuccessOutlinedIcon, WarningTriangleIcon } from '../../..';
import { formatTagKey } from '../../../../business/files';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { type UseModalProps } from '../../../../core/hooks/useModal';
import { TagsModal } from './TagsModal';

interface Props {
  prefix: string;
  mandatoryTags: string[];
  optionalTags: string[];
  initialTags?: string[];
  modalProps: UseModalProps;
  isTagUploaded(tag: string): boolean;
  onSave(tags: string[]): Promise<void>;
  onClose(): void;
}

export const TagsForm: React.FC<Props> = ({
  prefix,
  mandatoryTags,
  optionalTags,
  initialTags,
  modalProps,
  isTagUploaded,
  onSave,
  onClose,
}) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <Stack
      component="ul"
      sx={{ listStyleType: 'none', svg: { flexShrink: 0 } }}
      display="flex"
      flexDirection="column"
      gap={2}
      data-testid="tags-form"
    >
      {mandatoryTags.map(tag => (
        <Stack
          key={tag}
          component="li"
          direction="row"
          spacing={2}
          alignItems="flex-start"
          data-testid={`mandatory-${tag}`}
        >
          {isTagUploaded(tag) ? <SuccessOutlinedIcon /> : <WarningTriangleIcon />}
          <Typography>
            {[labelByKey(`${prefix}_${formatTagKey(tag)}`), labelByKey(`${prefix}_required`)].join(' ')}
          </Typography>
        </Stack>
      ))}
      {optionalTags.filter(Boolean).map(tag => (
        <Stack
          key={tag}
          component="li"
          direction="row"
          spacing={2}
          alignItems="flex-start"
          data-testid={`optional-${tag}`}
        >
          {isTagUploaded(tag) ? <SuccessOutlinedIcon /> : <WarningTriangleIcon />}
          <Typography>{labelByKey(`${prefix}_${formatTagKey(tag)}`)}</Typography>
        </Stack>
      ))}
      <TagsModal
        {...modalProps}
        prefix={prefix}
        onSave={onSave}
        onClose={onClose}
        tags={initialTags}
        mandatoryTags={mandatoryTags}
        optionalTags={optionalTags}
      />
    </Stack>
  );
};
