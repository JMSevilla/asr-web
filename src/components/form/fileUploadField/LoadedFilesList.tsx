import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useModal } from '../../../core/hooks/useModal';
import { DeleteIcon, EditIcon, FileIcon } from '../../icons';
import { RemoveModal } from './RemoveModal';

interface Props {
  prefix: string;
  files: FileWithTags[];
  isLoading?: boolean;
  noFilesUploadedLabel: string;
  uploadsColumnLabel: string;
  tagsColumnLabel: string;
  tagsColumnHidden?: boolean;
  tagLabelByKey?(key: string): string;
  onRemove(file: File): void;
  onEdit?(file: FileWithTags): void;
  clearInfoMessages(): void;
}

export type FileWithTags = { content: File; tags: string[] };

export const LoadedFilesList: React.FC<Props> = ({
  prefix,
  files,
  isLoading,
  noFilesUploadedLabel,
  uploadsColumnLabel,
  tagsColumnLabel,
  tagsColumnHidden,
  tagLabelByKey,
  onRemove,
  onEdit,
  clearInfoMessages,
}) => {
  const [index, setIndex] = useState<number>(0);
  const removeModal = useModal();

  return (
    <Table>
      <TableHead sx={{ th: { px: 6, fontWeight: 'bold', fontSize: theme => theme.typography.h5.fontSize } }}>
        <TableRow>
          <TableCell width="40%">{uploadsColumnLabel}</TableCell>
          {!tagsColumnHidden && <TableCell width="40%">{tagsColumnLabel}</TableCell>}
          <TableCell width="20%" />
        </TableRow>
      </TableHead>
      <TableBody
        sx={{
          boxShadow: theme => `0px -1px 0px 0px ${theme.palette.divider}`,
          tr: {
            borderTop: '1px solid',
            borderColor: 'divider',
            '&:last-of-type': { borderBottom: '1px solid', borderColor: 'divider' },
            '&:nth-of-type(2n - 1)': { backgroundColor: 'appColors.support80.transparentLight' },
          },
          td: { py: 6, px: 6, border: 'none', verticalAlign: 'top' },
        }}
      >
        {files.length === 0 && (
          <TableRow>
            <TableCell width="100%" colSpan={3}>
              <Typography component="span" color={theme => theme.palette.appColors.essential[500]}>
                {noFilesUploadedLabel}
              </Typography>
            </TableCell>
          </TableRow>
        )}
        {files.map((file, idx) => (
          <TableRow key={file.content.name} sx={{ borderTop: 'none' }}>
            <TableCell width="40%">
              <Stack direction="row" alignItems="flex-start" gap={2}>
                <Box width={24} height={24}>
                  <FileIcon width={24} height={24} />
                </Box>
                <Typography
                  component="span"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  maxWidth={{ xs: '10vw', sm: '30vw', md: 250 }}
                >
                  {file.content.name}
                </Typography>
              </Stack>
            </TableCell>
            {!tagsColumnHidden && (
              <TableCell width="40%">
                <Stack spacing={2}>
                  {file.tags.map((tag, idx) => (
                    <Typography component="span" key={tag} data-testid={`file-tag-${tag}`}>
                      {tagLabelByKey ? tagLabelByKey(tag) : tag}
                      {idx !== file.tags.length - 1 && '; '}
                    </Typography>
                  ))}
                </Stack>
              </TableCell>
            )}
            <TableCell width="20%">
              <Stack direction="row" spacing={2} justifyContent="flex-end" height={26}>
                {onEdit && (
                  <IconButton
                    onClick={() => onEdit(file)}
                    size="small"
                    disabled={isLoading}
                    aria-label="Edit file button"
                    data-testid={`edit-btn-${idx}`}
                    sx={{
                      color: 'text.primary',
                      height: 24,
                      width: 24,
                      path: { fill: theme => (isLoading ? theme.palette.text.disabled : theme.palette.text.primary) },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => handleRemoveModal(idx)}
                  size="small"
                  disabled={isLoading}
                  aria-label="Remove file button"
                  data-testid={`remove-btn-${idx}`}
                  sx={{
                    height: 24,
                    width: 24,
                    path: { fill: theme => (isLoading ? theme.palette.text.disabled : theme.palette.error.main) },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
        <RemoveModal
          {...removeModal.props}
          prefix={prefix}
          onRemove={() => {
            onRemove(files[index].content);
            removeModal.close();
          }}
          onClose={() => {
            clearInfoMessages();
            removeModal.close();
          }}
          name={files[index]?.content.name}
        />
      </TableBody>
    </Table>
  );

  async function handleRemoveModal(idx: number) {
    setIndex(idx);
    removeModal.open();
  }
};
