import { Link, List, ListItem, Stack, Typography, dialogContentClasses, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContentFund } from '../../../../api/content/types/funds';
import { openInNewTab } from '../../../../business/navigation';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { EvaIcon } from '../../../EvaIcon';
import { Modal } from '../../../Modal';
import { Button } from '../../../buttons/Button';
import { CheckboxComponent } from '../../../form/CheckboxField';
import { TextField } from '../../../form/TextField';
import { parseGroupedFunds } from '../parsing';

interface Props {
  prefix: string;
  isOpen: boolean;
  rows: ContentFund[];
  selectedRows: ContentFund[];
  contentPanel?: React.ReactNode;
  errorPanel?: React.ReactNode;
  onSaved: (checked: string[]) => void;
  onClosed: () => void;
}

type SearchFormValues = { search: string };

export const FundsModal: React.FC<Props> = ({
  prefix,
  isOpen,
  rows,
  selectedRows,
  contentPanel,
  errorPanel,
  onSaved,
  onClosed,
}) => {
  const { labelByKey, buttonByKey, classifierByKey } = useGlobalsContext();
  const form = useForm<SearchFormValues>({ defaultValues: { search: '' }, mode: 'onBlur', shouldUnregister: true });
  const [checked, setChecked] = useState<Record<string, boolean>>(getDefaultChecked());
  const [query, setQuery] = useState('');
  const filteredRows = query ? rows.filter(row => row.fundName.toLowerCase().includes(query.toLowerCase())) : rows;
  const groupedRows = parseGroupedFunds(filteredRows, classifierByKey('Fund_group_order'));

  useEffect(() => {
    // Only initialize checked state when the modal opens or when selectedRows truly changes
    if (isOpen) {
      setChecked(getDefaultChecked());
    }
  }, [isOpen, selectedRows.length]);

  return (
    <Modal
      open={isOpen}
      headerTitle={labelByKey(`${prefix}_funds_modal_title`)}
      onClose={handleClose}
      topCloseButton
      disableTopPadding
      aria-label={labelByKey(`${prefix}_funds_modal_title`)}
      data-testid="funds-modal"
      sx={{
        maxHeight: 880,
        [`& .${dialogContentClasses.root}`]: {
          overflowY: 'hidden',
          pb: '62px',
        },
      }}
    >
      <Stack
        width={820}
        maxWidth="100%"
        height={600}
        maxHeight="calc(100vh - 250px)"
        overflow="scroll"
        sx={{ overflowX: 'hidden' }}
        mt={6}
        mb={6}
        pl={2}
        pb={2}
        pr={4}
        gap={6}
      >
        {contentPanel}
        <Stack gap={12}>
          <Stack gap={8}>
            <form onSubmit={form.handleSubmit(updateQueryFilter)} onReset={handleReset}>
              <Stack
                gap={4}
                direction="row"
                flexWrap="wrap"
                alignItems="flex-end"
                sx={{ div: { maxWidth: 330, flexGrow: 1 } }}
              >
                <TextField label={labelByKey(`${prefix}_modal_search_field`)} name="search" control={form.control} />
                <Stack direction="row" gap={4} alignItems="center" flexWrap="wrap">
                  <Button
                    {...buttonByKey(`${prefix}_modal_search`)}
                    buttonActionType="submit"
                    data-testid="submit-btn"
                  />
                  <Button
                    {...buttonByKey(`${prefix}_modal_clear_search`)}
                    buttonActionType="reset"
                    data-testid="reset-btn"
                  />
                </Stack>
              </Stack>

              <div className="visually-hidden" role="status">
                {!!query &&
                  labelByKey(`${prefix}_modal_search_results_count`, { count: filteredRows.length.toString(), query })}
              </div>
            </form>

            {!rows.length && errorPanel}

            {!filteredRows.length && (
              <Typography variant="body1">{labelByKey(`${prefix}_modal_search_failed`)}</Typography>
            )}

            <Stack gap={6} data-testid="groups-list">
              {Object.entries(groupedRows).map(([group, rows]) => (
                <Stack key={group}>
                  <Typography
                    component="h3"
                    variant="h4"
                    fontWeight="bold"
                    py={3}
                    px={6}
                    data-testid={`group-title-${group}`}
                  >
                    {group}
                  </Typography>
                  <StyledList key="group" data-testid={`group-${group}-list`}>
                    {rows.map(row => (
                      <ListItem key={row.fundCode}>
                        <CheckboxComponent<Record<string, boolean>>
                          key={row.fundName}
                          name={`fund-${row.fundCode}`}
                          value={!!checked[row.fundCode]}
                          label={row.fundName}
                          onChange={handleCheckboxClick(row)}
                        />
                        <Link
                          href={row.factsheetUrl}
                          onClick={handleFactsheetClick(row)}
                          data-testid={`group-${group}-list-item-${row.fundCode}`}
                          aria-label={labelByKey(`${prefix}_modal_download_factsheet_for`, { name: row.fundName })}
                        >
                          <Stack
                            direction="row"
                            gap={1}
                            alignItems="center"
                            justifyContent="flex-end"
                            sx={{ svg: { fill: theme => theme.palette.primary.main } }}
                          >
                            <Typography noWrap color="primary.main" display={{ xs: 'none', sm: 'block' }}>
                              {labelByKey(`${prefix}_modal_factsheet`, { name: row.fundName })}
                            </Typography>
                            <EvaIcon name="download-outline" width={32} height={32} ariaHidden />
                          </Stack>
                        </Link>
                      </ListItem>
                    ))}
                  </StyledList>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        gap={4}
        position="absolute"
        bottom={0}
        bgcolor="background.paper"
        width="100%"
        py={4}
        zIndex={2}
      >
        <Button {...buttonByKey(`${prefix}_modal_save`)} onClick={handleSave} data-testid="save-btn" />
        <Button {...buttonByKey(`${prefix}_modal_cancel`)} onClick={handleClose} data-testid="cancel-btn" />
      </Stack>
    </Modal>
  );

  function handleClose() {
    handleReset();
    onClosed();
  }

  function updateQueryFilter(values: SearchFormValues) {
    setQuery(values.search);
  }

  function handleReset() {
    form.reset();
    setQuery('');
  }

  function handleSave() {
    const checkedFunds = Object.entries(checked)
      .filter(([, checked]) => checked)
      .map(([code]) => code);
    onSaved(checkedFunds);
  }

  function handleCheckboxClick(row: ContentFund) {
    return () => setChecked(state => ({ ...state, [row.fundCode]: !state[row.fundCode] }));
  }

  function getDefaultChecked() {
    return selectedRows.reduce((acc, row) => ({ ...acc, [row.fundCode]: true }), {});
  }

  function handleFactsheetClick(row: ContentFund) {
    return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      openInNewTab(row.factsheetUrl);
    };
  }
};

const StyledList = styled(List)(({ theme }) => ({
  paddingTop: 0,
  marginBlockStart: 0,
  paddingInlineStart: 0,
  '& li': {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    wordBreak: 'break-word',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': { borderTop: `1px solid ${theme.palette.divider}` },
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.appColors.support80.transparentLight,
    },
  },
}));
